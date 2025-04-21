
import React from "react";
import { ShieldCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuildEmptyStateProps {
  hasSearch: boolean;
  onCreateClick: () => void;
}

const GuildEmptyState = ({ hasSearch, onCreateClick }: GuildEmptyStateProps) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
      <ShieldCheck className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-bold text-gray-700">No Guilds Found</h3>
      <p className="text-gray-500 mt-2 max-w-md">
        {hasSearch ? 'No guilds match your search criteria.' : 'There are no guilds available. Create a new guild to get started!'}
      </p>
      <Button className="mt-4" onClick={onCreateClick}>
        <Plus className="h-4 w-4 mr-2" /> Create Guild
      </Button>
    </div>
  );
};

export default GuildEmptyState;
