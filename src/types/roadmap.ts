
export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  color: string;
  linkedProjects?: string[]; // IDs of linked projects
  projectId?: string;
  projectName?: string;
}

export interface Roadmap {
  id: string;
  name: string;
  items: RoadmapItem[];
}

export interface ProjectLinkOption {
  id: string;
  name: string;
  status: string;
}
