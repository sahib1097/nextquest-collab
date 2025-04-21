
import React, { useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description: string;
    status: {
      name: string;
    };
    assignee: {
      displayName: string;
    };
    priority: {
      name: string;
    };
    created: string;
    duedate: string;
  };
}

export const JiraSync = () => {
  const [jiraUrl, setJiraUrl] = useState(localStorage.getItem("jiraUrl") || "");
  const [jiraToken, setJiraToken] = useState(localStorage.getItem("jiraToken") || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchJiraData = async () => {
    try {
      // This would be the actual Jira API endpoint
      const response = await fetch(`${jiraUrl}/rest/api/3/search`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${btoa(`${jiraToken}`)}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Jira data");
      }

      const data = await response.json();
      return data.issues;
    } catch (error) {
      console.error("Error fetching Jira data:", error);
      throw error;
    }
  };

  const convertJiraToProjectFormat = (jiraIssues: JiraIssue[]) => {
    return jiraIssues.map((issue) => ({
      id: issue.id,
      name: issue.fields.summary,
      description: issue.fields.description || "",
      status: issue.fields.status.name.toLowerCase(),
      category: "development",
      team: issue.fields.assignee ? [issue.fields.assignee.displayName] : [],
      priority: issue.fields.priority.name,
      startDate: new Date(issue.fields.created).toISOString(),
      dueDate: issue.fields.duedate ? new Date(issue.fields.duedate).toISOString() : null,
      jiraKey: issue.key,
    }));
  };

  const updateLocalProjects = (projects: any[]) => {
    const existingProjects = JSON.parse(localStorage.getItem("fluxProjects") || "[]");
    const nonJiraProjects = existingProjects.filter((p: any) => !p.jiraKey);
    const updatedProjects = [...nonJiraProjects, ...projects];
    localStorage.setItem("fluxProjects", JSON.stringify(updatedProjects));

    // Force a page refresh to show the new data
    window.location.reload();
  };

  const handleSync = async () => {
    if (!jiraUrl || !jiraToken) {
      toast({
        title: "Missing Configuration",
        description: "Please provide both Jira URL and API token",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    localStorage.setItem("jiraUrl", jiraUrl);
    localStorage.setItem("jiraToken", jiraToken);

    toast({
      title: "Sync Started",
      description: "Synchronizing with Jira...",
    });

    try {
      const jiraIssues = await fetchJiraData();
      const convertedProjects = convertJiraToProjectFormat(jiraIssues);
      updateLocalProjects(convertedProjects);

      toast({
        title: "Sync Complete",
        description: "Successfully synchronized with Jira",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to synchronize with Jira. Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="bg-[#0052CC] text-white hover:bg-[#0047B3]"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Sync with Jira
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Jira Integration</DialogTitle>
          <DialogDescription>
            Configure your Jira connection to enable two-way synchronization.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="jiraUrl">Jira URL</Label>
            <Input
              id="jiraUrl"
              placeholder="https://your-domain.atlassian.net"
              value={jiraUrl}
              onChange={(e) => setJiraUrl(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="jiraToken">API Token</Label>
            <Input
              id="jiraToken"
              type="password"
              placeholder="Your Jira API token"
              value={jiraToken}
              onChange={(e) => setJiraToken(e.target.value)}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Latest sync status: {isLoading ? 'Syncing...' : 'Not synced yet'}</p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            className="bg-[#0052CC] text-white hover:bg-[#0047B3]"
            onClick={handleSync}
            disabled={isLoading}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {isLoading ? 'Syncing...' : 'Connect & Sync'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
