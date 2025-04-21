import { v4 as uuidv4 } from "uuid";
import { Roadmap, RoadmapItem, ProjectLinkOption } from "@/types/roadmap";

// Mock colors for new roadmap items
const ITEM_COLORS = [
  "#9b87f5",
  "#7E69AB", 
  "#F97316",
  "#0EA5E9",
  "#D946EF",
  "#8B5CF6",
  "#33C3F0",
  "#1EAEDB"
];

// Get roadmaps from localStorage or return default if none exist
export const getRoadmaps = (): Roadmap[] => {
  const storedRoadmaps = localStorage.getItem("roadmaps");
  if (storedRoadmaps) {
    const parsedRoadmaps = JSON.parse(storedRoadmaps);
    
    // Convert string dates back to Date objects
    return parsedRoadmaps.map((roadmap: any) => ({
      ...roadmap,
      items: roadmap.items.map((item: any) => ({
        ...item,
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate)
      }))
    }));
  }

  // Default roadmap if none exists
  const defaultRoadmap: Roadmap = {
    id: uuidv4(),
    name: "Product Development",
    items: [
      {
        id: uuidv4(),
        title: "Feature A Development",
        description: "Build core functionality",
        startDate: new Date(new Date().getFullYear(), 0, 1),
        endDate: new Date(new Date().getFullYear(), 3, 15),
        progress: 70,
        color: "bg-blue-500"
      },
      {
        id: uuidv4(),
        title: "Marketing Campaign",
        description: "Launch on social media",
        startDate: new Date(new Date().getFullYear(), 2, 1),
        endDate: new Date(new Date().getFullYear(), 6, 30),
        progress: 30,
        color: "bg-amber-500"
      },
      {
        id: uuidv4(),
        title: "Product Launch",
        description: "Public release",
        startDate: new Date(new Date().getFullYear(), 5, 1),
        endDate: new Date(new Date().getFullYear(), 8, 30),
        progress: 10,
        color: "bg-green-500"
      },
      {
        id: uuidv4(),
        title: "Platform Redesign",
        description: "UI/UX overhaul",
        startDate: new Date(new Date().getFullYear(), 8, 1),
        endDate: new Date(new Date().getFullYear(), 11, 31),
        progress: 0,
        color: "bg-purple-500"
      }
    ]
  };

  saveRoadmaps([defaultRoadmap]);
  return [defaultRoadmap];
};

// Save roadmaps to localStorage
export const saveRoadmaps = (roadmaps: Roadmap[]) => {
  localStorage.setItem("roadmaps", JSON.stringify(roadmaps));
};

// Create a new roadmap
export const createRoadmap = (name: string): Roadmap => {
  const newRoadmap: Roadmap = {
    id: uuidv4(),
    name,
    items: []
  };
  
  const roadmaps = getRoadmaps();
  roadmaps.push(newRoadmap);
  saveRoadmaps(roadmaps);
  
  return newRoadmap;
};

// Add a new item to a roadmap
export const addRoadmapItem = (roadmapId: string, item: Omit<RoadmapItem, "id" | "color">): RoadmapItem => {
  const roadmaps = getRoadmaps();
  const roadmapIndex = roadmaps.findIndex(r => r.id === roadmapId);
  
  if (roadmapIndex === -1) {
    throw new Error("Roadmap not found");
  }

  // Create new item with random color
  const newItem: RoadmapItem = {
    ...item,
    id: uuidv4(),
    color: ITEM_COLORS[Math.floor(Math.random() * ITEM_COLORS.length)]
  };
  
  roadmaps[roadmapIndex].items.push(newItem);
  saveRoadmaps(roadmaps);
  
  return newItem;
};

// Delete a roadmap item
export const deleteRoadmapItem = (roadmapId: string, itemId: string): void => {
  const roadmaps = getRoadmaps();
  const roadmapIndex = roadmaps.findIndex(r => r.id === roadmapId);
  
  if (roadmapIndex === -1) {
    throw new Error("Roadmap not found");
  }
  
  roadmaps[roadmapIndex].items = roadmaps[roadmapIndex].items.filter(item => item.id !== itemId);
  saveRoadmaps(roadmaps);
};

