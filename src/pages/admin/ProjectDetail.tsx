
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import TaskItem, { Task } from "@/components/Projects/TaskItem";
import { addActivity } from "@/utils/activityLogger";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getProjectDetails, addTaskToProject } from "@/utils/projectLogger";
import { get } from "http";

// Get team members
const getTeamMembers = () => {
  const storedMembers = localStorage.getItem("fluxTeamMembers");
  if (storedMembers) {
    return JSON.parse(storedMembers);
  }
  
  // Default team members if none exist
  const defaultMembers = [
    { id: "1", name: "Jane Doe", email: "jane@example.com" },
    { id: "2", name: "John Smith", email: "john@example.com" },
    { id: "3", name: "Alex Johnson", email: "alex@example.com" },
  ];
  localStorage.setItem("fluxTeamMembers", JSON.stringify(defaultMembers));
  return defaultMembers;
};

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState(0);
  const [teamMembers] = useState(getTeamMembers());
  
  useEffect(() => {
    // In a real app, fetch project details from API
    // const storedProjects = JSON.parse(localStorage.getItem("fluxProjects") || "[]");
    // const foundProject = storedProjects.find((p: any) => p.id === projectId);

    const fetchProjectDetails = async () => {
      const ProjectData = await getProjectDetails(projectId)
      const foundProject = ProjectData

      if (foundProject) {
        setProject(foundProject);
        setTasks(foundProject.tasks || []);
        
        // Calculate initial progress
        if (foundProject.tasks && foundProject.tasks.length > 0) {
          const completedTasks = foundProject.tasks.filter((t: Task) => t.completed).length;
          setProgress((completedTasks / foundProject.tasks.length) * 100);
        }
      }
    }
    
    if (projectId) {
      fetchProjectDetails();
    }
    
    setLoading(false);
  }, [projectId]);
  
  useEffect(() => {
    if (project && tasks.length > 0) {
      const completedTasks = tasks.filter(task => task.completed).length;
      const newProgress = (completedTasks / tasks.length) * 100;
      setProgress(newProgress);
      
      // Update project in localStorage
      updateProjectInStorage({
        ...project,
        tasks,
        progress: newProgress
      });
    } else if (tasks.length === 0) {
      setProgress(0);
      
      if (project) {
        updateProjectInStorage({
          ...project,
          tasks: [],
          progress: 0
        });
      }
    }
  }, [tasks, projectId, project]);
  
  const updateProjectInStorage = (updatedProject: any) => {
    const storedProjects = JSON.parse(localStorage.getItem("fluxProjects") || "[]");
    const updatedProjects = storedProjects.map((p: any) => {
      if (p.id === projectId) {
        return updatedProject;
      }
      return p;
    });
    
    localStorage.setItem("fluxProjects", JSON.stringify(updatedProjects));
  };
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "") {
      toast({
        title: "Task cannot be empty",
        description: "Please enter a task name.",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      // You may want to add a unique id here, e.g. id: crypto.randomUUID(),
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.trim(),
      completed: false,
      description: "",
      priority: "None",
      tags: [],
      dueDate: null,
      assignedTo: null,
    };

    const asyncAddTaskToProject = async () => {
      try {
        await addTaskToProject(projectId as string, task);
      } catch (error) {
        console.error("Failed to add task:", error);
        toast({
          title: "Error adding task",
          description: "There was an issue adding your task. Please try again.",
          variant: "destructive"
        });
        return;
      }
    }
    asyncAddTaskToProject();

    setTasks([...tasks, task]);
    setNewTask("");
    
    // Log activity
    // addActivity({
    //   type: "task_created",
    //   details: `Added task "${newTask}" to project "${project?.name}"`,
    //   timestamp: new Date().toISOString(),
    //   projectId: projectId as string
    // });
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => {
      const updatedTasks = prev.map(task => {
        if (task.id === taskId) {
          const newCompleted = !task.completed;
          
          // Show toast on completion
          if (newCompleted) {
            toast({
              title: "Task completed! 🎉",
              description: task.title,
            });
            
            // Log activity
            addActivity({
              type: "task_completed",
              details: `Completed task "${task.title}" in project "${project?.name}"`,
              timestamp: new Date().toISOString(),
              projectId: projectId as string
            });
          }
          
          return { ...task, completed: newCompleted };
        }
        return task;
      });
      
      // Sort tasks - completed tasks at the bottom
      return sortTasks(updatedTasks);
    });
  };
  
  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    
    setTasks(prev => prev.filter(task => task.id !== taskId));
    
    toast({
      title: "Task deleted",
      description: taskToDelete?.title,
    });
    
    // Log activity
    if (taskToDelete) {
      addActivity({
        type: "task_deleted",
        details: `Deleted task "${taskToDelete.title}" from project "${project?.name}"`,
        timestamp: new Date().toISOString(),
        projectId: projectId as string
      });
    }
  };
  
  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const updatedTasks = prev.map(task => {
        if (task.id === taskId) {
          return { ...task, ...updates };
        }
        return task;
      });
      
      // No need to sort here since completion status hasn't changed
      return updatedTasks;
    });
    
    // Log activity for priority or tag changes
    if (updates.priority || updates.tags) {
      const task = tasks.find(t => t.id === taskId);
      addActivity({
        type: "task_updated",
        details: `Updated task "${task?.title}" in project "${project?.name}"`,
        timestamp: new Date().toISOString(),
        projectId: projectId as string
      });
    }
  };
  
  // Sort tasks function - incomplete tasks first, then completed tasks
  const sortTasks = (taskList: Task[]): Task[] => {
    return [
      ...taskList.filter(task => !task.completed),
      ...taskList.filter(task => task.completed)
    ];
  };
  
  // Get assigned team members for this project
  const getAssignedMembers = () => {
    const assignedMemberIds = new Set<string>();
    tasks.forEach(task => {
      if (task.assignedTo) {
        assignedMemberIds.add(task.assignedTo);
      }
    });
    
    return Array.from(assignedMemberIds).map(id => 
      teamMembers.find(member => member.id === id)
    ).filter(Boolean);
  };
  
  const assignedMembers = getAssignedMembers();
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading project details...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center flex-col h-64">
          <p className="text-gray-600 mb-4">Project not found</p>
          <Button onClick={() => navigate("/admin/projects")}>
            Return to Projects
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div>
        <Button 
          variant="ghost" 
          className="mb-6 -ml-2 text-gray-600"
          onClick={() => navigate("/admin/projects")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Projects
        </Button>
        
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{project.name}</h1>
            {project.description && (
              <p className="text-gray-600">{project.description}</p>
            )}
            
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500">Progress</span>
                  <span className="text-sm font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="text-sm text-gray-500">
                Due: {project.dueDate}
              </div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Team {assignedMembers.length > 0 && `(${assignedMembers.length})`}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Project Team</DrawerTitle>
                  <DrawerDescription>
                    Team members assigned to tasks in this project
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  {assignedMembers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {assignedMembers.map((member: any) => (
                        <div key={member.id} className="flex items-center p-3 border rounded-md">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback className="bg-[#9b87f5] text-white">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No team members assigned to this project yet.
                      <p className="mt-2">
                        Assign team members to tasks using the avatar button on each task.
                      </p>
                    </div>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
              <Input
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="bg-[#9b87f5] hover:bg-[#7E69AB]">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </form>
            
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No tasks yet. Add your first task to get started!
                </p>
              ) : (
                tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                    projectId={projectId}
                    projectName={project.name}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;
