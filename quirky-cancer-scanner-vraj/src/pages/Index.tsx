import * as React from "react";
import * as ReactRouter from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";

const Index = () => {
  const location = ReactRouter.useLocation();

  React.useEffect(() => {
    // Handle smooth scrolling when hash changes
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (location.pathname === "/") {
      // If no hash and we're on home route, scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <Hero />
        
        <div
          id="about"
          className="py-20 px-4 scroll-mt-20"
        >
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              About Our
              <span className="text-gradient bg-gradient-to-r from-cancer-blue to-cancer-purple bg-clip-text text-transparent ml-2">
                Technology
              </span>
            </h2>
            
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              CellScan combines cutting-edge AI with a playful interface to make cancer detection both more accurate and less intimidating. Our technology analyzes cellular patterns and biomarkers with unparalleled precision while presenting results in an accessible, human-friendly way.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-cancer-blue/10 hover:border-cancer-blue/30 transition-all">
                <div className="w-16 h-16 rounded-full bg-cancer-blue/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-cancer-blue">~80%</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Detection Rate</h3>
                <p className="text-gray-600">Our AI system achieves high detection rates across various types of medical imaging.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-cancer-purple/10 hover:border-cancer-purple/30 transition-all">
                <div className="w-16 h-16 rounded-full bg-cancer-purple/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-cancer-purple">2x</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Faster Analysis</h3>
                <p className="text-gray-600">Get preliminary results faster than traditional methods while maintaining accuracy.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-cancer-teal/10 hover:border-cancer-teal/30 transition-all">
                <div className="w-16 h-16 rounded-full bg-cancer-teal/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-cancer-teal">24/7</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Always Available</h3>
                <p className="text-gray-600">Access our platform anytime, anywhere, with reliable uptime and support.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div id="features" className="scroll-mt-20">
          <Features />
        </div>
        
        <div id="how-it-works" className="scroll-mt-20">
          <HowItWorks />
        </div>
      </main>
      
      <div className="py-4 text-center text-gray-600 text-sm border-t border-gray-100">
        © 2025 CellScan. All rights reserved.
      </div>
    </div>
  );
};

export default Index;
