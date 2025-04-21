import { useState, useEffect } from "react";
import { 
  Achievement, 
  AchievementParameter, 
  AchievementType, 
  TrophyRarity 
} from "@/types/social";
import { DEFAULT_ACHIEVEMENTS } from "@/data/achievements";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Plus, Settings, Users, CheckSquare } from "lucide-react";
import AchievementBadge from "./AchievementBadge";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface AchievementManagerProps {
  userId?: string;
}

const AchievementManager = ({ userId = "admin" }: AchievementManagerProps) => {
  const [activeTab, setActiveTab] = useState<string>("achievements");
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [parameters, setParameters] = useState<AchievementParameter[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [newAchievement, setNewAchievement] = useState<Partial<Achievement>>({
    type: AchievementType.BRONZE,
    rarity: TrophyRarity.COMMON,
    icon: "trophy",
    hidden: false
  });

  useEffect(() => {
    // Load achievement parameters
    const storedParameters = localStorage.getItem("flux_achievement_parameters");
    if (storedParameters) {
      setParameters(JSON.parse(storedParameters));
    }

    // Always start with the default achievements as the base
    const customAchievements = localStorage.getItem("flux_custom_achievements");
    if (customAchievements) {
      const parsedCustom = JSON.parse(customAchievements);
      
      // Merge custom achievements with defaults, preferring custom if there's a duplicate ID
      const mergedAchievements = [...DEFAULT_ACHIEVEMENTS];
      
      parsedCustom.forEach((customAchievement: Achievement) => {
        const index = mergedAchievements.findIndex(a => a.id === customAchievement.id);
        if (index >= 0) {
          mergedAchievements[index] = customAchievement;
        } else {
          mergedAchievements.push(customAchievement);
        }
      });
      
      setAchievements(mergedAchievements);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleAddAchievement = () => {
    // Generate a unique ID based on the name
    const id = newAchievement.name ? 
      newAchievement.name.toLowerCase().replace(/\s+/g, '-') : 
      `custom-${Date.now()}`;
    
    const achievement: Achievement = {
      id,
      name: newAchievement.name || "New Achievement",
      description: newAchievement.description || "Description needed",
      type: newAchievement.type || AchievementType.BRONZE,
      rarity: newAchievement.rarity || TrophyRarity.COMMON,
      icon: newAchievement.icon || "trophy",
      hidden: newAchievement.hidden || false,
    };

    const updatedAchievements = [...achievements, achievement];
    setAchievements(updatedAchievements);
    
    // Save custom achievements separately
    const customAchievements = updatedAchievements.filter(
      a => !DEFAULT_ACHIEVEMENTS.some(da => da.id === a.id)
    );
    localStorage.setItem("flux_custom_achievements", JSON.stringify(customAchievements));
    
    setIsAddDialogOpen(false);
    setNewAchievement({
      type: AchievementType.BRONZE,
      rarity: TrophyRarity.COMMON,
      icon: "trophy",
      hidden: false
    });
  };

  const handleUpdateAchievement = () => {
    if (!editingAchievement) return;
    
    const updatedAchievements = achievements.map(a => 
      a.id === editingAchievement.id ? editingAchievement : a
    );
    
    setAchievements(updatedAchievements);
    
    // Save custom achievements separately
    const customAchievements = updatedAchievements.filter(
      a => !DEFAULT_ACHIEVEMENTS.some(da => da.id === a.id) || 
      (DEFAULT_ACHIEVEMENTS.some(da => da.id === a.id) && 
       JSON.stringify(DEFAULT_ACHIEVEMENTS.find(da => da.id === a.id)) !== 
       JSON.stringify(updatedAchievements.find(ua => ua.id === a.id)))
    );
    localStorage.setItem("flux_custom_achievements", JSON.stringify(customAchievements));
    
    setIsEditDialogOpen(false);
    setEditingAchievement(null);
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setEditingAchievement({ ...achievement });
    setIsEditDialogOpen(true);
  };

  const handleSaveParameter = (parameter: AchievementParameter) => {
    const updatedParameters = [...parameters];
    const existingIndex = parameters.findIndex(p => p.id === parameter.id);
    
    if (existingIndex >= 0) {
      updatedParameters[existingIndex] = parameter;
    } else {
      updatedParameters.push(parameter);
    }
    
    setParameters(updatedParameters);
    localStorage.setItem("flux_achievement_parameters", JSON.stringify(updatedParameters));
  };

  const handleTestAward = (achievement: Achievement) => {
    // Award this achievement to the current user for testing
    const storedAchievements = localStorage.getItem(`flux_achievements_${userId}`) || '[]';
    const userAchievements: Achievement[] = JSON.parse(storedAchievements);
    
    // Check if user already has this achievement
    const existingIndex = userAchievements.findIndex(a => a.id === achievement.id);
    
    if (existingIndex >= 0) {
      // Remove it (toggle)
      userAchievements.splice(existingIndex, 1);
    } else {
      // Add it with earned date
      userAchievements.push({
        ...achievement,
        earnedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(`flux_achievements_${userId}`, JSON.stringify(userAchievements));
    window.location.reload(); // Reload to show changes in the showcase
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" /> Trophy Management
        </CardTitle>
        <CardDescription>
          Create and manage PlayStation-style trophies for users to earn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="achievements">Trophies</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="stats">User Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="achievements">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">Trophy List</h3>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add Trophy
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Trophy</DialogTitle>
                    <DialogDescription>
                      Add a new PlayStation-style trophy for users to earn
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Trophy Name</Label>
                      <Input 
                        id="name" 
                        value={newAchievement.name || ''} 
                        onChange={(e) => setNewAchievement({...newAchievement, name: e.target.value})}
                        placeholder="e.g. Speed Demon"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        value={newAchievement.description || ''}
                        onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                        placeholder="Describe how to earn this trophy"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="type">Trophy Type</Label>
                        <Select 
                          value={newAchievement.type}
                          onValueChange={(value) => setNewAchievement({
                            ...newAchievement, 
                            type: value as AchievementType
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={AchievementType.BRONZE}>Bronze</SelectItem>
                            <SelectItem value={AchievementType.SILVER}>Silver</SelectItem>
                            <SelectItem value={AchievementType.GOLD}>Gold</SelectItem>
                            <SelectItem value={AchievementType.PLATINUM}>Platinum</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="rarity">Rarity</Label>
                        <Select
                          value={newAchievement.rarity}
                          onValueChange={(value) => setNewAchievement({
                            ...newAchievement, 
                            rarity: value as TrophyRarity
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select rarity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TrophyRarity.COMMON}>Common</SelectItem>
                            <SelectItem value={TrophyRarity.UNCOMMON}>Uncommon</SelectItem>
                            <SelectItem value={TrophyRarity.RARE}>Rare</SelectItem>
                            <SelectItem value={TrophyRarity.VERY_RARE}>Very Rare</SelectItem>
                            <SelectItem value={TrophyRarity.ULTRA_RARE}>Ultra Rare</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="icon">Icon (Lucide icon name)</Label>
                      <Input 
                        id="icon" 
                        value={newAchievement.icon || 'trophy'}
                        onChange={(e) => setNewAchievement({...newAchievement, icon: e.target.value})}
                        placeholder="e.g. trophy, award, star"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={newAchievement.hidden} 
                        onCheckedChange={(checked) => setNewAchievement({...newAchievement, hidden: checked})}
                        id="hidden"
                      />
                      <Label htmlFor="hidden">Hidden trophy (details revealed only when earned)</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAchievement}>Create Trophy</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trophy</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Rarity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {achievements.map((achievement) => (
                    <TableRow key={achievement.id}>
                      <TableCell className="flex items-center gap-2">
                        <AchievementBadge achievement={achievement} size="sm" />
                      </TableCell>
                      <TableCell>
                        <Badge className={achievement.type === "Bronze" ? "bg-amber-100 text-amber-800" : 
                          achievement.type === "Silver" ? "bg-slate-200 text-slate-700" : 
                          achievement.type === "Gold" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-blue-100 text-blue-800"}>
                          {achievement.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{achievement.rarity}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{achievement.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditAchievement(achievement)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleTestAward(achievement)}
                          >
                            Test Award
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="parameters">
            <div className="text-center p-8">
              <Settings className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Achievement Parameters</h3>
              <p className="text-gray-500 mb-4">
                Define rules that automatically award trophies when specific conditions are met
              </p>
              <Button>Add Parameter</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="text-center p-8">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">User Trophy Statistics</h3>
              <p className="text-gray-500 mb-4">
                View which trophies have been earned by users and their rarity
              </p>
              <Button>View Report</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t bg-gray-50 flex justify-between">
        <div className="text-xs text-gray-500">
          {achievements.length} trophies configured ({achievements.filter(a => a.type === AchievementType.BRONZE).length} Bronze / {achievements.filter(a => a.type === AchievementType.SILVER).length} Silver / {achievements.filter(a => a.type === AchievementType.GOLD).length} Gold / {achievements.filter(a => a.type === AchievementType.PLATINUM).length} Platinum)
        </div>
        <div>
          <Button variant="outline" size="sm">
            <CheckSquare className="h-4 w-4 mr-1" /> Save Changes
          </Button>
        </div>
      </CardFooter>
      
      {/* Edit Achievement Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Trophy</DialogTitle>
            <DialogDescription>
              Modify this PlayStation-style trophy
            </DialogDescription>
          </DialogHeader>
          
          {editingAchievement && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Trophy Name</Label>
                <Input 
                  id="edit-name" 
                  value={editingAchievement.name} 
                  onChange={(e) => setEditingAchievement({
                    ...editingAchievement, 
                    name: e.target.value
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  value={editingAchievement.description}
                  onChange={(e) => setEditingAchievement({
                    ...editingAchievement, 
                    description: e.target.value
                  })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-type">Trophy Type</Label>
                  <Select 
                    value={editingAchievement.type}
                    onValueChange={(value) => setEditingAchievement({
                      ...editingAchievement, 
                      type: value as AchievementType
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AchievementType.BRONZE}>Bronze</SelectItem>
                      <SelectItem value={AchievementType.SILVER}>Silver</SelectItem>
                      <SelectItem value={AchievementType.GOLD}>Gold</SelectItem>
                      <SelectItem value={AchievementType.PLATINUM}>Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-rarity">Rarity</Label>
                  <Select
                    value={editingAchievement.rarity}
                    onValueChange={(value) => setEditingAchievement({
                      ...editingAchievement, 
                      rarity: value as TrophyRarity
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TrophyRarity.COMMON}>Common</SelectItem>
                      <SelectItem value={TrophyRarity.UNCOMMON}>Uncommon</SelectItem>
                      <SelectItem value={TrophyRarity.RARE}>Rare</SelectItem>
                      <SelectItem value={TrophyRarity.VERY_RARE}>Very Rare</SelectItem>
                      <SelectItem value={TrophyRarity.ULTRA_RARE}>Ultra Rare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-icon">Icon (Lucide icon name)</Label>
                <Input 
                  id="edit-icon" 
                  value={editingAchievement.icon}
                  onChange={(e) => setEditingAchievement({
                    ...editingAchievement, 
                    icon: e.target.value
                  })}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  checked={editingAchievement.hidden} 
                  onCheckedChange={(checked) => setEditingAchievement({
                    ...editingAchievement, 
                    hidden: checked
                  })}
                  id="edit-hidden"
                />
                <Label htmlFor="edit-hidden">Hidden trophy</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAchievement}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AchievementManager;
