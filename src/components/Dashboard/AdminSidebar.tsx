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
  Trophy,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { logoutUser } from "@/utils/authUtils";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Call the logoutUser function which handles redirection internally
    logoutUser();
    toast.success("Successfully logged out");
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Projects", icon: ClipboardList, path: "/admin/projects" },
    { name: "Quests", icon: Trophy, path: "/admin/quests" },
    { name: "Roadmaps", icon: LineChart, path: "/admin/roadmaps" },
    { name: "Budgets", icon: DollarSign, path: "/admin/budgets" },
    { name: "Team", icon: Users, path: "/admin/team" },
    { name: "Leaderboards", icon: Star, path: "/admin/leaderboards" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <div 
      className={`bg-background border-r border-border transition-width ease-in-out duration-300 flex flex-col h-screen ${
        collapsed ? "w-[70px]" : "w-[230px]"
      }`}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <NavLink to="/admin/dashboard" className="flex items-center">
          {!collapsed && (
            <img 
              src="/lovable-uploads/f44da06d-430c-4883-a4c2-fc7c23f90541.png" 
              alt="Next Quest Logo" 
              className="h-7 w-auto"
            />
          )}
          {collapsed && (
            <img 
              src="/lovable-uploads/f44da06d-430c-4883-a4c2-fc7c23f90541.png" 
              alt="Next Quest Logo" 
              className="h-5 w-auto"
            />
          )}
        </NavLink>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border-l-4 border-primary pl-2"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-2.5"}`} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-3 border-t border-[#E5E5EA]">
        <Button
          variant="ghost"
          className={`w-full flex items-center text-red-500 hover:bg-[#F5F5F7] ${
            collapsed ? "justify-center px-2" : ""
          }`}
          onClick={handleLogout}
        >
          <LogOut className={`h-5 w-5 ${collapsed ? "" : "mr-2.5"}`} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
