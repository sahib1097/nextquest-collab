import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { SwatchBook, Paintbrush } from 'lucide-react';
import { useTheme } from "@/contexts/ThemeContext";

const PRESET_COLORS = [
  '#9b87f5', '#7E69AB', '#F97316', '#0EA5E9', 
  '#D946EF', '#8B5CF6', '#33C3F0', '#1EAEDB',
  '#ea384c', '#0FA0CE', '#6E59A5', '#403E43'
];

interface ColorPickerPopoverProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

const ColorPickerPopover = ({ currentColor, onColorChange }: ColorPickerPopoverProps) => {
  const { currentTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div 
          className="w-10 h-10 rounded-md border cursor-pointer transition-all hover:scale-105"
          style={{ 
            background: currentColor,
            borderColor: currentTheme.colors.border
          }}
          title="Click to change color"
        />
      </PopoverTrigger>
      <PopoverContent 
        className="w-64"
        align="start"
        style={{
          backgroundColor: currentTheme.colors.background,
          borderColor: currentTheme.colors.border
        }}
      >
        <Tabs defaultValue="presets">
          <TabsList 
            className="w-full mb-4"
            style={{
              backgroundColor: currentTheme.colors.secondary,
              borderColor: currentTheme.colors.border
            }}
          >
            <TabsTrigger 
              value="presets" 
              className="flex items-center gap-2 w-full"
              style={{ color: currentTheme.colors.text }}
            >
              <SwatchBook className="h-4 w-4" />
              Presets
            </TabsTrigger>
            <TabsTrigger 
              value="hex" 
              className="flex items-center gap-2 w-full"
              style={{ color: currentTheme.colors.text }}
            >
              <Paintbrush className="h-4 w-4" />
              Custom
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="mt-0">
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => onColorChange(color)}
                  className="w-10 h-10 rounded-md transition-all hover:scale-105 focus:outline-none focus:ring-2"
                  style={{ 
                    background: color,
                    borderColor: currentTheme.colors.border
                  }}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="hex" className="mt-0">
            <div className="space-y-2">
              <Input
                type="color"
                value={currentColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-full h-10"
                style={{
                  backgroundColor: currentTheme.colors.secondary,
                  borderColor: currentTheme.colors.border
                }}
              />
              <Input
                type="text"
                value={currentColor}
                onChange={(e) => onColorChange(e.target.value)}
                placeholder="#000000"
                className="w-full"
                style={{
                  backgroundColor: currentTheme.colors.secondary,
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPickerPopover;
