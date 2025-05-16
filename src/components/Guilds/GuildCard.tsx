import React from "react";
import { motion } from "framer-motion";
import { Crown, Users, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GuildProgressBar } from "./GuildProgressBar";
import { useTheme } from "@/contexts/ThemeContext";

interface GuildCardProps {
  guild: any;
  onViewGuild: (guildId: string) => void;
}

const GuildCard = ({ guild, onViewGuild }: GuildCardProps) => {
  const { currentTheme } = useTheme();
  const isMedievalTheme = currentTheme.name === "Medieval";
  const isCyberpunkTheme = currentTheme.name === "Cyberpunk";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {isMedievalTheme ? (
        <Card className="relative border-4 border-[#a67c52] bg-[#fdf5e6] shadow-[0_4px_0_#6b4c32] rounded-2 p-0 overflow-hidden pixel-font">
          {/* Top Banner / Header */}
          <div 
            className="h-24 w-full bg-cover bg-center border-b-4 border-[#a67c52]" 
            style={{ backgroundImage: `url(${guild.banner || '/placeholder.svg'})` }}
          />

          {/* Card Header */}
          <CardHeader className="px-4 pt-3 pb-2 border-b-4 border-[#a67c52]">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg flex items-center gap-2 text-[#3b2e2a]">
                {guild.name}
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-sm border border-yellow-700">
                  <Trophy className="h-3 w-3 mr-1 inline" /> Lvl {guild.level}
                </span>
              </CardTitle>
              <div className="flex items-center gap-1 text-sm text-[#5a4333]">
                <Users className="h-4 w-4" /> 
                <span>{guild.members}/{guild.maxMembers}</span>
              </div>
            </div>
            <p className="text-sm text-[#5a4333] line-clamp-2 mt-1">{guild.description}</p>
          </CardHeader>

          {/* Content */}
          <CardContent className="px-4 pt-3">
            <div className="mb-3">
              <GuildProgressBar currentXp={guild.xp} maxXp={guild.nextLevelXp} />
            </div>
            <div className="flex justify-between items-center text-sm text-[#5a4333] mb-4">
              <div className="flex items-center gap-1">
                <Crown className="h-3.5 w-3.5 text-amber-600" />
                <span>{guild.leader}</span>
              </div>
              <div className="bg-[#e2d3b3] text-[#3b2e2a] px-2 py-0.5 rounded-sm border border-[#b19b74]">
                {guild.focus}
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-2 border-[#a67c52] bg-[#fff8dc] text-[#3b2e2a] hover:bg-[#ffe8b3]"
              onClick={() => onViewGuild(guild.id)}
            >
              View Guild
            </Button>
          </CardContent>
        </Card>
      ) : isCyberpunkTheme ? (
        <Card className="relative bg-[#141622]/90 border-2 border-[#2DE2E6] rounded-lg overflow-hidden backdrop-blur-sm shadow-[0_0_20px_rgba(45,226,230,0.2)] hover:shadow-[0_0_30px_rgba(45,226,230,0.3)] transition-all duration-300">
          {/* Cyberpunk Banner */}
          <div className="relative h-24 w-full">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${guild.banner || '/placeholder.svg'})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF2E97]/30 to-[#2DE2E6]/30 mix-blend-overlay" />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#141622] to-transparent" />
          </div>

          {/* Card Header */}
          <CardHeader className="px-4 pt-3 pb-2 border-b border-[#2DE2E6]/30">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg flex items-center gap-2 text-[#E0F2FF]">
                {guild.name}
                <span className="text-xs bg-[#261D54] text-[#2DE2E6] px-2 py-0.5 rounded-md border border-[#2DE2E6] shadow-[0_0_10px_rgba(45,226,230,0.2)]">
                  <Trophy className="h-3 w-3 mr-1 inline" /> Lvl {guild.level}
                </span>
              </CardTitle>
              <div className="flex items-center gap-1 text-sm text-[#2DE2E6]">
                <Users className="h-4 w-4" /> 
                <span>{guild.members}/{guild.maxMembers}</span>
              </div>
            </div>
            <p className="text-sm text-[#E0F2FF]/70 line-clamp-2 mt-1">{guild.description}</p>
          </CardHeader>

          {/* Content */}
          <CardContent className="px-4 pt-3">
            <div className="mb-3">
              <GuildProgressBar currentXp={guild.xp} maxXp={guild.nextLevelXp} />
            </div>
            <div className="flex justify-between items-center text-sm text-[#E0F2FF]/70 mb-4">
              <div className="flex items-center gap-1">
                <Crown className="h-3.5 w-3.5 text-[#FF2E97]" />
                <span>{guild.leader}</span>
              </div>
              <div className="bg-[#261D54] text-[#2DE2E6] px-2 py-0.5 rounded-md border border-[#2DE2E6]/50">
                {guild.focus}
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full bg-[#141622] text-[#2DE2E6] border-2 border-[#2DE2E6] hover:bg-[#261D54] hover:text-[#FF2E97] hover:border-[#FF2E97] shadow-[0_0_10px_rgba(45,226,230,0.2)] hover:shadow-[0_0_15px_rgba(255,46,151,0.3)] transition-all duration-300"
              onClick={() => onViewGuild(guild.id)}
            >
              View Guild
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
          <div 
            className="h-24 w-full bg-cover bg-center" 
            style={{ backgroundImage: `url(${guild.banner || '/placeholder.svg'})` }}
          />
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl flex items-center gap-2">
                {guild.name}
                <span className="text-sm bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center">
                  <Trophy className="h-3 w-3 mr-1" /> Lvl {guild.level}
                </span>
              </CardTitle>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Users className="h-4 w-4" /> 
                <span>{guild.members}/{guild.maxMembers}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{guild.description}</p>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <GuildProgressBar currentXp={guild.xp} maxXp={guild.nextLevelXp} />
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Crown className="h-3.5 w-3.5 text-amber-500" />
                <span>{guild.leader}</span>
              </div>
              <div className="bg-gray-100 px-2 py-0.5 rounded-full">
                {guild.focus}
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onViewGuild(guild.id)}
            >
              View Guild
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default GuildCard;
