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
import { useNavigate, useLocation } from "react-router-dom";
import { updateLastActivity, logoutUser } from "@/utils/authUtils";
import { API } from "@/config";
import { useTheme } from "@/contexts/ThemeContext";
import { themes } from "@/config/themes";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>(() => {
    return (localStorage.getItem("fluxSidebarPosition") as SidebarPosition) || "left";
  });
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme } = useTheme();
  const defaultTheme = themes.default;
  
  // Check if we're on the Quests page
  const isQuestsPage = location.pathname === "/admin/quests";
  
  // Use the appropriate theme based on the page
  const themeToUse = isQuestsPage ? currentTheme : defaultTheme;
  
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
    await fetch(`${API}/api/auth/logout`, {
      method:      'POST',
      credentials: 'include',       // important to send the cookie
    });
    logoutUser();
  };
  
  return (
    <div 
      className="flex h-screen relative"
      style={{ 
        backgroundColor: themeToUse.colors.background,
      }}
    >
      {sidebarPosition === "left" && (
        <MovableSidebar 
          position={sidebarPosition}
          onPositionChange={handlePositionChange}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header 
          className="px-6 py-3 shadow-sm border-b relative z-10"
          style={{ 
            backgroundColor: themeToUse.colors.background,
            borderColor: themeToUse.colors.border,
            ...(themeToUse.name === "Cyberpunk" && {
              boxShadow: '0 4px 20px rgba(45, 226, 230, 0.15)',
              borderImage: 'linear-gradient(90deg, #FF2E97, #2DE2E6) 1'
            })
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/f44da06d-430c-4883-a4c2-fc7c23f90541.png" 
                alt="Next Quest Logo" 
                className="h-8 w-auto mr-4"
                style={{
                  ...(themeToUse.name === "Cyberpunk" && {
                    filter: 'drop-shadow(0 0 8px rgba(45, 226, 230, 0.5))'
                  })
                }}
              />
              <div className="max-w-md w-full relative">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ 
                    color: themeToUse.colors.accent,
                    ...(themeToUse.name === "Cyberpunk" && {
                      filter: 'drop-shadow(0 0 4px rgba(247, 6, 207, 0.5))'
                    })
                  }}
                />
                <Input 
                  type="search" 
                  placeholder="Search projects, roadmaps, tasks..."
                  className={`pl-10 ${themeToUse.name === "Cyberpunk" ? 'bg-[#141622] border-[#2DE2E6] focus:ring-[#FF2E97] focus:border-[#FF2E97] transition-all duration-300' : ''}`}
                  style={{
                    backgroundColor: themeToUse.colors.secondary,
                    borderColor: themeToUse.colors.border,
                    color: themeToUse.colors.text,
                    ...(themeToUse.name === "Cyberpunk" && {
                      boxShadow: '0 0 10px rgba(45, 226, 230, 0.1)',
                    })
                  }}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                className={`flex items-center gap-1 hover:opacity-80 transition-all duration-300 ${
                  themeToUse.name === "Cyberpunk" 
                    ? 'bg-gradient-to-r from-[#FF2E97] to-[#2DE2E6] text-white border-0 hover:shadow-[0_0_20px_rgba(45,226,230,0.5)]' 
                    : ''
                }`}
                style={{
                  borderColor: themeToUse.colors.border,
                  color: themeToUse.colors.text,
                  ...(themeToUse.name === "Cyberpunk" && {
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                  })
                }}
              >
                <Plus className={`h-4 w-4 ${themeToUse.name === "Cyberpunk" ? 'animate-pulse' : ''}`} /> New
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`relative hover:opacity-80 transition-all duration-300 ${
                      themeToUse.name === "Cyberpunk" 
                        ? 'hover:bg-[#261D54] hover:shadow-[0_0_15px_rgba(45,226,230,0.3)]' 
                        : ''
                    }`}
                    style={{
                      color: themeToUse.colors.text,
                      backgroundColor: 'transparent',
                      ...(themeToUse.name === "Cyberpunk" && {
                        border: '1px solid #2DE2E6',
                        boxShadow: '0 0 10px rgba(45, 226, 230, 0.2)'
                      })
                    }}
                  >
                    <Bell className={`h-5 w-5 ${
                      themeToUse.name === "Cyberpunk" 
                        ? 'text-[#2DE2E6] filter drop-shadow-[0_0_5px_rgba(45,226,230,0.5)]' 
                        : ''
                    }`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className={`w-80 shadow-lg rounded-lg ${
                    themeToUse.name === "Cyberpunk" 
                      ? 'border border-[#2DE2E6] shadow-[0_0_20px_rgba(45,226,230,0.2)] backdrop-blur-sm' 
                      : ''
                  }`}
                  style={{
                    backgroundColor: themeToUse.colors.background,
                    borderColor: themeToUse.colors.border
                  }}
                >
                  <DropdownMenuLabel style={{ color: themeToUse.colors.text }}>
                    Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator style={{ backgroundColor: themeToUse.colors.border }} />
                  <div className="max-h-80 overflow-y-auto p-2">
                    <div 
                      className="text-center text-sm py-4"
                      style={{ color: themeToUse.colors.accent }}
                    >
                      No notifications yet
                    </div>
                  </div>
                  <DropdownMenuSeparator style={{ backgroundColor: themeToUse.colors.border }} />
                  <DropdownMenuItem 
                    className="justify-center cursor-pointer hover:bg-opacity-50 transition-colors"
                    style={{
                      color: themeToUse.colors.text,
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
                    className={`h-8 w-8 cursor-pointer hover:opacity-80 transition-all duration-300 ${
                      themeToUse.name === "Cyberpunk" 
                        ? 'border-2 border-[#2DE2E6] shadow-[0_0_15px_rgba(45,226,230,0.3)]' 
                        : ''
                    }`}
                    style={{ backgroundColor: themeToUse.colors.primary }}
                  >
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className={`${
                        themeToUse.name === "Cyberpunk" 
                          ? 'text-white bg-gradient-to-br from-[#FF2E97] to-[#2DE2E6]' 
                          : 'text-white'
                      }`}>{userInitial}</AvatarFallback>
                    )}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="shadow-lg rounded-lg"
                  style={{
                    backgroundColor: themeToUse.colors.background,
                    borderColor: themeToUse.colors.border
                  }}
                >
                  <DropdownMenuLabel style={{ color: themeToUse.colors.text }}>
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator style={{ backgroundColor: themeToUse.colors.border }} />
                  <DropdownMenuItem 
                    onClick={() => navigate("/profile")}
                    className="hover:bg-opacity-50 transition-colors"
                    style={{
                      color: themeToUse.colors.text,
                      backgroundColor: 'transparent'
                    }}
                  >
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/admin/settings")}
                    className="hover:bg-opacity-50 transition-colors"
                    style={{
                      color: themeToUse.colors.text,
                      backgroundColor: 'transparent'
                    }}
                  >
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/admin/settings")}
                    className="hover:bg-opacity-50 transition-colors"
                    style={{
                      color: themeToUse.colors.text,
                      backgroundColor: 'transparent'
                    }}
                  >
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator style={{ backgroundColor: themeToUse.colors.border }} />
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
          className="flex-1 overflow-y-auto p-6 relative"
          style={{ color: themeToUse.colors.text }}
        >
          {isQuestsPage && currentTheme.backgroundImage && (
            <div 
              className="fixed"
              style={{
                backgroundImage: `url(${currentTheme.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.9,
                top: '64px',
                left: sidebarPosition === 'left' ? (collapsed ? '80px' : '250px') : '0',
                right: sidebarPosition === 'right' ? (collapsed ? '80px' : '250px') : '0',
                bottom: 0,
                zIndex: 0
              }}
            />
          )}
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
      
      {sidebarPosition === "right" && (
        <MovableSidebar 
          position={sidebarPosition}
          onPositionChange={handlePositionChange}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      )}
      
      {sidebarPosition === "bottom" && (
        <div className="fixed bottom-0 left-0 right-0">
          <MovableSidebar 
            position={sidebarPosition}
            onPositionChange={handlePositionChange}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
