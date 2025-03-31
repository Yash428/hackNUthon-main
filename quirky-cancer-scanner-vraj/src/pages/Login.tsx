import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // If user is logged in, navigate to dashboard or the page they tried to access
        const from = (location.state as any)?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      }
    };
    
    checkAuth();
  }, [navigate, location]);
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-gradient-to-br from-cancer-blue to-cancer-purple opacity-20 blur-xl animate-pulse"
          ></motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-cancer-purple to-cancer-pink opacity-20 blur-xl animate-pulse"
          ></motion.div>
          
          <AuthForm isLogin />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
