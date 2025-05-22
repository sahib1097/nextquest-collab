import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Table as TableIcon, SquareKanban, ChartGantt, Plus, FolderPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import NewProjectDialog from "@/components/Projects/NewProjectDialog";
import NewBoardDialog from "@/components/Projects/NewBoardDialog";
import BoardSwitcher from "@/components/Projects/BoardSwitcher";
import TableView from "@/components/Projects/TableView";
import KanbanView from "@/components/Projects/KanbanView";
import GanttView from "@/components/Projects/GanttView";
import { JiraSync } from "@/components/Projects/JiraSync";
import { useToast } from "@/hooks/use-toast";
import { ProjectBoard } from "@/types/quest";
import { createProject, retrieveProjects, updateProjectStatus } from "@/utils/projectLogger";

const Projects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [boards, setBoards] = useState<ProjectBoard[]>([]);
  const [currentBoard, setCurrentBoard] = useState<ProjectBoard | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeView, setActiveView] = useState("table");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');

  useEffect(() => {
    const initializeData = async () => {
      try {
        const storedBoards = localStorage.getItem("fluxBoards");
        const initialBoards = storedBoards ? JSON.parse(storedBoards) : [];
        
        if (initialBoards.length === 0) {
          const defaultBoard: ProjectBoard = {
            id: "default",
            name: "Main Board",
            projects: [],
            categories: [
              { id: "all", name: "All Projects" },
              { id: "development", name: "Development" },
              { id: "sales", name: "Sales" },
              { id: "marketing", name: "Marketing" },
            ],
            createdAt: new Date().toISOString(),
          };
          initialBoards.push(defaultBoard);
          localStorage.setItem("fluxBoards", JSON.stringify(initialBoards));
        }
        
        setBoards(initialBoards);
        setCurrentBoard(initialBoards[0]);

        // Load projects from backend
        const user = JSON.parse(localStorage.getItem("fluxUser") || "{}");
        const fetchedProjects = await retrieveProjects(user.userId);
        if (Array.isArray(fetchedProjects)) {
          setProjects(fetchedProjects);
        }

        if (templateId) {
          const templateConfig = localStorage.getItem("fluxProjectTemplate");
          if (templateConfig) {
            const template = JSON.parse(templateConfig);
            setActiveView(template.config.defaultView);
            localStorage.removeItem("fluxProjectTemplate");
          }
        }
      } catch (error) {
        console.error("Error initializing data:", error);
        toast({
          title: "Error",
          description: "Failed to load projects. Please try again.",
          variant: "destructive",
        });
      }
    };

    void initializeData();
  }, [templateId]);

  const handleBoardChange = (boardId: string) => {
    const newBoard = boards.find(board => board.id === boardId);
    if (newBoard) {
      setCurrentBoard(newBoard);
      setActiveCategory("all");
    }
  };

  const handleNewBoard = (newBoard: ProjectBoard) => {
    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    localStorage.setItem("fluxBoards", JSON.stringify(updatedBoards));
    setCurrentBoard(newBoard);
    toast({
      title: "Board Created",
      description: `${newBoard.name} has been created successfully`,
    });
  };

  //Works
  const addProject = (newProject: any) => {
    const user = JSON.parse(localStorage.getItem("fluxUser") || "{}");
    console.log(newProject);
    console.log(user.userId);
    createProject(newProject, user.userId);
  };
  
  const populateProjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("fluxUser") || "{}");
      const fetchedProjects = await retrieveProjects(user.userId);
      console.log("Populated projects: ", fetchedProjects);
      if (Array.isArray(fetchedProjects)) {
        setProjects(fetchedProjects);
      }
      
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateProject = (projectId: string, updates: any) => {
    // If this is a status update, call the dedicated status update function
    if (updates.status) {
      updateProjectStatus(projectId, updates.status);
      console.log("Updated project status: ", updates.status);
    }

    // Update other project fields
    const updatedProjects = projects.map(project => 
      project.id === projectId ? { ...project, ...updates } : project
    );
    setProjects(updatedProjects);
    
    // Refresh projects from backend
    void populateProjects();
  };
  
  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    // Refresh projects from backend
    void populateProjects();
  };

  const addCategory = () => {
    if (!newCategory.trim() || !currentBoard) return;
    
    const categoryId = newCategory.toLowerCase().replace(/\s+/g, '-');
    const updatedBoard = {
      ...currentBoard,
      categories: [
        ...currentBoard.categories,
        { id: categoryId, name: newCategory }
      ]
    };

    const updatedBoards = boards.map(board => 
      board.id === currentBoard.id ? updatedBoard : board
    );
    
    setBoards(updatedBoards);
    setCurrentBoard(updatedBoard);
    localStorage.setItem("fluxBoards", JSON.stringify(updatedBoards));
    setNewCategory("");
    setShowNewCategoryInput(false);
    setActiveCategory(categoryId);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || 
                          (project.status && project.status.toLowerCase().replace(' ', '-') === statusFilter);

    const matchesCategory = activeCategory === "all" || 
                            (project.category && project.category === activeCategory);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const convertToGroupQuest = (project: any) => {
    const quest = {
      id: `quest-${project.id}`,
      title: project.name,
      description: project.description,
      assignedBy: "You",
      assignedTo: [],
      isGroupQuest: true,
      groupMembers: project.team || [],
      difficulty: "MODERATE",
      status: "AVAILABLE",
      xpReward: 500,
      dueDate: project.dueDate,
      createdAt: new Date().toISOString(),
      projectId: project.id,
      projectName: project.name
    };

    const existingQuests = JSON.parse(localStorage.getItem("fluxQuests") || "[]");
    localStorage.setItem("fluxQuests", JSON.stringify([...existingQuests, quest]));

    const updatedProject = { ...project, isGroupQuest: true };
    updateProject(project.id, updatedProject);

    toast({
      title: "Group Quest Created",
      description: `${project.name} has been converted to a group quest`,
    });
  };

  const isDevelopmentCategory = activeCategory === "development";

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <div className="flex gap-2">
          <BoardSwitcher
            boards={boards}
            currentBoard={currentBoard!}
            onBoardChange={handleBoardChange}
          />
          <NewBoardDialog onBoardCreated={handleNewBoard} />
          <NewProjectDialog 
            addProject={addProject} 
            categories={currentBoard?.categories.filter(c => c.id !== 'all') || []} 
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {currentBoard?.categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`whitespace-nowrap ${
                activeCategory === category.id 
                  ? category.id === "development" 
                    ? "bg-[#0052CC] text-white hover:bg-[#0047B3]" 
                    : "bg-primary text-primary-foreground"
                  : ""
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
          
          {showNewCategoryInput ? (
            <div className="flex items-center space-x-2">
              <Input 
                type="text" 
                placeholder="Category name" 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-40"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addCategory();
                  if (e.key === 'Escape') setShowNewCategoryInput(false);
                }}
              />
              <Button variant="outline" size="icon" onClick={addCategory}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="whitespace-nowrap" onClick={() => setShowNewCategoryInput(true)}>
              <FolderPlus className="h-4 w-4 mr-2" /> Add Category
            </Button>
          )}
        </div>
      </div>

      {isDevelopmentCategory && (
        <div className="flex justify-between items-center mb-4">
          <JiraSync />
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="search" 
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <select 
            className="border rounded-md px-3 py-2 bg-white text-gray-800"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
        <TabsList className="w-full bg-white p-1 flex justify-start border rounded-lg">
          <TabsTrigger value="table" className="flex items-center">
            <TableIcon className="h-4 w-4 mr-2" /> Table
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center">
            <SquareKanban className="h-4 w-4 mr-2" /> Kanban
          </TabsTrigger>
          <TabsTrigger value="gantt" className="flex items-center">
            <ChartGantt className="h-4 w-4 mr-2" /> Gantt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-4">
          <TableView 
            projects={filteredProjects} 
            navigate={navigate}
            emptyMessage={
              searchQuery || statusFilter !== "all" || activeCategory !== "all" 
                ? "No projects found matching your criteria" 
                : "No projects yet. Create your first project to get started!"
            }
            onClearFilters={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setActiveCategory("all");
            }}
            updateProject={updateProject}
            deleteProject={deleteProject}
            convertToGroupQuest={convertToGroupQuest}
          />
        </TabsContent>
        
        <TabsContent value="kanban" className="mt-4">
          <KanbanView 
            projects={filteredProjects} 
            navigate={navigate}
            emptyMessage={
              searchQuery || statusFilter !== "all" || activeCategory !== "all" 
                ? "No projects found matching your criteria" 
                : "No projects yet. Create your first project to get started!"
            }
            onClearFilters={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setActiveCategory("all");
            }}
          />
        </TabsContent>
        
        <TabsContent value="gantt" className="mt-4">
          <GanttView 
            projects={filteredProjects} 
            navigate={navigate}
            emptyMessage={
              searchQuery || statusFilter !== "all" || activeCategory !== "all" 
                ? "No projects found matching your criteria" 
                : "No projects yet. Create your first project to get started!"
            }
            onClearFilters={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setActiveCategory("all");
            }}
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Projects;
