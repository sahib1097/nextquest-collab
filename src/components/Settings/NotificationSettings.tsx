
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { addActivity } from "@/utils/activityLogger";

const NotificationSettings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskAssigned: true,
    taskCompleted: true,
    taskDue: true,
    dailySummary: false,
    weeklySummary: true,
    browserNotifications: false,
    soundAlerts: false,
    desktopAlerts: false
  });
  
  const saveNotifications = () => {
    localStorage.setItem("fluxNotifications", JSON.stringify(notificationSettings));
    
    addActivity({
      type: "notification_settings_updated",
      details: "Updated notification preferences",
      timestamp: new Date().toISOString(),
    });
    
    toast.success("Notification preferences saved");
  };

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Manage how and when you want to be notified
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications" className="text-base font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive email notifications about activity relevant to you
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications" className="text-base font-medium">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive push notifications on your mobile devices
                  </p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, pushNotifications: checked })}
                />
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Browser Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="browserNotifications" className="text-base font-medium">
                    In-Browser Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Show notifications in your browser while the app is open
                  </p>
                </div>
                <Switch
                  id="browserNotifications"
                  checked={notificationSettings.browserNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, browserNotifications: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="soundAlerts" className="text-base font-medium">
                    Sound Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Play sound when notifications arrive
                  </p>
                </div>
                <Switch
                  id="soundAlerts"
                  checked={notificationSettings.soundAlerts}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, soundAlerts: checked })}
                />
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Summary Reports</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dailySummary" className="text-base font-medium">Daily Summary</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive a daily digest of all activity
                  </p>
                </div>
                <Switch
                  id="dailySummary"
                  checked={notificationSettings.dailySummary}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, dailySummary: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklySummary" className="text-base font-medium">Weekly Summary</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive a weekly digest with key metrics and activity
                  </p>
                </div>
                <Switch
                  id="weeklySummary"
                  checked={notificationSettings.weeklySummary}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, weeklySummary: checked })}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button onClick={saveNotifications} size="lg" className="px-8">Save preferences</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
