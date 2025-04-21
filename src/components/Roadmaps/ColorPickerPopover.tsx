
import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { SwatchBook, Paintbrush } from 'lucide-react';

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
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div 
          className="w-10 h-10 rounded-md border cursor-pointer transition-all hover:scale-105"
          style={{ background: currentColor }}
          title="Click to change color"
        />
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <Tabs defaultValue="presets">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="presets" className="flex items-center gap-2 w-full">
              <SwatchBook className="h-4 w-4" />
              Presets
            </TabsTrigger>
            <TabsTrigger value="hex" className="flex items-center gap-2 w-full">
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
                  className="w-10 h-10 rounded-md transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring"
                  style={{ background: color }}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="hex" className="mt-0">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  HEX Color
                </label>
                <Input
                  type="text"
                  placeholder="#000000"
                  value={currentColor}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                      onColorChange(value);
                    }
                  }}
                  className="font-mono"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Color Picker
                </label>
                <Input
                  type="color"
                  value={currentColor}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="h-10 w-full cursor-pointer p-0 border-0"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPickerPopover;
