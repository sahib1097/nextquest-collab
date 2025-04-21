
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { GuildFormValues, focusAreas } from "../schema/guildFormSchema";
import { 
  Briefcase, 
  Dumbbell, 
  Paintbrush, 
  Sparkles, 
  GraduationCap, 
  Gamepad2 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GuildFocusStepProps {
  form: UseFormReturn<GuildFormValues>;
}

interface FocusOptionProps {
  value: string;
  label: string;
  icon: JSX.Element;
  description: string;
  isSelected: boolean;
}

const FocusOption = ({ value, label, icon, description, isSelected }: FocusOptionProps) => (
  <Label
    htmlFor={`focus-${value}`}
    className={cn(
      "flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all",
      isSelected 
        ? "border-purple-500 bg-purple-50" 
        : "border-gray-200 hover:border-purple-200"
    )}
  >
    <RadioGroupItem 
      value={value} 
      id={`focus-${value}`} 
      className="mt-1" 
    />
    <div className="ml-3">
      <div className="flex items-center">
        <div className={cn(
          "p-1.5 rounded-full mr-2",
          isSelected ? "bg-purple-100" : "bg-gray-100"
        )}>
          {icon}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-sm text-gray-500 mt-1">{description}</div>
    </div>
  </Label>
);

export function GuildFocusStep({ form }: GuildFocusStepProps) {
  const selectedFocus = form.watch("focus");

  // Focus area descriptions and icons
  const focusOptions = [
    { 
      value: "Work", 
      label: "Work", 
      icon: <Briefcase className="h-4 w-4" />, 
      description: "Project management, teamwork & productivity" 
    },
    { 
      value: "Fitness", 
      label: "Fitness", 
      icon: <Dumbbell className="h-4 w-4" />, 
      description: "Workout challenges & health goals" 
    },
    { 
      value: "Creative", 
      label: "Creative", 
      icon: <Paintbrush className="h-4 w-4" />, 
      description: "Art, writing, music & creative pursuits" 
    },
    { 
      value: "Chaos Crew", 
      label: "Chaos Crew", 
      icon: <Sparkles className="h-4 w-4" />, 
      description: "Fun, random quests & social activities" 
    },
    { 
      value: "Learning", 
      label: "Learning", 
      icon: <GraduationCap className="h-4 w-4" />, 
      description: "Education, skill development & growth" 
    },
    { 
      value: "Gaming", 
      label: "Gaming", 
      icon: <Gamepad2 className="h-4 w-4" />, 
      description: "Gaming challenges & competitions" 
    }
  ];

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <FormField
        control={form.control}
        name="focus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Guild Focus</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2"
              >
                {focusOptions.map((option) => (
                  <FocusOption
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    icon={option.icon}
                    description={option.description}
                    isSelected={field.value === option.value}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Guild Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell potential members what your guild is about..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
            <p className="text-xs text-gray-500 mt-1">
              {field.value?.length || 0}/300 characters
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags (comma-separated)</FormLabel>
            <FormControl>
              <Input 
                placeholder="#RemoteWork, #NightOwls, #CoffeeBrain..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
