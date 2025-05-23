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
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const MovableSidebar = ({ position, onPositionChange, collapsed, setCollapsed }: MovableSidebarProps) => {
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
  //  {name: "Move Sidebar", icon: ClipboardList}
  ];




/* <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
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
                  className={position === "left" ? "bg-primary/10" : ""}
                >
                  <ArrowLeft size={14} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPositionChange("bottom")}
                  className={position === "bottom" ? "bg-primary/10" : ""}
                >
                  <ArrowDown size={14} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onPositionChange("right")}
                  className={position === "right" ? "bg-primary/10" : ""}
                >
                  <ArrowRight size={14} />
                </Button>
              </div>
            </PopoverContent>
          </Popover> */






  const isHorizontal = position === "bottom";

  // Position-specific styles
  const sidebarPositionStyles = {
    left: "border-r",
    right: "border-l",
    bottom: "border-t"
  };

  // Layout-specific styles
  const containerStyles = {
    left: `bg-background border-border transition-width ease-in-out duration-300 flex flex-col h-screen ${
      collapsed ? "w-[80px]" : "w-[250px]"
    } ${sidebarPositionStyles[position]}`,
    right: `bg-background border-border transition-width ease-in-out duration-300 flex flex-col h-screen ${
      collapsed ? "w-[80px]" : "w-[250px]"
    } ${sidebarPositionStyles[position]}`,
    bottom: `bg-background border-border transition-height ease-in-out duration-300 flex flex-row h-[${
      collapsed ? "60px" : "120px"
    }] w-full ${sidebarPositionStyles[position]}`
  };

  return (
    <div className={containerStyles[position]}>
      <div className={`p-4 ${isHorizontal ? "border-r" : "border-b"} border-border flex items-center justify-between`}>
        <NavLink to="/admin/dashboard" className="flex items-center">
          {!collapsed && (
            <img 
              src="/lovable-uploads/f44da06d-430c-4883-a4c2-fc7c23f90541.png" 
              alt="Next Quest Logo" 
              className="h-8 w-auto"
            />
          )}
        </NavLink>
        
        <div className="flex items-center gap-2">
          
          <Button 
            variant="ghost" 
            size="icon"
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
                    : "text-muted-foreground hover:bg-accent"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className={`p-4 ${isHorizontal ? "border-l" : "border-t"} border-border`}>
        <Button
          variant="ghost"
          className={`w-full flex items-center text-destructive hover:bg-destructive/10 ${
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
