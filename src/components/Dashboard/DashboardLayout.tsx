import { ReactNode, useState, useEffect } from "react";
import MovableSidebar, { SidebarPosition } from "./MovableSidebar";
import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { updateLastActivity, logoutUser } from "@/utils/authUtils";
import { API } from "@/config";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>(() => {
    return (localStorage.getItem("fluxSidebarPosition") as SidebarPosition) || "left";
  });
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("fluxUser") || '{"name":"User"}');
  });
  
  useEffect(() => {
    updateLastActivity();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "fluxUser" && e.newValue) {
        setUser(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  
  useEffect(() => {
    localStorage.setItem("fluxSidebarPosition", sidebarPosition);
  }, [sidebarPosition]);

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";
  
  const handlePositionChange = (position: SidebarPosition) => {
    setSidebarPosition(position);
  };
  
  const handleLogout = async () => {
    await fetch(`${API}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    logoutUser();
  };
  
  return (
    <div 
      className="flex h-screen"
      style={{ backgroundColor: currentTheme.colors.background }}
    >
      {sidebarPosition === "left" && (
        <MovableSidebar 
          position={sidebarPosition}
          onPositionChange={handlePositionChange}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header 
          className="px-6 py-3 shadow-sm border-b"
          style={{ 
            backgroundColor: currentTheme.colors.background,
            borderColor: currentTheme.colors.border
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/f44da06d-430c-4883-a4c2-fc7c23f90541.png" 
                alt="Next Quest Logo" 
                className="h-8 w-auto mr-4"
              />
              <div className="max-w-md w-full relative">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: currentTheme.colors.accent }}
                />
                <Input 
                  type="search" 
                  placeholder="Search projects, roadmaps, tasks..."
                  className="pl-10"
                  style={{
                    backgroundColor: currentTheme.colors.secondary,
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text
                  }}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ThemeSwitcher />
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                style={{
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text
                }}
              >
                <Plus className="h-4 w-4" /> New
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative hover:opacity-80 transition-opacity"
                    style={{
                      color: currentTheme.colors.text,
                      backgroundColor: 'transparent'
                    }}
                  >
                    <Bell className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-80 shadow-lg rounded-lg"
                  style={{
                    backgroundColor: currentTheme.colors.background,
                    borderColor: currentTheme.colors.border
                  }}
                >
                  <DropdownMenuLabel style={{ color: currentTheme.colors.text }}>
                    Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator style={{ backgroundColor: currentTheme.colors.border }} />
                  <div className="max-h-80 overflow-y-auto p-2">
                    <div 
                      className="text-center text-sm py-4"
                      style={{ color: currentTheme.colors.accent }}
                    >
                      No notifications yet
                    </div>
                  </div>
                  <DropdownMenuSeparator style={{ backgroundColor: currentTheme.colors.border }} />
                  <DropdownMenuItem 
                    className="justify-center cursor-pointer hover:bg-opacity-50 transition-colors"
                    style={{
                      color: currentTheme.colors.text,
                      backgroundColor: 'transparent'
                    }}
                    onClick={() => navigate("/admin/settings")}
                  >
                    Manage notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar 
                    className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                  >
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="text-white">{userInitial}</AvatarFallback>
                    )}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="shadow-lg rounded-lg"
                  style={{
                    backgroundColor: currentTheme.colors.background,
                    borderColor: currentTheme.colors.border
                  }}
                >
                  <DropdownMenuLabel style={{ color: currentTheme.colors.text }}>
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator style={{ backgroundColor: currentTheme.colors.border }} />
                  <DropdownMenuItem 
                    onClick={() => navigate("/profile")}
                    className="hover:bg-opacity-50 transition-colors"
                    style={{
                      color: currentTheme.colors.text,
                      backgroundColor: 'transparent'
                    }}
                  >
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/admin/settings")}
                    className="hover:bg-opacity-50 transition-colors"
                    style={{
                      color: currentTheme.colors.text,
                      backgroundColor: 'transparent'
                    }}
                  >
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/admin/settings")}
                    className="hover:bg-opacity-50 transition-colors"
                    style={{
                      color: currentTheme.colors.text,
                      backgroundColor: 'transparent'
                    }}
                  >
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator style={{ backgroundColor: currentTheme.colors.border }} />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600 hover:bg-opacity-50 transition-colors"
                    style={{
                      backgroundColor: 'transparent'
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        <main 
          className="flex-1 overflow-y-auto p-6"
          style={{ color: currentTheme.colors.text }}
        >
          {children}
        </main>
      </div>
      
      {sidebarPosition === "right" && (
        <MovableSidebar 
          position={sidebarPosition}
          onPositionChange={handlePositionChange}
        />
      )}
      
      {sidebarPosition === "bottom" && (
        <div className="fixed bottom-0 left-0 right-0">
          <MovableSidebar 
            position={sidebarPosition}
            onPositionChange={handlePositionChange}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
