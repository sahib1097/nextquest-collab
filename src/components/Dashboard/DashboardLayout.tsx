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
import { useTheme } from "@/hooks/use-theme";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>(() => {
    return (localStorage.getItem("fluxSidebarPosition") as SidebarPosition) || "left";
  });
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useTheme();
  
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
    // 1) Tell the server to clear the cookie
    await fetch(`${API}/auth/logout`, {
      method:      'POST',
      credentials: 'include',       // important to send the cookie
    });

    // 2) Then clear your localStorage flags
    logoutUser();                  // your existing helper
  };
  
  return (
    <div className="flex h-screen bg-background">
      {sidebarPosition === "left" && (
        <MovableSidebar 
          position={sidebarPosition}
          onPositionChange={handlePositionChange}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background border-b border-border px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/f44da06d-430c-4883-a4c2-fc7c23f90541.png" 
                alt="Next Quest Logo" 
                className="h-8 w-auto mr-4"
              />
              <div className="max-w-md w-full relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search projects, roadmaps, tasks..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> New
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-accent">
                    <Bell className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto p-2">
                    <div className="text-center text-sm text-muted-foreground py-4">
                      No notifications yet
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="justify-center cursor-pointer" 
                    onClick={() => navigate("/admin/settings")}
                  >
                    Manage notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 bg-primary cursor-pointer">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="text-primary-foreground">{userInitial}</AvatarFallback>
                    )}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6 bg-background text-foreground">
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
