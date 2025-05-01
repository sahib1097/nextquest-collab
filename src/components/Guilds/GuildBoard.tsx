
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateGuildDialog } from "./CreateGuildDialog";
import { GuildProfilePage } from "./GuildProfilePage";
import GuildEmptyState from "./GuildEmptyState";
import GuildCard from "./GuildCard";
import GuildSearch from "./GuildSearch";

const mockGuilds = [
  {
    id: "g1",
    name: "Dragon Slayers",
    description: "Elite guild focused on the toughest challenges",
    level: 5,
    xp: 2500,
    nextLevelXp: 3000,
    members: 8,
    maxMembers: 10,
    focus: "Development",
    achievements: 12,
    leader: "Sarah",
    banner: "/lovable-uploads/5324e09e-faa9-409b-8b3c-5eb4cb764e77.png"
  },
  {
    id: "g2",
    name: "Code Wizards",
    description: "Mastering the arcane arts of clean code",
    level: 3,
    xp: 1400,
    nextLevelXp: 2000,
    members: 6,
    maxMembers: 15,
    focus: "Design",
    achievements: 7,
    leader: "Michael",
    banner: "/lovable-uploads/7e8f508b-4ea9-4ff0-869a-00e88d532275.png"
  },
  {
    id: "g3",
    name: "QA Knights",
    description: "Defending the realm from bugs and glitches",
    level: 4,
    xp: 2100,
    nextLevelXp: 2500,
    members: 5,
    maxMembers: 12,
    focus: "Testing",
    achievements: 9,
    leader: "Alex",
    banner: "/lovable-uploads/f44da06d-430c-4883-a4c2-fc7c23f90541.png"
  }
];

const GuildBoard = () => {
  const [guilds, setGuilds] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null);
  
  useEffect(() => {
    const storedGuilds = localStorage.getItem("fluxGuilds");
    if (storedGuilds) {
      setGuilds(JSON.parse(storedGuilds));
    } else {
      setGuilds(mockGuilds);
      localStorage.setItem("fluxGuilds", JSON.stringify(mockGuilds));
    }
  }, []);

  const filteredGuilds = guilds.filter(guild => {
    const matchesSearch = guild.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         guild.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && guild.focus === filter;
  });

  const handleGuildCreated = (newGuild: any) => {
    const updatedGuilds = [...guilds, newGuild];
    setGuilds(updatedGuilds);
    localStorage.setItem("fluxGuilds", JSON.stringify(updatedGuilds));
    setIsDialogOpen(false);
  };
  
  const handleViewGuild = (guildId: string) => {
    setSelectedGuildId(guildId);
  };
  
  const handleBackToList = () => {
    setSelectedGuildId(null);
  };

  if (selectedGuildId) {
    const selectedGuild = guilds.find(guild => guild.id === selectedGuildId);
    if (selectedGuild) {
      return <GuildProfilePage id={selectedGuildId} onClose={handleBackToList} guild={selectedGuild} />;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="px-4 py-2 bg-[#006187] text-[#ffe8a3] text-l tracking-wide border-4 border-[#013d54] rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] uppercase">
          <h2 className="text-3xl font-extrabold">Guild Hall</h2>
          <p className="text-white font-semibold">Join or create a guild to collaborate and earn rewards together</p>
        </div>
        <button onClick={() => setIsDialogOpen(true)}
          className="relative flex items-center justify-center h-12 px-10 text-sm font-bold text-[#ffe8a3] group"
        >
          
          {/* Background frame */}
          <img
              src="/assets/F_UI_MenuButton_C2.png"
              alt="Button Frame"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none"
            />
          
            {/* Left handle */}
            <img
              src="/assets/F_U_Detail4-Left.png"
              alt="Left Detail"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 pointer-events-none"
            />
          
            {/* Button Text */}
            <span className="relative z-10 flex"><Plus className="h-4 w-4 mr-1 my-auto" /> Create Guild</span>
          
            {/* Right handle */}
            <img
              src="/assets/F_U_Detail4.png"
              alt="Right Detail"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-8 pointer-events-none"
            />
        </button>
      </div>
      
      <CreateGuildDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onGuildCreated={handleGuildCreated}
      />
      
      <GuildSearch 
        searchQuery={searchQuery}
        filter={filter}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilter}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuilds.length > 0 ? (
          filteredGuilds.map((guild) => (
            <GuildCard 
              key={guild.id}
              guild={guild}
              onViewGuild={handleViewGuild}
            />
          ))
        ) : (
          <GuildEmptyState 
            hasSearch={searchQuery !== "" || filter !== "all"}
            onCreateClick={() => setIsDialogOpen(true)}
          />
        )}
      </div>
    </div>
  );
};

export default GuildBoard;

