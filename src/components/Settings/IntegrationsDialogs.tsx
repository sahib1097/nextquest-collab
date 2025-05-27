
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addActivity } from "@/utils/activityLogger";
import { importFromJira } from "@/utils/projectLogger";
import { API } from '@/config';
import { u } from "node_modules/framer-motion/dist/types.d-B50aGbjN";

const IntegrationsDialogs = () => {
  const [showJiraDialog, setShowJiraDialog] = useState(false);
  const [jiraEmail, setJiraEmail] = useState("");
  const [jiraSiteURL, setJiraEmailURL] = useState("");
  const [jiraApiKey, setJiraApiKey] = useState("");

  const [showGitHubDialog, setShowGitHubDialog] = useState(false);
  const [githubEmail, setGitHubEmail] = useState("");
  const [githubApiKey, setGitHubApiKey] = useState("");
  
  const [showSlackDialog, setShowSlackDialog] = useState(false);
  const [slackEmail, setSlackEmail] = useState("");
  const [slackApiKey, setSlackApiKey] = useState("");

  const [showGoogleDialog, setShowGoogleDialog] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleApiKey, setGoogleApiKey] = useState("");

  const [showMicrosoftDialog, setShowMicrosoftDialog] = useState(false);
  const [microsoftEmail, setMicrosoftEmail] = useState("");
  const [microsoftApiKey, setMicrosoftApiKey] = useState("");

  const [showMondayDialog, setShowMondayDialog] = useState(false);
  const [mondayEmail, setMondayEmail] = useState("");
  const [mondayApiKey, setMondayApiKey] = useState("");

  const [showAsanaDialog, setShowAsanaDialog] = useState(false);
  const [asanaEmail, setAsanaEmail] = useState("");
  const [asanaApiKey, setAsanaApiKey] = useState("");

  const [showTrelloDialog, setShowTrelloDialog] = useState(false);
  const [trelloEmail, setTrelloEmail] = useState("");
  const [trelloApiKey, setTrelloApiKey] = useState("");


  useEffect(() => {
    const handleOpenJiraDialog = () => setShowJiraDialog(true);
    const handleOpenGitHubDialog = () => setShowGitHubDialog(true);
    const handleOpenSlackDialog = () => setShowSlackDialog(true);
    const handleOpenGoogleDialog = () => setShowGoogleDialog(true);
    const handleOpenMicrosoftDialog = () => setShowMicrosoftDialog(true);
    const handleOpenMondayDialog = () => setShowMondayDialog(true);
    const handleOpenAsanaDialog = () => setShowAsanaDialog(true);
    const handleOpenTrelloDialog = () => setShowTrelloDialog(true);

    
    document.addEventListener('settings:open-jira-dialog', handleOpenJiraDialog);
    document.addEventListener('settings:open-github-dialog', handleOpenGitHubDialog);
    document.addEventListener('settings:open-slack-dialog', handleOpenSlackDialog);
    document.addEventListener('settings:open-google-dialog', handleOpenGoogleDialog);
    document.addEventListener('settings:open-microsoft-dialog', handleOpenMicrosoftDialog);
    document.addEventListener('settings:open-monday-dialog', handleOpenMondayDialog);
    document.addEventListener('settings:open-asana-dialog', handleOpenAsanaDialog);
    document.addEventListener('settings:open-trello-dialog', handleOpenTrelloDialog);
    
    return () => {
      document.removeEventListener('settings:open-jira-dialog', handleOpenJiraDialog);
      document.removeEventListener('settings:open-github-dialog', handleOpenGitHubDialog);
      document.removeEventListener('settings:open-slack-dialog', handleOpenSlackDialog);
      document.removeEventListener('settings:open-google-dialog', handleOpenGoogleDialog);
      document.removeEventListener('settings:open-microsoft-dialog', handleOpenMicrosoftDialog);
      document.removeEventListener('settings:open-monday-dialog', handleOpenMondayDialog);
      document.removeEventListener('settings:open-asana-dialog', handleOpenAsanaDialog);
      document.removeEventListener('settings:open-trello-dialog', handleOpenTrelloDialog);


    };
  }, []);
  
  const handleJiraUpdate = () => {
    if (!jiraEmail || !jiraSiteURL || !jiraApiKey) {
      toast.error("Please fill in all fields.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("fluxUser"));

    fetch(`${API}/api/jira/link-jira`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: jiraEmail,
        siteURL: jiraSiteURL,
        apiKey: jiraApiKey,
        userId: user.userId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
        if (data.success) {
            console.log("Jira integration added successfully:", data);
          toast.success("Jira integration added successfully!");
        //   addActivity("Added Jira integration");
          const jiraData = {
            baseUrl: jiraSiteURL,
            email: jiraEmail,
            token: jiraApiKey
          }
          importFromJira(jiraData, user.teamId);
          setShowJiraDialog(false);

        } else {
          toast.error(data.message || "Failed to add Jira integration.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("An error occurred while adding Jira integration.");
      });

  };

  const handleGitHubUpdate = () => {

  };

  const handleSlackUpdate = () => {

  };

  const handleGoogleUpdate = () => {

  };

  const handleMicrosoftUpdate = () => {

  };

  const handleMondayUpdate = () => {

  };

  const handleAsanaUpdate = () => {

  };

  const handleTrelloUpdate = () => {

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
                <Label htmlFor="siteURL">Jira Site URL</Label>
                <Input
                    id="jiraSiteURL"
                    type="siteURL"
                    value={jiraSiteURL}
                    onChange={(e) => setJiraEmailURL(e.target.value)}
                    placeholder="Enter your Jira Site URL"
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

        {/* Add GitHub Dialog */}
        <Dialog open={showGitHubDialog} onOpenChange={setShowGitHubDialog}>
            <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
                <DialogTitle>Add Your GitHub</DialogTitle>
                <DialogDescription>
                Enter your GitHub credentials to integrate with our system.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                <Label htmlFor="githubEmail">GitHub Email Address</Label>
                <Input
                    id="githubEmail"
                    type="email"
                    value={githubEmail}
                    onChange={(e) => setGitHubEmail(e.target.value)}
                    placeholder="yourgithubemail@example.com"
                    className="h-11"
                />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="apiKey">GitHub API Key</Label>
                <Input
                    id="githubApiKey"
                    type="apiKey"
                    value={githubApiKey}
                    onChange={(e) => setGitHubApiKey(e.target.value)}
                    placeholder="Enter your GitHub API Key"
                    className="h-11"
                />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowGitHubDialog(false)}>
                Cancel
                </Button>
                <Button onClick={handleGitHubUpdate}>
                Add GitHub
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Add Slack Dialog */}
        <Dialog open={showSlackDialog} onOpenChange={setShowSlackDialog}>
            <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
                <DialogTitle>Add Your Slack</DialogTitle>
                <DialogDescription>
                Enter your Slack credentials to integrate with our system.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                <Label htmlFor="slackEmail">Slack Email Address</Label>
                <Input
                    id="slackEmail"
                    type="email"
                    value={slackEmail}
                    onChange={(e) => setSlackEmail(e.target.value)}
                    placeholder="yourslackemail@example.com"
                    className="h-11"
                />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="apiKey">Slack API Key</Label>
                <Input
                    id="slackApiKey"
                    type="apiKey"
                    value={slackApiKey}
                    onChange={(e) => setSlackApiKey(e.target.value)}
                    placeholder="Enter your Slack API Key"
                    className="h-11"
                />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowSlackDialog(false)}>
                Cancel
                </Button>
                <Button onClick={handleSlackUpdate}>
                Add Slack
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Add Google Dialog */}
        <Dialog open={showGoogleDialog} onOpenChange={setShowGoogleDialog}>
            <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
                <DialogTitle>Add Your Google</DialogTitle>
                <DialogDescription>
                Enter your Google credentials to integrate with our system.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                <Label htmlFor="googleEmail">Google Email Address</Label>
                <Input
                    id="googleEmail"
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="yourgoogleemail@example.com"
                    className="h-11"
                />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="apiKey">Google API Key</Label>
                <Input
                    id="googleApiKey"
                    type="apiKey"
                    value={googleApiKey}
                    onChange={(e) => setGoogleApiKey(e.target.value)}
                    placeholder="Enter your Google API Key"
                    className="h-11"
                />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowGoogleDialog(false)}>
                Cancel
                </Button>
                <Button onClick={handleGoogleUpdate}>
                Add Google
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Add Microsoft Dialog */}
        <Dialog open={showMicrosoftDialog} onOpenChange={setShowMicrosoftDialog}>
            <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
                <DialogTitle>Add Your Microsoft</DialogTitle>
                <DialogDescription>
                Enter your Microsoft credentials to integrate with our system.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                <Label htmlFor="microsoftEmail">Microsoft Email Address</Label>
                <Input
                    id="microsoftEmail"
                    type="email"
                    value={microsoftEmail}
                    onChange={(e) => setMicrosoftEmail(e.target.value)}
                    placeholder="yourmicrosoftemail@example.com"
                    className="h-11"
                />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="apiKey">Microsoft API Key</Label>
                <Input
                    id="microsoftApiKey"
                    type="apiKey"
                    value={microsoftApiKey}
                    onChange={(e) => setMicrosoftApiKey(e.target.value)}
                    placeholder="Enter your Microsoft API Key"
                    className="h-11"
                />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowMicrosoftDialog(false)}>
                Cancel
                </Button>
                <Button onClick={handleMicrosoftUpdate}>
                Add Microsoft
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>


        {/* Add Monday Dialog */}
        <Dialog open={showMondayDialog} onOpenChange={setShowMondayDialog}>
            <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
                <DialogTitle>Add Your Monday</DialogTitle>
                <DialogDescription>
                Enter your Monday credentials to integrate with our system.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                <Label htmlFor="mondayEmail">Monday Email Address</Label>
                <Input
                    id="mondayEmail"
                    type="email"
                    value={mondayEmail}
                    onChange={(e) => setMondayEmail(e.target.value)}
                    placeholder="yourmondayemail@example.com"
                    className="h-11"
                />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="apiKey">Monday API Key</Label>
                <Input
                    id="mondayApiKey"
                    type="apiKey"
                    value={mondayApiKey}
                    onChange={(e) => setMondayApiKey(e.target.value)}
                    placeholder="Enter your Monday API Key"
                    className="h-11"
                />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowMondayDialog(false)}>
                Cancel
                </Button>
                <Button onClick={handleMondayUpdate}>
                Add Monday
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Add Asana Dialog */}
        <Dialog open={showAsanaDialog} onOpenChange={setShowAsanaDialog}>
            <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
                <DialogTitle>Add Your Asana</DialogTitle>
                <DialogDescription>
                Enter your Asana credentials to integrate with our system.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                <Label htmlFor="asanaEmail">Asana Email Address</Label>
                <Input
                    id="asanaEmail"
                    type="email"
                    value={asanaEmail}
                    onChange={(e) => setAsanaEmail(e.target.value)}
                    placeholder="yourasanaemail@example.com"
                    className="h-11"
                />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="apiKey">Asana API Key</Label>
                <Input
                    id="asanaApiKey"
                    type="apiKey"
                    value={asanaApiKey}
                    onChange={(e) => setAsanaApiKey(e.target.value)}
                    placeholder="Enter your Asana API Key"
                    className="h-11"
                />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowAsanaDialog(false)}>
                Cancel
                </Button>
                <Button onClick={handleAsanaUpdate}>
                Add Asana
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Add Trello Dialog */}
        <Dialog open={showTrelloDialog} onOpenChange={setShowTrelloDialog}>
            <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
                <DialogTitle>Add Your Trello</DialogTitle>
                <DialogDescription>
                Enter your Trello credentials to integrate with our system.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                <Label htmlFor="trelloEmail">Trello Email Address</Label>
                <Input
                    id="trelloEmail"
                    type="email"
                    value={trelloEmail}
                    onChange={(e) => setTrelloEmail(e.target.value)}
                    placeholder="yourtrelloemail@example.com"
                    className="h-11"
                />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="apiKey">Trello API Key</Label>
                <Input
                    id="trelloApiKey"
                    type="apiKey"
                    value={trelloApiKey}
                    onChange={(e) => setTrelloApiKey(e.target.value)}
                    placeholder="Enter your Trello API Key"
                    className="h-11"
                />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowTrelloDialog(false)}>
                Cancel
                </Button>
                <Button onClick={handleTrelloUpdate}>
                Add Trello
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        
    </>
  );
};

export default IntegrationsDialogs;
