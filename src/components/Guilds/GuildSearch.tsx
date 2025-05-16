
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GuildSearchProps {
  searchQuery: string;
  filter: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

const GuildSearch = ({ searchQuery, filter, onSearchChange, onFilterChange }: GuildSearchProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <Input 
          placeholder="Search guilds..." 
          value={searchQuery} 
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#fff8dc] text-[#3b2e2a] border-4 border-[#a67c52] rounded-4 shadow-[inset_0_0_0_2px_#6b4c32] placeholder:text-[#7b5e43] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
        />
      </div>
      <div>
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="bg-[#fff8dc] text-[#3b2e2a] border-4 border-[#a67c52] rounded-2 shadow-[inset_0_0_0_2px_#6b4c32] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4a373]">
            <SelectValue placeholder="Filter by focus" />
          </SelectTrigger>
          <SelectContent className="bg-[#fdf5e6] border-4 border-[#a67c52] text-[#3b2e2a] rounded-2 shadow-lg">
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