// Delete an entire roadmap
export const deleteRoadmap = (roadmapId: string): void => {
  let roadmaps = getRoadmaps();
  roadmaps = roadmaps.filter(r => r.id !== roadmapId);
  
  if (roadmaps.length === 0) {
    // If all roadmaps were deleted, create a default one
    roadmaps = [createRoadmap("Default Roadmap")];
  }
  
  saveRoadmaps(roadmaps);
};

// Filter roadmap items by year
export const filterRoadmapItemsByYear = (items: RoadmapItem[], year: number): RoadmapItem[] => {
  return items.filter(item => {
    const startYear = item.startDate.getFullYear();
    const endYear = item.endDate.getFullYear();
    return startYear === year || endYear === year || (startYear < year && endYear > year);
  });
};

// Get available projects for linking
export const getAvailableProjects = (): ProjectLinkOption[] => {
  try {
    const storedProjects = localStorage.getItem("fluxProjects");
    if (!storedProjects) {
      return [];
    }

    const projects = JSON.parse(storedProjects);
    return projects.map((project: any) => ({
      id: project.id,
      name: project.name,
      status: project.status || "planning"
    }));
  } catch (error) {
    console.error("Error getting available projects:", error);
    return [];
  }
};

// Link projects to a roadmap item
export const linkProjectsToRoadmapItem = (roadmapId: string, itemId: string, projectIds: string[]): void => {
  try {
    const roadmaps = getRoadmaps();
    const roadmapIndex = roadmaps.findIndex(r => r.id === roadmapId);
    
    if (roadmapIndex === -1) {
      throw new Error("Roadmap not found");
    }
    
    const itemIndex = roadmaps[roadmapIndex].items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      throw new Error("Roadmap item not found");
    }
    
    // Update the linked projects first
    roadmaps[roadmapIndex].items[itemIndex].linkedProjects = [...projectIds];
    
    // Then calculate progress if there are linked projects
    if (projectIds.length > 0) {
      try {
        const projectsData = localStorage.getItem("fluxProjects");
        if (!projectsData) {
          roadmaps[roadmapIndex].items[itemIndex].progress = 0;
        } else {
          const projects = JSON.parse(projectsData);
          const linkedProjects = projects.filter((p: any) => projectIds.includes(p.id));
          
          // Calculate progress based on project status
          if (linkedProjects.length === 0) {
            roadmaps[roadmapIndex].items[itemIndex].progress = 0;
          } else {
            let completedCount = 0;
            linkedProjects.forEach((project: any) => {
              if (project.status?.toLowerCase() === "completed") {
                completedCount++;
              }
            });
            
            const progress = Math.round((completedCount / linkedProjects.length) * 100);
            roadmaps[roadmapIndex].items[itemIndex].progress = progress;
          }
        }
      } catch (error) {
        console.error("Error calculating progress:", error);
        // Don't update progress if there was an error
      }
    }
    
    // Save the updated roadmaps
    saveRoadmaps(roadmaps);
  } catch (error) {
    console.error("Error linking projects:", error);
    throw error;
  }
};

// Get linked projects for a roadmap item
export const getLinkedProjectsForItem = (itemId: string): ProjectLinkOption[] => {
  try {
    const roadmaps = getRoadmaps();
    
    for (const roadmap of roadmaps) {
      const item = roadmap.items.find(i => i.id === itemId);
      if (item && item.linkedProjects && item.linkedProjects.length > 0) {
        const projectsData = localStorage.getItem("fluxProjects");
        if (!projectsData) return [];
        
        const allProjects = JSON.parse(projectsData);
        return allProjects
          .filter((p: any) => item.linkedProjects?.includes(p.id))
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            status: p.status || "planning"
          }));
      }
    }
    
    return [];
  } catch (error) {
    console.error("Error getting linked projects:", error);
    return [];
  }
};

// Update the color of a roadmap item
export const updateRoadmapItemColor = (roadmapId: string, itemId: string, newColor: string): void => {
  try {
    const roadmaps = getRoadmaps();
    const roadmapIndex = roadmaps.findIndex(r => r.id === roadmapId);
    
    if (roadmapIndex === -1) {
      throw new Error("Roadmap not found");
    }
    
    const itemIndex = roadmaps[roadmapIndex].items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      throw new Error("Roadmap item not found");
    }
    
    roadmaps[roadmapIndex].items[itemIndex].color = newColor;
    saveRoadmaps(roadmaps);
  } catch (error) {
    console.error("Error updating item color:", error);
    throw error;
  }
};
