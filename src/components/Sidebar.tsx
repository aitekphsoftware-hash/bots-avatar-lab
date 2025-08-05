import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Home, 
  Users, 
  Video, 
  MessageCircle, 
  Languages, 
  MoreHorizontal,
  Plus,
  LogOut
} from "lucide-react";
import botsrherelogo from "@/assets/botsrhere-logo.png";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Users, label: "Avatars", path: "/avatars" },
    { icon: Video, label: "Video Studio", path: "/video-studio" },
    { icon: Languages, label: "Video Translate", path: "/video-translate" },
    { icon: MessageCircle, label: "Agents", path: "/agents" },
  ];

  return (
    <div className={`bg-sidebar border-r border-sidebar-border flex flex-col h-screen ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src={botsrherelogo} alt="BotsRHere" className="w-8 h-8" />
          {!isCollapsed && <span className="text-lg font-semibold text-sidebar-foreground">BotsRHere</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 text-left ${
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
                size="sm"
              >
                <Icon className="w-4 h-4" />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>


      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button 
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-3"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" size="sm">
          <MoreHorizontal className="w-4 h-4" />
          {!isCollapsed && <span>Apps</span>}
        </Button>
      </div>
    </div>
  );
}