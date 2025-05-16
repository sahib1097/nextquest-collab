
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addActivity } from "@/utils/activityLogger";
import { API } from '@/config';
import { u } from "node_modules/framer-motion/dist/types.d-B50aGbjN";

const IntegrationsDialogs = () => {
  const [showJiraDialog, setShowJiraDialog] = useState(false);
  const [jiraEmail, setJiraEmail] = useState("");
  const [jiraApiKey, setJiraApiKey] = useState("");
  
  useEffect(() => {
    const handleOpenJiraDialog = () => setShowJiraDialog(true);

    
    document.addEventListener('settings:open-jira-dialog', handleOpenJiraDialog);
    
    return () => {
      document.removeEventListener('settings:open-jira-dialog', handleOpenJiraDialog);

    };
  }, []);
  
  const handleJiraUpdate = () => {

  };

  return (
    <>
      {/* Add Jira Dialog */}
      <Dialog open={showJiraDialog} onOpenChange={setShowJiraDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Your Jira</DialogTitle>
            <DialogDescription>
              Enter your Jira credentials to integrate with our system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="jiraEmail">Jira Email Address</Label>
              <Input
                id="jiraEmail"
                type="email"
                value={jiraEmail}
                onChange={(e) => setJiraEmail(e.target.value)}
                placeholder="yourjiraemail@example.com"
                className="h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apiKey">Jira API Key</Label>
              <Input
                id="jiraApiKey"
                type="apiKey"
                value={jiraApiKey}
                onChange={(e) => setJiraApiKey(e.target.value)}
                placeholder="Enter your Jira API Key"
                className="h-11"
              />
            </div>
        </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJiraDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleJiraUpdate}>
              Add Jira
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IntegrationsDialogs;
