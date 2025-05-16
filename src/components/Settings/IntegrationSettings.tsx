import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addActivity } from "@/utils/activityLogger";

const IntegrationSettings = () => {
  const [integrations, setIntegrations] = useState([
    { id: "jira", name: "Jira", connected: false, icon: "🧩" },
    { id: "github", name: "GitHub", connected: false, icon: "🐙" },
    { id: "slack", name: "Slack", connected: false, icon: "💬" },
    { id: "google", name: "Google Workspace", connected: false, icon: "📝" },
    { id: "microsoft", name: "Microsoft 365", connected: false, icon: "📊" },
    { id: "monday", name: "Monday.com", connected: false, icon: "📅" },
    { id: "asana", name: "Asana", connected: false, icon: "✅" },
    { id: "trello", name: "Trello", connected: false, icon: "📋" }
  ]);
  
  const toggleIntegration = (id: string) => {
    const updatedIntegrations = integrations.map(integration => {
      if (integration.id === id) {
        const newStatus = !integration.connected;
        
        addActivity({
          type: "integration_updated",
          details: `${newStatus ? "Connected to" : "Disconnected from"} ${integration.name}`,
          timestamp: new Date().toISOString(),
        });
        
        toast.success(`${newStatus ? "Connected to" : "Disconnected from"} ${integration.name}`);
        
        return { ...integration, connected: newStatus };
      }
      return integration;
    });
    
    setIntegrations(updatedIntegrations);
    localStorage.setItem("fluxIntegrations", JSON.stringify(updatedIntegrations));
  };

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader className="border-b pb-3">
        <CardTitle>Connected Services</CardTitle>
        <CardDescription>
          Manage third-party services and integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-4">
          {integrations.map((integration) => (
            <div 
              key={integration.id} 
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                integration.connected 
                  ? 'bg-primary/5 border-primary/20 text-foreground' 
                  : 'bg-background border-border text-foreground hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl p-2 bg-muted rounded-md w-10 h-10 flex items-center justify-center">
                  {integration.icon}
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{integration.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {integration.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <Button 
                variant={integration.connected ? "secondary" : "default"}
                onClick={() => {
                  toggleIntegration(integration.id)
                  document.dispatchEvent(new CustomEvent('settings:open-jira-dialog'))
                }}
                className={`min-w-24 transition-colors ${
                  integration.connected 
                    ? 'hover:bg-destructive hover:text-destructive-foreground' 
                    : 'hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                {integration.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationSettings;
