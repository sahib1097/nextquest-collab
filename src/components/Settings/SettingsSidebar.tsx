import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Link, Moon, Shield, Trophy, User, Users } from "lucide-react";

interface SettingsSidebarProps {
  isAdmin: boolean;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const SettingsSidebar = ({ isAdmin, activeTab, setActiveTab }: SettingsSidebarProps) => {
  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="sticky top-20">
        <div className="p-1 space-y-1 bg-muted/70 rounded-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-col h-auto space-y-1 bg-transparent p-0">
              <TabsTrigger 
                value="profile" 
                className="justify-start gap-3 p-2.5 h-10 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-foreground"
              >
                <User size={18} />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="justify-start gap-3 p-2.5 h-10 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-foreground"
              >
                <Bell size={18} />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="justify-start gap-3 p-2.5 h-10 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-foreground"
              >
                <Moon size={18} />
                <span>Appearance</span>
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="justify-start gap-3 p-2.5 h-10 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-foreground"
              >
                <Link size={18} />
                <span>Integrations</span>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger 
                  value="team" 
                  className="justify-start gap-3 p-2.5 h-10 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-foreground"
                >
                  <Users size={18} />
                  <span>Team</span>
                </TabsTrigger>
              )}
              <TabsTrigger 
                value="security" 
                className="justify-start gap-3 p-2.5 h-10 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm text-foreground"
              >
                <Shield size={18} />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
