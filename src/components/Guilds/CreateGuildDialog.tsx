
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { guildFormSchema, type GuildFormValues } from "./schema/guildFormSchema";
import { GuildNameStep } from "./steps/GuildNameStep";
import { GuildFocusStep } from "./steps/GuildFocusStep";
import { GuildRolesStep } from "./steps/GuildRolesStep";

interface CreateGuildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGuildCreated: (guild: any) => void;
}

export function CreateGuildDialog({ open, onOpenChange, onGuildCreated }: CreateGuildDialogProps) {
  const [step, setStep] = useState(1);
  
  const form = useForm<GuildFormValues>({
    resolver: zodResolver(guildFormSchema),
    defaultValues: {
      name: "",
      focus: "",
      description: "",
      joiningQuest: "",
      tags: "",
    },
  });

  const onSubmit = (data: GuildFormValues) => {
    const newGuild = {
      id: `g${Date.now()}`,
      name: data.name,
      description: data.description,
      focus: data.focus,
      level: 1,
      xp: 0,
      nextLevelXp: 1000,
      members: 1,
      maxMembers: 10,
      achievements: 0,
      leader: "You",
      banner: "/placeholder.svg"
    };
    
    onGuildCreated(newGuild);
    toast.success("Guild created successfully! You've earned the Founder's Cape badge!");
    form.reset();
    setStep(1);
  };

  const nextStep = () => {
    if (step === 1 && !form.getValues("name")) {
      form.setError("name", { message: "Guild name is required" });
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-500" />
            Create Your Guild
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && <GuildNameStep form={form} />}
              {step === 2 && <GuildFocusStep form={form} />}
              {step === 3 && <GuildRolesStep form={form} />}
            </AnimatePresence>

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  Next
                </Button>
              ) : (
                <Button type="submit" className="ml-auto bg-purple-600 hover:bg-purple-700">
                  Create Guild
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
