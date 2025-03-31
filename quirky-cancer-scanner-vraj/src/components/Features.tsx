import { motion } from "framer-motion";
import { Lightbulb, Search, Brain, Activity, MousePointer } from "lucide-react";

const featureData = [
  {
    icon: Search,
    title: "Advanced Cell Detection",
    description: "Our AI-powered system assists in identifying cellular patterns with high accuracy, supporting medical professionals in their diagnosis.",
    color: "cancer-blue"
  },
  {
    icon: Brain,
    title: "Neural Pattern Analysis",
    description: "Using advanced machine learning to analyze cellular patterns and identify potential biomarkers for further medical review.",
    color: "cancer-purple" 
  },
  {
    icon: Activity,
    title: "Real-time Analysis",
    description: "Get preliminary scan results quickly while maintaining high standards of accuracy and reliability.",
    color: "cancer-teal"
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    description: "Receive data-driven suggestions for next steps based on scan results, always in consultation with healthcare providers.",
    color: "cancer-pink"
  }
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section id="features" className="py-20 px-4 relative">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cancer-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cancer-purple/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient bg-gradient-to-r from-cancer-blue to-cancer-purple bg-clip-text text-transparent">
                Quirky Features
              </span>{" "}
              with Serious Results
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines playful design with cutting-edge technology to revolutionize cancer detection.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featureData.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={itemVariants}
            >
              <MousePointer className="absolute top-2 right-2 w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className={`w-16 h-16 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4`}>
                <feature.icon className={`w-8 h-8 text-${feature.color}`} />
              </div>

              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
