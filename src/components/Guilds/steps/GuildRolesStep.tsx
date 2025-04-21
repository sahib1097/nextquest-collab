
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Sword, Crown, Info } from "lucide-react";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { GuildFormValues } from "../schema/guildFormSchema";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface GuildRolesStepProps {
  form: UseFormReturn<GuildFormValues>;
}

export function GuildRolesStep({ form }: GuildRolesStepProps) {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <FormField
        control={form.control}
        name="joiningQuest"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-1">
              <FormLabel>Joining Quest (Optional)</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">
                      Set a fun task for new members to complete before they can join your guild.
                      Keep it light and related to your guild's theme!
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <Textarea 
                placeholder="Give potential members a fun task to complete..."
                {...field}
                className="resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-6">
        <h4 className="font-medium text-amber-800 mb-2 flex items-center">
          <Shield className="h-4 w-4 mr-1.5 text-amber-600" />
          Default Guild Roles
        </h4>
        
        <div className="space-y-3 text-sm mt-4">
          <RoleCard 
            icon={<Crown className="h-5 w-5 text-amber-600" />}
            role="Guild Leader (You)" 
            permissions={["Full guild management", "Create guild quests", "Manage roles"]}
            isPrimary
          />
          
          <RoleCard 
            icon={<Sword className="h-5 w-5 text-blue-500" />}
            role="Officer" 
            permissions={["Invite new members", "Create guild quests", "Moderate chat"]}
          />
          
          <RoleCard 
            icon={<Shield className="h-5 w-5 text-gray-500" />}
            role="Member" 
            permissions={["Participate in quests", "Chat with members", "View guild analytics"]}
          />
        </div>

        <p className="text-xs text-amber-700 mt-4">
          You can customize roles and permissions after creating your guild.
        </p>
      </div>
    </motion.div>
  );
}

interface RoleCardProps {
  icon: React.ReactNode;
  role: string;
  permissions: string[];
  isPrimary?: boolean;
}

const RoleCard = ({ icon, role, permissions, isPrimary }: RoleCardProps) => {
  return (
    <motion.div 
      className={cn(
        "flex p-2.5 rounded-md border",
        isPrimary 
          ? "border-amber-200 bg-amber-100/50" 
          : "border-gray-200 bg-white"
      )}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-shrink-0 mr-3">{icon}</div>
      <div>
        <h5 className={cn(
          "font-medium",
          isPrimary ? "text-amber-800" : "text-gray-700"
        )}>
          {role}
        </h5>
        <div className="flex flex-wrap gap-2 mt-1">
          {permissions.map((permission, index) => (
            <span 
              key={index}
              className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                isPrimary 
                  ? "bg-amber-200/70 text-amber-800" 
                  : "bg-gray-100 text-gray-700"
              )}
            >
              {permission}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
