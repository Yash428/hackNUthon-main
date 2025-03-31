
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const CLOUDINARY_CLOUD_NAME = "dywlcf7kr";
const CLOUDINARY_API_KEY = "566438968171594";
const CLOUDINARY_API_SECRET = "Yhei-AiTK8qh1UDpfwu2anIbV-w";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const { image, fileName } = await req.json();
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: "No image data provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Strip the data URL prefix (e.g., "data:image/jpeg;base64,")
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    
    // Create a unique upload timestamp
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    
    // Generate the signature for Cloudinary upload
    const encoder = new TextEncoder();
    const data = encoder.encode(`public_id=${fileName}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    
    // Prepare form data for Cloudinary upload
    const formData = new FormData();
    formData.append("file", `data:image/jpeg;base64,${base64Data}`);
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", hashHex);
    formData.append("public_id", fileName);
    
    // Upload to Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    
    const cloudinaryData = await uploadResponse.json();
    
    if (uploadResponse.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          url: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      console.error("Cloudinary error:", cloudinaryData);
      return new Response(
        JSON.stringify({ error: "Failed to upload to Cloudinary", details: cloudinaryData }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
