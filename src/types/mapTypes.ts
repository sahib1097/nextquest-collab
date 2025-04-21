
export type DistrictType = "corporate" | "creative" | "guild" | "default";

export interface CityDistrict {
  id: string;
  name: string;
  type: DistrictType;
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  questTypes: string[]; // The types of quests this district can contain
  detail?: string; // Description of the district
  buildingCount?: number; // Number of buildings to render
  luminosity?: number; // How bright the district appears (0-1)
}

// New interfaces for cyberpunk elements
export interface CyberBuilding {
  height: number;
  width: number;
  x: number;
  luminosity: number; // 0-1 scale for brightness
  windows: number; // Number of windows to render
  antennas?: boolean; // If building has antennas
}

export interface Drone {
  id: string;
  position: {
    x: number;
    y: number;
  };
  path: Array<{x: number, y: number}>; // Patrol path points
  questId?: string; // Associated quest if any
  speed: number; // Movement speed
  type: "delivery" | "patrol" | "scanner";
}
