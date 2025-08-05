import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Video, 
  MessageCircle, 
  Languages, 
  MoreHorizontal,
  Plus
} from "lucide-react";
import botsrherelogo from "@/assets/botsrhere-logo.png";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

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

      {/* Products Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs font-medium text-sidebar-foreground/60 mb-2 uppercase tracking-wider">
          Products
        </div>
        <div className="space-y-1">
          <Link to="/video-studio">
            <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" size="sm">
              <Video className="w-4 h-4" />
              {!isCollapsed && <span>Video Studio</span>}
            </Button>
          </Link>
          <Link to="/video-translate">
            <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" size="sm">
              <Languages className="w-4 h-4" />
              {!isCollapsed && <span>Video Translate</span>}
            </Button>
          </Link>
          <Link to="/agents">
            <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" size="sm">
              <MessageCircle className="w-4 h-4" />
              {!isCollapsed && <span>Agents</span>}
            </Button>
          </Link>
          <Link to="/avatars">
            <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" size="sm">
              <Users className="w-4 h-4" />
              {!isCollapsed && <span>Avatars</span>}
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border">
        <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" size="sm">
          <MoreHorizontal className="w-4 h-4" />
          {!isCollapsed && <span>Apps</span>}
        </Button>
      </div>
    </div>
  );
}