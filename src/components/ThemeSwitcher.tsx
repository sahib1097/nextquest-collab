import { useTheme } from "@/contexts/ThemeContext";
import { themes } from "@/config/themes";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ThemeSwitcher = () => {
  const { currentTheme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          style={{
            borderColor: currentTheme.colors.border,
            color: currentTheme.colors.text,
            backgroundColor: currentTheme.colors.background
          }}
        >
          <Palette className="h-4 w-4" />
          <span>Theme: {currentTheme.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56"
        style={{
          backgroundColor: currentTheme.colors.background,
          borderColor: currentTheme.colors.border
        }}
      >
        {Object.entries(themes).map(([key, theme]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(key)}
            className="flex items-center gap-2 cursor-pointer hover:bg-opacity-50 transition-colors"
            style={{
              color: currentTheme.colors.text,
              backgroundColor: 'transparent'
            }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: theme.colors.secondary }}
            />
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: theme.colors.accent }}
            />
            <span className="ml-2">{theme.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher; 