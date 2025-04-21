
import { useState } from "react";
import { 
  Settings, Map, Compass, 
  Scroll, Castle, Mountain, Palmtree
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type MapStyle = 
  | "parchment" 
  | "woodland" 
  | "dungeon" 
  | "tavern";

interface MapStyleSelectorProps {
  currentStyle: MapStyle;
  onStyleChange: (style: MapStyle) => void;
}

const MapStyleSelector = ({ currentStyle, onStyleChange }: MapStyleSelectorProps) => {
  const mapStyles: Array<{
    value: MapStyle;
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      value: "parchment",
      label: "Ancient Parchment",
      icon: <Scroll className="h-4 w-4 text-amber-700" />,
      description: "Weathered map on aged parchment"
    },
    {
      value: "woodland",
      label: "Enchanted Woods",
      icon: <Palmtree className="h-4 w-4 text-emerald-600" />,
      description: "Mystical forest with glowing elements"
    },
    {
      value: "dungeon",
      label: "Dungeon Depths",
      icon: <Castle className="h-4 w-4 text-stone-500" />,
      description: "Dark stone caverns and passages"
    },
    {
      value: "tavern",
      label: "Tavern Table",
      icon: <Map className="h-4 w-4 text-amber-500" />,
      description: "Wooden table with gaming pieces"
    }
  ];
  
  return (
    <div className="flex items-center">
      {/* For larger screens */}
      <div className="hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              <span>Map Style</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {mapStyles.map((style) => (
              <DropdownMenuItem
                key={style.value}
                onClick={() => onStyleChange(style.value)}
                className={`flex items-center gap-2 ${
                  currentStyle === style.value ? "bg-accent" : ""
                }`}
              >
                {style.icon}
                <div>
                  <div className="font-medium">{style.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {style.description}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* For smaller screens */}
      <div className="md:hidden">
        <Select
          value={currentStyle}
          onValueChange={(value) => onStyleChange(value as MapStyle)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Map Style" />
          </SelectTrigger>
          <SelectContent>
            {mapStyles.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                <div className="flex items-center gap-2">
                  {style.icon}
                  <span>{style.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MapStyleSelector;
