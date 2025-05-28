import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateGuildDialog } from "./CreateGuildDialog";
import { GuildProfilePage } from "./GuildProfilePage";
import GuildEmptyState from "./GuildEmptyState";
import GuildCard from "./GuildCard";
import GuildSearch from "./GuildSearch";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { currentTheme } = useTheme();
  const isMedievalTheme = currentTheme.name === "Medieval";
  const isCyberpunkTheme = currentTheme.name === "Cyberpunk";
  
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
        {isMedievalTheme ? (
          <>
            <div className="px-4 py-2 bg-[#006187] text-[#ffe8a3] text-l tracking-wide border-4 border-[#013d54] rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] uppercase">
              <h2 className="text-3xl font-extrabold">Guild Hall</h2>
              <p className="text-white font-semibold">Join or create a guild to collaborate and earn rewards together</p>
            </div>
            <button 
              onClick={() => setIsDialogOpen(true)}
              className="relative flex items-center justify-center h-12 px-10 text-sm font-bold text-[#ffe8a3] group"
            >
              {/* Background frame */}
              <img
                src="/assets/themes/medieval/sprites/F_UI_MenuButton_C2.png"
                alt="Button Frame"
                className="absolute inset-0 w-full h-full object-fill pointer-events-none"
              />
              
              {/* Left handle */}
              <img
                src="/assets/themes/medieval/sprites/F_U_Detail4-Left.png"
                alt="Left Detail"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-8 pointer-events-none"
              />
              
              {/* Button Text */}
              <span className="relative z-10 flex">
                <Plus className="h-4 w-4 mr-1 my-auto" /> Create Guild
              </span>
              
              {/* Right handle */}
              <img
                src="/assets/themes/medieval/sprites/F_U_Detail4.png"
                alt="Right Detail"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-8 pointer-events-none"
              />
            </button>
          </>
        ) : isCyberpunkTheme ? (
          <>
            <div>
              <h2 className="text-2xl font-bold text-[#2DE2E6] font-mono tracking-wider">Guild Hall</h2>
              <p className="text-[#E0F2FF] font-mono">Join or create a guild to collaborate and earn rewards together</p>
            </div>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="relative group overflow-hidden"
            >
              {/* Parallelogram container with skew transform */}
              <div className="relative mx-4">
                {/* Main button shape - parallelogram */}
                <div 
                  className="relative h-12 px-12 py-3 transform skew-x-[-12deg] bg-gradient-to-r from-[#141622] via-[#1a1f2e] to-[#141622] border-2 border-[#2DE2E6] shadow-[0_0_20px_rgba(45,226,230,0.4)] transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(45,226,230,0.8)] group-hover:border-[#FF2E97]"
                >
                  {/* Inner glow effect */}
                  <div className="absolute inset-[2px] bg-gradient-to-r from-[#2DE2E6]/10 via-transparent to-[#FF2E97]/10 transform transition-all duration-300 group-hover:from-[#FF2E97]/20 group-hover:to-[#2DE2E6]/20" />
                  
                  {/* Circuit trace decorations */}
                  <div className="absolute top-1 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-[#2DE2E6] to-transparent opacity-60" />
                  <div className="absolute bottom-1 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-[#FF2E97] to-transparent opacity-40" />
                  
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-[#2DE2E6] opacity-80" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-[#FF2E97] opacity-80" />
                </div>
                
                {/* Button content - counter-skewed to appear normal */}
                <div className="absolute inset-0 flex items-center justify-center transform skew-x-[12deg] pointer-events-none">
                  <div className="flex items-center text-sm font-bold uppercase tracking-wide">
                    {/* Plus icon with glow */}
                    <div className="relative mr-2 mx-2">
                      <Plus className="h-4 w-4 text-[#2DE2E6] drop-shadow-[0_0_8px_rgba(45,226,230,0.8)] transition-all duration-300 group-hover:text-[#FF2E97] group-hover:drop-shadow-[0_0_12px_rgba(255,46,151,0.8)]" />
                      {/* Glitch effect overlay */}
                      <Plus className="absolute top-0 left-0 h-4 w-4 text-[#FF2E97] opacity-0 group-hover:opacity-30 transition-opacity duration-150" style={{ transform: 'translate(1px, -1px)' }} />
                    </div>
                    
                    {/* Text with gradient */}
                    <span className="bg-gradient-to-r from-[#2DE2E6] to-[#E0F2FF] bg-clip-text text-transparent font-mono transition-all duration-300 group-hover:from-[#FF2E97] group-hover:to-[#2DE2E6]">
                      Create Guild
                    </span>
                  </div>
                </div>
                
                {/* Animated scanning line */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#2DE2E6] to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transform skew-x-[-12deg]" />
                </div>
                
                {/* Holographic shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </div>
            </button>
          </>
        ) : (
          <>
        <div>
          <h2 className="text-2xl font-bold">Guild Hall</h2>
          <p className="text-gray-500">Join or create a guild to collaborate and earn rewards together</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create Guild
        </Button>
          </>
        )}
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

