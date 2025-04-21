
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
          className="w-full"
        />
      </div>
      <div>
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by focus" />
          </SelectTrigger>
          <SelectContent>
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
