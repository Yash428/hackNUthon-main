from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import io
import cv2
import numpy as np
import tensorflow as tf
import joblib
import os
import google.generativeai as genai
from dotenv import load_dotenv
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Load models asynchronously
def load_models():
    return {
        "Brain": tf.keras.models.load_model("models/brain_tumor_model_20250304-130422.h5"),
        "Skin": tf.keras.models.load_model("models/skin.h5"),
        "Kidney": tf.keras.models.load_model("models/Inception01.h5"),
        "Oral": joblib.load("models/random_forest_model.joblib")
    }

models = load_models()

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def configure_genai(api_key):
    genai.configure(api_key=api_key)

async def classify_disease_category(image):
    model = genai.GenerativeModel("gemini-1.5-pro")
    prompt = """
    Analyze this medical image and determine which disease category it belongs to.
    Classify it as ONE of the following categories ONLY:
    - Brain
    - Skin
    - Kidney
    - Oral
    - Other (if it doesn't fit the above categories)
    Only return the category name.
    """
    response = model.generate_content([prompt, image])
    return response.text.strip()

async def process_disease_image(image):
    disease_category = await classify_disease_category(image)
    accepted_categories = ["Brain", "Skin", "Kidney", "Oral"]
    
    if disease_category in accepted_categories:
        return {
            "status": "success",
            "message": f"Classified as {disease_category}",
            "category": disease_category,
            "results": await route_to_disease_model(image, disease_category)
        }
    return {
        "status": "error",
        "message": "Unrecognized category",
        "detected_category": disease_category
    }

async def route_to_disease_model(image, disease_category):
    image1 = image
    image = image.resize((224, 224))
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)

    if disease_category == "Kidney":
        yhat = models["Kidney"].predict(image_array)
        labels = {0: "Cyst", 1: "Normal", 2: "Stone", 3: "Cancer"}
        return {"findings": labels[np.argmax(yhat)]}
    
    elif disease_category == "Oral":
        img = np.array(image1)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img = cv2.resize(img, (224, 224))
        img_flattened = img.flatten().reshape(1, -1)
        prediction = models["Oral"].predict(img_flattened)
        return {"findings": prediction[0]}
    
    elif disease_category == "Brain":
        image = image1.resize((250, 250))
        image_array = np.array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)
        yhat = models["Brain"].predict(image_array)
        return {"findings": "Yes" if yhat >= 0.5 else "No"}
    elif disease_category == "Skin":
        image = image1.resize((100, 125))
        image_array = np.array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)
        yhat = models["Skin"].predict(image_array)
        labels = {
            0: "Actinic Keratoses and Intraepithelial Carcinoma",
            1: "Basal Cell Carcinoma",
            2: "Benign Keratosis-Like Lesions",
            3: "Dermatofibroma",
            4: "Melanoma",
            5: "Melanocytic Nevus",
            6: "Vascular Lesions"
        }
        return {"findings": labels[np.argmax(yhat)]}
    else:
        return {"result": "Service not available"}

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        configure_genai(GEMINI_API_KEY)
        result = await process_disease_image(image)
        return JSONResponse(content={"filename": file.filename, "result": result})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
