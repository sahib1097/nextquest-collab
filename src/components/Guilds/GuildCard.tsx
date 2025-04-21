
import React from "react";
import { motion } from "framer-motion";
import { Crown, Users, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GuildProgressBar } from "./GuildProgressBar";

interface GuildCardProps {
  guild: any;
  onViewGuild: (guildId: string) => void;
}

const GuildCard = ({ guild, onViewGuild }: GuildCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
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
    </motion.div>
  );
};

export default GuildCard;
