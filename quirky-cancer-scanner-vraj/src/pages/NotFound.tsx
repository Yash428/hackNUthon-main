
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center mx-auto relative overflow-hidden">
                {/* Lost cell with flashlight */}
                <div className="w-24 h-24 rounded-full bg-cancer-blue/20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      x: [10, -10, 10],
                      y: [5, -5, 5],
                      rotate: [5, -5, 5]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 3,
                      ease: "easeInOut" 
                    }}
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-cancer-blue/40 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-cancer-blue/60"></div>
                      </div>
                      <motion.div
                        animate={{ rotate: [0, 20, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 5 }}
                        className="absolute -right-2 -top-2 transform rotate-45"
                      >
                        <div className="w-6 h-10 bg-yellow-300/80 rounded-t-full"></div>
                        <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[16px] border-l-transparent border-r-transparent border-t-yellow-300/80"></div>
                      </motion.div>
                      <motion.div
                        animate={{ 
                          width: ["0%", "100%", "0%"],
                          opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 2,
                          ease: "easeInOut" 
                        }}
                        className="absolute right-0 top-0 h-10 bg-yellow-100/40 rounded-full"
                        style={{ transformOrigin: "right center" }}
                      ></motion.div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Floating cells */}
                <motion.div
                  animate={{ 
                    y: [-20, 20, -20],
                    x: [10, 30, 10]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 5,
                    ease: "easeInOut" 
                  }}
                  className="absolute top-10 left-10 w-6 h-6 rounded-full bg-cancer-purple/30"
                ></motion.div>
                
                <motion.div
                  animate={{ 
                    y: [10, -10, 10],
                    x: [-5, -25, -5]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 7,
                    ease: "easeInOut" 
                  }}
                  className="absolute bottom-10 right-10 w-4 h-4 rounded-full bg-cancer-pink/30"
                ></motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
            <h2 className="text-2xl font-bold mb-4 text-gray-700">
              Uh-oh! Seems the cells are lost in the code!
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We've dispatched our quirkiest scanning cells to find what you're looking for,
              but they're having trouble locating the page you requested.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Take Me Home
                </motion.button>
              </Link>
              
              <Link to="/#features">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Explore Features
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
