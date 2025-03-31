
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";

const SignUp = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-gradient-to-br from-cancer-pink to-cancer-purple opacity-20 blur-xl animate-pulse"
          ></motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-cancer-blue to-cancer-teal opacity-20 blur-xl animate-pulse"
          ></motion.div>
          
          <AuthForm isLogin={false} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUp;
