import { useState } from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import SettingsSidebar from "@/components/Settings/SettingsSidebar";
import ProfileSettings from "@/components/Settings/ProfileSettings";
import NotificationSettings from "@/components/Settings/NotificationSettings";
import AppearanceSettings from "@/components/Settings/AppearanceSettings";
import IntegrationSettings from "@/components/Settings/IntegrationSettings";
import TeamSettings from "@/components/Settings/TeamSettings";
import SecuritySettings from "@/components/Settings/SecuritySettings";
import SettingsDialogs from "@/components/Settings/SettingsDialogs";
import IntegrationsDialogs from "@/components/Settings/IntegrationsDialogs";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user] = useState(() => {
    return JSON.parse(localStorage.getItem("fluxUser") || '{"name":"User", "email":"user@example.com", "role":"Admin", "position":"Product Manager", "avatar":""}');
  });
  
  // Check if user has admin rights
  const isAdmin = user.role === "Admin";
  
  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-6xl px-4">
        <div className="py-6">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground mb-6">Manage your account preferences and settings</p>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <SettingsSidebar isAdmin={isAdmin} activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content Area */}
            <div className="flex-1">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="profile" className="mt-0 space-y-6">
                  <ProfileSettings />
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-0 space-y-6">
                  <NotificationSettings />
                </TabsContent>
                
                <TabsContent value="appearance" className="mt-0 space-y-6">
                  <AppearanceSettings />
                </TabsContent>
                
                <TabsContent value="integrations" className="mt-0 space-y-6">
                  <IntegrationSettings />
                </TabsContent>
                
                <TabsContent value="team" className="mt-0 space-y-6">
                  <TeamSettings />
                </TabsContent>
                
                <TabsContent value="security" className="mt-0 space-y-6">
                  <SecuritySettings />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dialogs for email and password changes */}
      <SettingsDialogs />
      <IntegrationsDialogs />
    </DashboardLayout>
  );
};

export default Settings;
