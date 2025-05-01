import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ClipboardList, 
  LineChart, 
  DollarSign, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { addActivity } from "@/utils/activityLogger";

export type SidebarPosition = "left" | "right" | "bottom";

interface MovableSidebarProps {
  position: SidebarPosition;
  onPositionChange: (position: SidebarPosition) => void;
}

const MovableSidebar = ({ position, onPositionChange }: MovableSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Successfully logged out");
    // Log activity
    addActivity({
      type: "user_logout",
      details: "User logged out",
      timestamp: new Date().toISOString(),
    });
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Projects", icon: ClipboardList, path: "/admin/projects" },
    { name: "Quests", icon: LineChart, path: "/admin/quests" },
    { name: "Roadmaps", icon: LineChart, path: "/admin/roadmaps" },
    { name: "Budgets", icon: DollarSign, path: "/admin/budgets" },
    { name: "Team", icon: Users, path: "/admin/team" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const isHorizontal = position === "bottom";

  // Position-specific styles
  const sidebarPositionStyles = {
    left: "border-r",
    right: "border-l",
    bottom: "border-t"
  };

  // Layout-specific styles
  const containerStyles = {
    left: `bg-white border-gray-200 transition-width ease-in-out duration-300 flex flex-col h-screen ${
      collapsed ? "w-[80px]" : "w-[250px]"
    } ${sidebarPositionStyles[position]}`,
    right: `bg-white border-gray-200 transition-width ease-in-out duration-300 flex flex-col h-screen ${
      collapsed ? "w-[80px]" : "w-[250px]"
    } ${sidebarPositionStyles[position]}`,
    bottom: `bg-white border-gray-200 transition-height ease-in-out duration-300 flex flex-row h-[${
      collapsed ? "60px" : "120px"
    }] w-full ${sidebarPositionStyles[position]}`
  };

  return (
    <div className={containerStyles[position]}>
      <div className={`p-4 ${isHorizontal ? "border-r" : "border-b"} border-gray-200 flex items-center justify-between`}>
        <NavLink to="/admin/dashboard" className="flex items-center">
          {!collapsed && (
            <img 
              src="/lovable-uploads/f44da06d-430c-4883-a4c2-fc7c23f90541.png" 
              alt="Next Quest Logo" 
              className="h-8 w-auto"
            />
          )}
          {collapsed && (
            <img 
              src="/lovable-uploads/f44da06d-430c-4883-a4c2-fc7c23f90541.png" 
              alt="Next Quest Logo" 
              className="h-6 w-auto"
            />
          )}
        </NavLink>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="text-gray-500 hover:bg-gray-100"
              >
                <RotateCcw size={14} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-52" align="end">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPositionChange("left")}
                  className={position === "left" ? "bg-primary/10 text-primary-foreground" : ""}
                >
                  <ArrowLeft size={14} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPositionChange("bottom")}
                  className={position === "bottom" ? "bg-primary/10 text-primary-foreground" : ""}
                >
                  <ArrowDown size={14} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPositionChange("right")}
                  className={position === "right" ? "bg-primary/10 text-primary-foreground" : ""}
                >
                  <ArrowRight size={14} />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-500 hover:bg-gray-100"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </Button>
        </div>
      </div>
      
      <div className={`${isHorizontal ? "flex-row overflow-x-auto" : "flex-col overflow-y-auto"} flex-1 py-4`}>
        <nav className={`${isHorizontal ? "flex flex-row space-x-1" : "space-y-1"} px-2`}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-100"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className={`p-4 ${isHorizontal ? "border-l" : "border-t"} border-gray-200`}>
        <Button
          variant="ghost"
          className={`w-full flex items-center text-red-500 hover:bg-red-50 ${
            collapsed ? "justify-center px-2" : ""
          }`}
          onClick={handleLogout}
        >
          <LogOut className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default MovableSidebar;
