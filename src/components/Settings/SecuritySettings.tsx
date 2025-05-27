import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SecuritySettings = () => {
  return (
    <Card className="bg-card">
      <CardHeader className="border-b border-border pb-3">
        <CardTitle className="text-foreground">Security</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage your account security and authentication options
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4 text-foreground">Account Access</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <div 
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => document.dispatchEvent(new CustomEvent('settings:open-password-dialog'))}
                >
                  <div>
                    <h4 className="font-medium text-foreground">Update Password</h4>
                    <p className="text-sm text-muted-foreground">Change your account password</p>
                  </div>
                  <div className="text-primary">Change</div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button 
                    variant={false ? "secondary" : "default"}
                    className={`min-w-24 transition-colors ${
                      false 
                        ? 'hover:bg-destructive hover:text-destructive-foreground' 
                        : 'hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    Set up
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-medium text-foreground">Active Sessions</h4>
                    <p className="text-sm text-muted-foreground">Manage devices where you're logged in</p>
                  </div>
                  <Button 
                    variant={false ? "secondary" : "default"}
                    className={`min-w-24 transition-colors ${
                      false 
                        ? 'hover:bg-destructive hover:text-destructive-foreground' 
                        : 'hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    Manage
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
