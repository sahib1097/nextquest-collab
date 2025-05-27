import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";

interface GuildSearchProps {
  searchQuery: string;
  filter: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

const GuildSearch = ({ searchQuery, filter, onSearchChange, onFilterChange }: GuildSearchProps) => {
  const { currentTheme } = useTheme();
  const isMedievalTheme = currentTheme.name === "Medieval";
  const isCyberpunkTheme = currentTheme.name === "Cyberpunk";

  const getInputStyles = () => {
    if (isMedievalTheme) {
      return "bg-[#fff8dc] text-[#3b2e2a] border-4 border-[#a67c52] rounded-4 shadow-[inset_0_0_0_2px_#6b4c32] placeholder:text-[#7b5e43] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4a373]";
    }
    if (isCyberpunkTheme) {
      return "bg-[#141622] text-[#E0F2FF] border-2 border-[#2DE2E6] rounded-lg shadow-[0_0_10px_rgba(45,226,230,0.2)] placeholder:text-[#2DE2E6]/70 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF2E97] focus:border-[#FF2E97]";
    }
    return ""; // Default styles from shadcn/ui
  };

  const getSelectTriggerStyles = () => {
    if (isMedievalTheme) {
      return "bg-[#fff8dc] text-[#3b2e2a] border-4 border-[#a67c52] rounded-2 shadow-[inset_0_0_0_2px_#6b4c32] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4a373]";
    }
    if (isCyberpunkTheme) {
      return "bg-[#141622] text-[#E0F2FF] border-2 border-[#2DE2E6] rounded-lg shadow-[0_0_10px_rgba(45,226,230,0.2)] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF2E97] focus:border-[#FF2E97]";
    }
    return ""; // Default styles from shadcn/ui
  };

  const getSelectContentStyles = () => {
    if (isMedievalTheme) {
      return "bg-[#fdf5e6] border-4 border-[#a67c52] text-[#3b2e2a] rounded-2 shadow-lg";
    }
    if (isCyberpunkTheme) {
      return "bg-[#141622] border-2 border-[#2DE2E6] text-[#E0F2FF] rounded-lg shadow-[0_0_20px_rgba(45,226,230,0.2)]";
    }
    return ""; // Default styles from shadcn/ui
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <Input 
          placeholder="Search guilds..." 
          value={searchQuery} 
          onChange={(e) => onSearchChange(e.target.value)}
          className={getInputStyles()}
        />
      </div>
      <div>
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className={getSelectTriggerStyles()}>
            <SelectValue placeholder="Filter by focus" />
          </SelectTrigger>
          <SelectContent className={getSelectContentStyles()}>
            <SelectItem value="all">All Focuses</SelectItem>
            <SelectItem value="Development">Development</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="Testing">Testing</SelectItem>
            <SelectItem value="DevOps">DevOps</SelectItem>
            <SelectItem value="Project Management">Project Management</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default GuildSearch;
