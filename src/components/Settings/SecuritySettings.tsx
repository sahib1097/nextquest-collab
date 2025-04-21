
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SecuritySettings = () => {
  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle>Security</CardTitle>
        <CardDescription>
          Manage your account security and authentication options
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Account Access</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <div 
                  className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-muted/50"
                  onClick={() => document.dispatchEvent(new CustomEvent('settings:open-password-dialog'))}
                >
                  <div>
                    <h4 className="font-medium">Update Password</h4>
                    <p className="text-sm text-muted-foreground">Change your account password</p>
                  </div>
                  <div className="text-primary">Change</div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">Set up</Button>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <div>
                    <h4 className="font-medium">Active Sessions</h4>
                    <p className="text-sm text-muted-foreground">Manage devices where you're logged in</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
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
