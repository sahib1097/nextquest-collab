
import { v4 as uuidv4 } from 'uuid';
import { CityDistrict, DistrictType, CyberBuilding, Drone } from '@/types/mapTypes';
import { Quest, QuestStatus } from '@/types/quest';

// Generate procedurally placed buildings for a district
export const generateDistrictBuildings = (district: CityDistrict): CyberBuilding[] => {
  const buildings: CyberBuilding[] = [];
  const buildingCount = district.buildingCount || Math.floor(district.width / 15);
  
  for (let i = 0; i < buildingCount; i++) {
    const height = Math.random() * (district.height * 0.8) + (district.height * 0.3);
    const width = 8 + Math.random() * 10;
    const x = (i / buildingCount) * district.width - width/2;
    
    buildings.push({
      height,
      width,
      x,
      luminosity: district.type === 'corporate' ? 0.8 : 
                  district.type === 'creative' ? 0.7 : 
                  district.type === 'guild' ? 0.9 : 0.6,
      windows: Math.floor(height / 12),
      antennas: Math.random() > 0.6
    });
  }
  
  return buildings;
};

// Generate patrol drones for the map
export const generateDrones = (quests: Quest[], districts: CityDistrict[]): Drone[] => {
  const drones: Drone[] = [];
  
  // Add delivery drones for urgent quests
  const urgentQuests = quests.filter(q => {
    const dueDate = new Date(q.dueDate);
    const diffDays = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && q.status !== QuestStatus.COMPLETED;
  });
  
  urgentQuests.forEach(quest => {
    const district = districts.find(d => 
      d.questTypes.includes(quest.isGroupQuest ? 'group' : 'individual')
    );
    
    if (district) {
      // Create a drone that patrols around the district
      const centerX = district.position.x;
      const centerY = district.position.y;
      const radius = Math.min(district.width, district.height) / 2;
      
      // Generate a roughly circular path
      const path = Array.from({length: 12}, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return {
          x: centerX + Math.cos(angle) * radius * (0.8 + Math.random() * 0.4),
          y: centerY + Math.sin(angle) * radius * (0.8 + Math.random() * 0.4)
        };
      });
      
      drones.push({
        id: uuidv4(),
        position: path[0],
        path,
        questId: quest.id,
        speed: 0.5 + Math.random() * 1.5,
        type: 'delivery'
      });
    }
  });
  
  // Add patrol drones that don't have specific quests
  districts.forEach(district => {
    if (Math.random() > 0.3) { // 70% chance to have patrol drones
      const patrolPoints = [];
      const pointCount = 4 + Math.floor(Math.random() * 4); // 4-7 patrol points
      
      for (let i = 0; i < pointCount; i++) {
        patrolPoints.push({
          x: district.position.x + (Math.random() - 0.5) * district.width,
          y: district.position.y + (Math.random() - 0.5) * district.height
        });
      }
      
      // Add the first point again to complete the loop
      patrolPoints.push({...patrolPoints[0]});
      
      drones.push({
        id: uuidv4(),
        position: patrolPoints[0],
        path: patrolPoints,
        speed: 0.3 + Math.random() * 0.7,
        type: Math.random() > 0.5 ? 'patrol' : 'scanner'
      });
    }
  });
  
  return drones;
};

// Generate city districts based on the quests
export const generateCityDistricts = (quests: Quest[]): CityDistrict[] => {
  const districts: CityDistrict[] = [];
  
  // Count quests by type to determine district size
  const workQuests = quests.filter(q => 
    q.title.toLowerCase().includes('work') || 
    q.description.toLowerCase().includes('work') ||
    q.projectName?.toLowerCase().includes('work')
  ).length;
  
  const teamQuests = quests.filter(q => q.isGroupQuest).length;
  const personalQuests = quests.length - workQuests - teamQuests;
  
  // Corporate District (Work Quests)
  if (workQuests > 0) {
    districts.push({
      id: uuidv4(),
      name: "Corporate District",
      type: "corporate" as DistrictType,
      position: { x: 200, y: 180 },
      width: 180 + (workQuests * 10),
      height: 150 + (workQuests * 8),
      questTypes: ['individual'],
      detail: "Neon-lit corporate towers",
      buildingCount: 8 + Math.floor(workQuests / 2),
      luminosity: 0.8
    });
  }
  
  // Creative District (Personal Quests)
  if (personalQuests > 0) {
    districts.push({
      id: uuidv4(),
      name: "Chaos Junkyard",
      type: "creative" as DistrictType,
      position: { x: 500, y: 200 },
      width: 150 + (personalQuests * 8),
      height: 120 + (personalQuests * 6),
      questTypes: ['individual'],
      detail: "Artistic underground hubs",
      buildingCount: 6 + Math.floor(personalQuests / 3),
      luminosity: 0.6
    });
  }
  
  // Guild District (Team Quests)
  if (teamQuests > 0) {
    districts.push({
      id: uuidv4(),
      name: "Guild Citadel",
      type: "guild" as DistrictType,
      position: { x: 350, y: 350 },
      width: 170 + (teamQuests * 12),
      height: 130 + (teamQuests * 10),
      questTypes: ['group'],
      detail: "Collaborative hubs with neon spires",
      buildingCount: 5 + teamQuests,
      luminosity: 0.75
    });
  }
  
  // If there are no quests yet, add a default district
  if (districts.length === 0) {
    districts.push({
      id: uuidv4(),
      name: "Night Market",
      type: "default" as DistrictType,
      position: { x: 350, y: 250 },
      width: 180,
      height: 120,
      questTypes: ['individual', 'group'],
      detail: "Central trade hub",
      buildingCount: 12,
      luminosity: 0.7
    });
  }
  
  // Add a small residential district if there are enough quests
  if (quests.length > 5) {
    districts.push({
      id: uuidv4(),
      name: "Neon Residences",
      type: "default" as DistrictType,
      position: { x: 450, y: 100 },
      width: 100,
      height: 80,
      questTypes: ['individual'],
      detail: "Living quarters with holographic ads",
      buildingCount: 9,
      luminosity: 0.5
    });
  }
  
  return districts;
};

// Calculate quest urgency level (0-1)
export const calculateQuestUrgency = (quest: Quest): number => {
  if (quest.status === QuestStatus.COMPLETED || quest.status === QuestStatus.FAILED) {
    return 0;
  }
  
  const dueDate = new Date(quest.dueDate);
  const now = new Date();
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return 1; // Past due
  if (diffDays <= 1) return 0.8; // Due today/tomorrow
  if (diffDays <= 3) return 0.6; // Due in 2-3 days
  if (diffDays <= 7) return 0.4; // Due this week
  if (diffDays <= 14) return 0.2; // Due next week
  return 0.1; // Due later
};

