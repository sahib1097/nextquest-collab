
import { Shield, Sword, Crown, Medal, Star, Trophy } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { GuildFormValues } from "../schema/guildFormSchema";

interface GuildNameStepProps {
  form: UseFormReturn<GuildFormValues>;
}

const guildLogos = [
  { icon: <Shield className="h-6 w-6" />, value: "shield" },
  { icon: <Sword className="h-6 w-6" />, value: "sword" },
  { icon: <Crown className="h-6 w-6" />, value: "crown" },
  { icon: <Medal className="h-6 w-6" />, value: "medal" },
  { icon: <Star className="h-6 w-6" />, value: "star" },
  { icon: <Trophy className="h-6 w-6" />, value: "trophy" },
];

export function GuildNameStep({ form }: GuildNameStepProps) {
  const [selectedLogo, setSelectedLogo] = useState<string>(form.getValues("logo") || "");

  const handleLogoSelect = (logo: string) => {
    setSelectedLogo(logo);
    form.setValue("logo", logo);
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Guild Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter a legendary name..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Guild Logo</h4>
        <div className="grid grid-cols-3 gap-2">
          {guildLogos.map((logo, index) => (
            <Button
              key={index}
              type="button"
              variant="outline"
              className={`aspect-square ${selectedLogo === logo.value ? "border-2 border-purple-500 bg-purple-50" : ""}`}
              onClick={() => handleLogoSelect(logo.value)}
            >
              {logo.icon}
            </Button>
          ))}
        </div>
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
}
