
import { motion } from "framer-motion";
import { Search, Brain, FileCheck, Target } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Image Scanning",
    description: "Upload your medical images through our quirky scanner interface. Our system accepts various formats including MRIs, CT scans, and microscope slides.",
    color: "cancer-blue"
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our playful but powerful neural networks analyze your images pixel by pixel, identifying patterns that might indicate cancerous cells.",
    color: "cancer-purple"
  },
  {
    icon: FileCheck,
    title: "Biomarker Detection",
    description: "The system checks for known cancer biomarkers and cellular abnormalities, comparing against a vast database of verified cases.",
    color: "cancer-teal"
  },
  {
    icon: Target,
    title: "Results & Recommendations",
    description: "Receive your quirky yet informative diagnosis with visual representations and recommended next steps for your healthcare journey.",
    color: "cancer-pink"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-gradient-to-br from-white to-cancer-blue/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Our
              <span className="text-gradient bg-gradient-to-r from-cancer-purple to-cancer-blue bg-clip-text text-transparent ml-2">
                Scanner
              </span>{" "}
              Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A glimpse into our eccentric yet efficient cancer detection process
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* Central line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cancer-blue via-cancer-purple to-cancer-pink rounded-full hidden md:block transform -translate-x-1/2"></div>

          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-8`}
              >
                {/* Content */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <h3 className="text-2xl font-bold mb-3 flex items-center md:justify-start gap-3">
                    <span className={`flex md:order-${index % 2 === 0 ? "last" : "first"}`}>
                      <step.icon className={`w-6 h-6 text-${step.color}`} />
                    </span>
                    <span>Step {index + 1}: {step.title}</span>
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {/* Center circle for timeline */}
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white border-4 border-cancer-blue shadow-lg relative z-10 animate-bounce-light">
                  <span className="text-cancer-dark font-bold">{index + 1}</span>
                </div>

                {/* Illustration */}
                <div className="md:w-1/2">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className={`w-full max-w-md mx-auto h-56 rounded-xl border-2 border-${step.color}/30 bg-white/80 flex items-center justify-center overflow-hidden relative group`}
                  >
                    {/* Step-specific illustrations */}
                    {index === 0 && (
                      <div className="relative w-32 h-32">
                        <div className="absolute inset-0 rounded-full bg-cancer-blue/10 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-cancer-blue/20 animate-pulse flex items-center justify-center">
                            <Search className="w-10 h-10 text-cancer-blue" />
                          </div>
                        </div>
                        <div className="absolute inset-0 border-2 border-dashed border-cancer-blue/30 rounded-full animate-rotate-slow"></div>
                      </div>
                    )}

                    {index === 1 && (
                      <div className="relative w-40 h-40">
                        <div className="absolute inset-0 rounded-full bg-cancer-purple/10">
                          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-cancer-purple/20 animate-pulse"></div>
                        </div>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0"
                        >
                          <div className="absolute top-0 left-1/2 w-2 h-2 bg-cancer-purple rounded-full transform -translate-x-1/2"></div>
                          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-cancer-purple rounded-full transform -translate-x-1/2"></div>
                          <div className="absolute left-0 top-1/2 w-2 h-2 bg-cancer-purple rounded-full transform -translate-y-1/2"></div>
                          <div className="absolute right-0 top-1/2 w-2 h-2 bg-cancer-purple rounded-full transform -translate-y-1/2"></div>
                        </motion.div>
                        <Brain className="absolute inset-0 m-auto w-16 h-16 text-cancer-purple" />
                      </div>
                    )}

                    {index === 2 && (
                      <div className="grid grid-cols-3 grid-rows-3 gap-2 w-40 h-40">
                        {[...Array(9)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`rounded-md bg-cancer-teal/10 flex items-center justify-center ${
                              i === 4 ? "bg-cancer-teal/30" : ""
                            }`}
                            whileHover={{ scale: 1.2, backgroundColor: "rgba(51, 195, 240, 0.3)" }}
                          >
                            {i === 4 && <FileCheck className="w-6 h-6 text-cancer-teal" />}
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {index === 3 && (
                      <div className="relative w-40 h-40">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.5 }}
                          animate={{ scale: [0.8, 1.1, 0.9], opacity: [0.5, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border-2 border-cancer-pink/30"
                        ></motion.div>
                        <motion.div
                          initial={{ scale: 0.6, opacity: 0.5 }}
                          animate={{ scale: [0.6, 0.9, 0.7], opacity: [0.5, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          className="absolute inset-5 rounded-full border-2 border-cancer-pink/50"
                        ></motion.div>
                        <div className="absolute inset-10 rounded-full bg-cancer-pink/20 flex items-center justify-center">
                          <Target className="w-10 h-10 text-cancer-pink" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
