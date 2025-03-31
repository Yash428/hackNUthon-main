
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  isLogin?: boolean;
}

const AuthForm = ({ isLogin = false }: AuthFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear validation errors when user types
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: false });
    }
  };

  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    
    if (!isLogin && !formData.name.trim()) {
      errors.name = true;
    }
    
    if (!formData.email.trim()) {
      errors.email = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = true;
    }
    
    if (!formData.password) {
      errors.password = true;
    } else if (formData.password.length < 6) {
      errors.password = true;
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = true;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Shake form on validation error
      const form = document.getElementById("auth-form");
      if (form) {
        form.classList.add("animate-shake");
        setTimeout(() => {
          form.classList.remove("animate-shake");
        }, 500);
      }
      
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check the form for errors.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Login user with Supabase
        console.log("Attempting login with:", formData.email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error;
        
        console.log("Login successful, session:", data.session);
        toast({
          title: "Login Successful",
          description: "Welcome back to CellScan!",
        });
        
        // Redirect to dashboard
        navigate("/dashboard");
        
      } else {
        // Register user with Supabase
        console.log("Attempting registration with:", formData.email);
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            },
          },
        });
        
        if (error) {
          console.error("Registration error:", error);
          throw error;
        }
        
        console.log("Registration response:", data);
        
        // Check if email confirmation is required
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          toast({
            title: "User already exists",
            description: "Please login instead",
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Account Created",
          description: "Your account has been created successfully.",
        });
        
        // If email confirmation is required
        if (data.user && !data.session) {
          toast({
            title: "Email Confirmation Required",
            description: "Please check your email to confirm your account.",
          });
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          // If email confirmation is not required, redirect to dashboard
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full p-8 glassmorphism rounded-xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">
          {isLogin ? "Welcome Back!" : "Join CellScan"}
        </h2>
        <p className="text-gray-600">
          {isLogin 
            ? "Log in to continue your quirky cancer detection journey" 
            : "Sign up to start your quirky cancer detection journey"}
        </p>
      </div>
      
      <form id="auth-form" onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${validationErrors.name ? "border-red-500" : ""}`}
                placeholder="Your Name Here"
                disabled={isLoading}
              />
              {validationErrors.name && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                  <X size={18} />
                </div>
              )}
            </div>
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-500">Name is required</p>
            )}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${validationErrors.email ? "border-red-500" : ""}`}
              placeholder="your.email@example.com"
              disabled={isLoading}
            />
            {validationErrors.email ? (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                <X size={18} />
              </div>
            ) : formData.email && !validationErrors.email && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                <Check size={18} />
              </div>
            )}
          </div>
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-500">Valid email is required</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input pr-10 ${validationErrors.password ? "border-red-500" : ""}`}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-500">Password must be at least 6 characters</p>
          )}
        </div>
        
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input pr-10 ${validationErrors.confirmPassword ? "border-red-500" : ""}`}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">Passwords don't match</p>
            )}
          </div>
        )}
        
        {isLogin && (
          <div className="flex justify-end">
            <Link to="#" className="text-sm text-cancer-blue hover:text-cancer-purple">
              Forgot password?
            </Link>
          </div>
        )}
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full mt-6"
          disabled={isLoading}
        >
          {isLoading 
            ? (isLogin ? "Logging in..." : "Signing up...") 
            : (isLogin ? "Login!" : "Sign Up!")}
        </motion.button>
        
        <div className="mt-6 text-center text-sm">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-cancer-blue hover:text-cancer-purple font-medium">
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-cancer-blue hover:text-cancer-purple font-medium">
                Log in
              </Link>
            </p>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default AuthForm;
