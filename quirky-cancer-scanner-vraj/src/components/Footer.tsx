
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, url: "#", label: "GitHub" },
    { icon: Twitter, url: "#", label: "Twitter" },
    { icon: Linkedin, url: "#", label: "LinkedIn" },
    { icon: Instagram, url: "#", label: "Instagram" }
  ];

  return (
    <footer className="bg-white pt-16 pb-8 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cancer-blue to-cancer-purple flex items-center justify-center">
                <span className="text-white font-bold text-sm">CS</span>
              </div>
              <span className="text-lg font-exo font-bold text-cancer-dark">
                Cell<span className="text-cancer-blue">Scan</span>
              </span>
            </Link>
            <p className="text-gray-600 mb-4">
              Revolutionizing cancer detection with quirky yet powerful AI technology.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-cancer-blue" />
                <span>contact@cellscan.ai</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-cancer-blue" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-cancer-blue" />
                <span>123 Innovation Way, Tech City</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-cancer-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-gray-600 hover:text-cancer-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/#features" className="text-gray-600 hover:text-cancer-blue transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-gray-600 hover:text-cancer-blue transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-cancer-blue transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-600 hover:text-cancer-blue transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-600 hover:text-cancer-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-cancer-blue transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-cancer-blue transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-cancer-blue transition-colors">
                  HIPAA Compliance
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-600 hover:text-cancer-blue transition-colors">
                  Data Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Stay Connected</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our quirky newsletter for the latest updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-lg border-2 border-r-0 border-cancer-blue/30 focus:outline-none focus:border-cancer-blue flex-1"
              />
              <button className="bg-cancer-blue text-white px-4 py-2 rounded-r-lg hover:bg-cancer-teal transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © {currentYear} CellScan. All rights reserved.
          </p>

          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-cancer-blue hover:text-white transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
