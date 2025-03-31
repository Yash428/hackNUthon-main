import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import {
  Home,
  User,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
  Clipboard
} from "lucide-react";

interface DashboardSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const DashboardSidebar = ({ isCollapsed, setIsCollapsed }: DashboardSidebarProps) => {
  const [userData, setUserData] = useState<{ name: string, email: string }>({ name: "Guest", email: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  useEffect(() => {
    // Get user data from Supabase
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log("User data from Supabase:", user);
        const fullName = user.user_metadata?.full_name || "User";
        setUserData({ 
          name: fullName,
          email: user.email || ""
        });
        
        // Store in localStorage for components that need it
        localStorage.setItem("user", JSON.stringify({ name: fullName, email: user.email }));
      }
    };
    
    getUserData();
  }, []);
  
  const navItems = [
    { icon: Home, label: t("navigation.dashboard"), path: "/dashboard" },
    { icon: Activity, label: t("navigation.scans"), path: "/scans" },
    { icon: Clipboard, label: t("navigation.quiz"), path: "/quiz" },
    { icon: User, label: t("navigation.profile"), path: "/profile" },
    { icon: Settings, label: t("navigation.settings"), path: "/settings" },
    { icon: HelpCircle, label: t("navigation.help"), path: "/help" },
  ];

  const handleLogout = async () => {
    try {
      console.log("Logging out user...");
      toast({
        title: "Logging out...",
        description: "You've been successfully logged out.",
      });
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("Logout successful");
      localStorage.removeItem("user");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        variant: "destructive",
        title: "Logout Error",
        description: "There was a problem logging you out. Please try again.",
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className={`h-screen bg-white border-r border-cancer-blue/10 shadow-sm flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-cancer-blue/10">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cancer-blue to-cancer-purple flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">CS</span>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-exo font-bold text-cancer-dark">
              Cell<span className="text-cancer-blue">Scan</span>
            </span>
          )}
        </Link>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* User info */}
      <div className={`p-4 border-b border-cancer-blue/10 ${isCollapsed ? "flex justify-center" : ""}`}>
        {isCollapsed ? (
          <div className="w-10 h-10 rounded-full bg-cancer-purple/10 flex items-center justify-center">
            <span className="text-cancer-purple font-bold">{userData.name.charAt(0)}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-cancer-purple/10 flex items-center justify-center">
              <span className="text-cancer-purple font-bold">{userData.name.charAt(0)}</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">{t("common.welcome")}, {userData.name}!</h4>
              <p className="text-xs text-gray-500">{t("dashboard.welcome")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                  isActive(item.path) 
                    ? "bg-cancer-blue/10 text-cancer-blue" 
                    : "hover:bg-cancer-blue/5 text-gray-700 hover:text-cancer-blue"
                } transition-colors`}
              >
                <item.icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}

          <li>
            <Link
              to="/chatbot"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                isActive("/chatbot") 
                  ? "bg-cancer-blue/10 text-cancer-blue" 
                  : "hover:bg-cancer-blue/5 text-gray-700 hover:text-cancer-blue"
              } transition-colors`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              {!isCollapsed && <span className="ml-2">{t("navigation.chatbot")}</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Language Selector */}
      <LanguageSelector isCollapsed={isCollapsed} />

      {/* Logout button */}
      <div className="p-4 border-t border-cancer-blue/10">
        <button
          onClick={handleLogout}
          className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>{t("auth.signOut")}</span>}
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
