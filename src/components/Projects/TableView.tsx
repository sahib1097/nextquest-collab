import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MoreHorizontal, Trash2, Edit, Users } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { addActivity } from "@/utils/activityLogger";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import GroupQuestAssignDialog from "./GroupQuestAssignDialog";

interface TableViewProps {
  projects: any[];
  navigate: (path: string) => void;
  emptyMessage: string;
  onClearFilters: () => void;
  updateProject: (id: string, updates: any) => void;
  deleteProject: (id: string) => void;
  convertToGroupQuest: (project: any) => void;
}

const TableView = ({ 
  projects, 
  navigate, 
  emptyMessage, 
  onClearFilters,
  updateProject,
  deleteProject,
  convertToGroupQuest
}: TableViewProps) => {
  const { toast } = useToast();
  const [managingTeamForProject, setManagingTeamForProject] = useState<string | null>(null);
  const [groupQuestProject, setGroupQuestProject] = useState<any | null>(null);
  const [teamMembers] = useState(() => {
    const storedMembers = localStorage.getItem("fluxTeamMembers");
    if (storedMembers) {
      return JSON.parse(storedMembers);
    }
    
    const defaultMembers = [
      { id: "1", name: "Jane Doe", email: "jane@example.com" },
      { id: "2", name: "John Smith", email: "john@example.com" },
      { id: "3", name: "Alex Johnson", email: "alex@example.com" },
    ];
    localStorage.setItem("fluxTeamMembers", JSON.stringify(defaultMembers));
    return defaultMembers;
  });
  
  const handleStatusChange = (projectId: string, newStatus: string) => {
    if (updateProject) {
      updateProject(projectId, { status: newStatus });
      
      toast({
        title: "Status Updated",
        description: `Project status changed to ${newStatus}`,
      });
      
      addActivity({
        type: "project_status_changed",
        details: `Project status changed to ${newStatus}`,
        timestamp: new Date().toISOString(),
        projectId
      });
    }
  };
  
  const toggleTeamMember = (projectId: string, memberId: string, memberName: string, project: any) => {
    if (updateProject) {
      const currentTeam = project.team || [];
      const isAlreadyInTeam = currentTeam.includes(memberName);
      
      let newTeam;
      if (isAlreadyInTeam) {
        newTeam = currentTeam.filter((name: string) => name !== memberName);
        toast({
          title: "Team Member Removed",
          description: `${memberName} removed from project team`,
        });
        
        addActivity({
          type: "team_member_removed",
          details: `${memberName} removed from project team`,
          timestamp: new Date().toISOString(),
          projectId
        });
      } else {
        newTeam = [...currentTeam, memberName];
        toast({
          title: "Team Member Added",
          description: `${memberName} added to project team`,
        });
        
        addActivity({
          type: "team_member_added",
          details: `${memberName} added to project team`,
          timestamp: new Date().toISOString(),
          projectId
        });
      }
      
      updateProject(projectId, { team: newTeam });
    }
  };
  
  const confirmDeleteProject = (projectId: string, projectName: string) => {
    if (deleteProject) {
      deleteProject(projectId);
      
      toast({
        title: "Project Deleted",
        description: `"${projectName}" has been deleted`,
        variant: "destructive"
      });
      
      addActivity({
        type: "project_deleted",
        details: `Project "${projectName}" was deleted`,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleOpenGroupQuestDialog = (project: any) => {
    setGroupQuestProject(project);
  };

  const handleCloseGroupQuestDialog = () => {
    setGroupQuestProject(null);
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500 mb-4">{emptyMessage}</p>
        {emptyMessage.includes("criteria") && (
          <Button onClick={onClearFilters}>Clear Filters</Button>
        )}
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium" onClick={() => navigate(`/admin/projects/${project.id}`)}>
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-gray-500">{project.description}</p>
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={project.status || "Planning"}
                      onValueChange={(value) => handleStatusChange(project.id, value)}
                    >
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Planning
                          </span>
                        </SelectItem>
                        <SelectItem value="In Progress">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            In Progress
                          </span>
                        </SelectItem>
                        <SelectItem value="Review">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Review
                          </span>
                        </SelectItem>
                        <SelectItem value="Completed">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Completed
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell onClick={() => navigate(`/admin/projects/${project.id}`)}>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{Math.round(project.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            project.status === "Completed" 
                              ? "bg-green-500" 
                              : project.status === "In Progress" 
                              ? "bg-amber-500" 
                              : project.status === "Review"
                              ? "bg-purple-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell onClick={() => navigate(`/admin/projects/${project.id}`)}>{project.dueDate}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Dialog open={managingTeamForProject === project.id} onOpenChange={(open) => {
                      if (open) {
                        setManagingTeamForProject(project.id);
                      } else {
                        setManagingTeamForProject(null);
                      }
                    }}>
                      <DialogTrigger asChild>
                        <div className="flex -space-x-2 cursor-pointer">
                          {(project.team || []).slice(0, 3).map((member: string, i: number) => (
                            <div 
                              key={i}
                              className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs border-2 border-white"
                              title={member}
                            >
                              {member.charAt(0)}
                            </div>
                          ))}
                          {(project.team || []).length > 3 && (
                            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs border-2 border-white">
                              +{project.team.length - 3}
                            </div>
                          )}
                          {(project.team || []).length === 0 && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              Add Team
                            </Button>
                          )}
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Manage Team Members</DialogTitle>
                          <DialogDescription>
                            Add or remove team members from this project
                          </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-[300px] overflow-y-auto">
                          {teamMembers.map((member: any) => {
                            const isSelected = project.team && project.team.includes(member.name);
                            return (
                              <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">{member.name}</p>
                                    <p className="text-xs text-gray-500">{member.email}</p>
                                  </div>
                                </div>
                                <Button 
                                  size="sm"
                                  variant={isSelected ? "destructive" : "outline"}
                                  onClick={() => toggleTeamMember(project.id, member.id, member.name, project)}
                                >
                                  {isSelected ? "Remove" : "Add"}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                        <DialogFooter>
                          <Button variant="secondary" onClick={() => setManagingTeamForProject(null)}>
                            Done
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-2">
                      {!project.isGroupQuest && (
                        <Button
                          variant="outline" 
                          size="sm"
                          className="flex items-center text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenGroupQuestDialog(project);
                          }}
                        >
                          <Users className="h-4 w-4 mr-1" /> Group Quest
                        </Button>
                      )}
                      
                      <Button variant="ghost" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/projects/${project.id}`);
                      }} className="text-sm text-primary hover:text-primary/80">View</Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/projects/${project.id}`);
                            }}
                          >
                            View details
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                onSelect={(e) => e.preventDefault()}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Project
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the
                                  project "{project.name}" and all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => confirmDeleteProject(project.id, project.name)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {groupQuestProject && (
        <GroupQuestAssignDialog 
          open={!!groupQuestProject}
          onClose={handleCloseGroupQuestDialog}
          project={groupQuestProject}
        />
      )}
    </>
  );
};

export default TableView;
