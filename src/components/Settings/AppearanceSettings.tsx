
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Moon, MonitorSmartphone, Sun } from "lucide-react";
import { toast } from "sonner";
import { addActivity } from "@/utils/activityLogger";
import { useTheme } from "@/hooks/use-theme";
import type { Theme } from "@/hooks/use-theme";

const AppearanceSettings = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  // Initialize theme from localStorage or set to 'system' by default
  useEffect(() => {
    const savedTheme = localStorage.getItem("fluxTheme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);
  
  const handleThemeChange = (value: Theme) => {
    setTheme(value);
    
    addActivity({
      type: "theme_changed",
      details: `Changed theme to ${value}`,
      timestamp: new Date().toISOString(),
    });
    
    toast.success(`Theme changed to ${value} mode`);
  };

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how Flux looks and behaves
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Theme</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Current active theme: <span className="font-medium">{resolvedTheme === 'dark' ? 'Dark' : 'Light'}</span> 
              {theme === 'system' && ' (based on system preferences)'}
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <div 
                className={`relative rounded-lg overflow-hidden border-2 transition-all ${theme === 'light' ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-primary/50'}`}
                onClick={() => handleThemeChange('light')}
              >
                <div className="cursor-pointer h-24 bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center gap-2">
                  <Sun className="h-8 w-8 text-amber-500" />
                  <span className="font-medium text-gray-800">Light</span>
                </div>
                {theme === 'light' && (
                  <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              
              <div 
                className={`relative rounded-lg overflow-hidden border-2 transition-all ${theme === 'dark' ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-primary/50'}`}
                onClick={() => handleThemeChange('dark')}
              >
                <div className="cursor-pointer h-24 bg-gradient-to-b from-gray-800 to-gray-950 flex flex-col items-center justify-center gap-2">
                  <Moon className="h-8 w-8 text-blue-400" />
                  <span className="font-medium text-gray-100">Dark</span>
                </div>
                {theme === 'dark' && (
                  <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              
              <div 
                className={`relative rounded-lg overflow-hidden border-2 transition-all ${theme === 'system' ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-primary/50'}`}
                onClick={() => handleThemeChange('system')}
              >
                <div className="cursor-pointer h-24 bg-gradient-to-b from-gray-50 via-white to-gray-800 flex flex-col items-center justify-center gap-2">
                  <MonitorSmartphone className="h-8 w-8 text-purple-500" />
                  <span className="font-medium text-gray-600">System</span>
                </div>
                {theme === 'system' && (
                  <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
