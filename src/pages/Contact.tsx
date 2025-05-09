
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, SendHorizonal, Shield, Scroll, Swords } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  questType: z.enum(["feature", "support", "feedback", "partnership"]),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

const ContactPage = () => {
  const { toast } = useToast();
  const [formLevel, setFormLevel] = useState(1);
  const [xpGained, setXpGained] = useState(0);
  const [previousAddedXp, setPreviousAddedXp] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      questType: "support",
      message: "",
    },
  });

  const advanceLevel = () => {
    const newXp = Math.floor(Math.random() * 50) + 20;
    setXpGained(prev => prev + newXp);
    setPreviousAddedXp(newXp);
    
    toast({
      title: `+${newXp} XP Gained!`,
      description: "You're making progress on your contact quest!",
      variant: "default",
      className: "bg-green-600 text-white",
    });

    if (formLevel < 3) {
      setFormLevel(prev => prev + 1);
    }
  };

  const demoteLevel = () => {
    setXpGained(prev => prev - previousAddedXp);
    setPreviousAddedXp(0);
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
    
    toast({
      title: "Quest Completed!",
      description: "Your message has been sent to the Council of Next Quest!",
      variant: "default",
      className: "bg-yellow-500 text-black font-semibold",
    });

    // Show final XP reward
    const finalXp = Math.floor(Math.random() * 100) + 50;
    setXpGained(prev => prev + finalXp);

    setTimeout(() => {
      toast({
        title: `+${finalXp} XP Reward!`,
        description: "The council will review your scroll shortly.",
        variant: "default",
        className: "bg-purple-600 text-white font-semibold",
      });
    }, 800);
  };

  const getQuestTypeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Sparkles className="text-blue-400" />;
      case "support":
        return <Shield className="text-red-400" />;
      case "feedback":
        return <Scroll className="text-green-400" />;
      case "partnership":
        return <Swords className="text-yellow-400" />;
      default:
        return <Shield />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavBar />
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Embark on a Contact Quest</h1>
          <p className="text-gray-400 mb-4">Send a scroll to the Next Quest council</p>
          
          <div className="mb-6 flex items-center justify-center">
            <div className="bg-gray-800 h-4 rounded-full w-60 relative">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-300"
                style={{ width: `${(formLevel / 3) * 100}%` }}
              ></div>
            </div>
            <span className="ml-3 text-amber-400 font-medium">Level {formLevel}/3</span>
          </div>

          {xpGained > 0 && (
            <div className="text-center mb-6 flex justify-center items-center gap-2">
              <Sparkles className="text-yellow-400 w-4 h-4" />
              <span className="text-yellow-400 font-semibold">{xpGained} XP Accumulated</span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto"
        >
          <Card className="border border-amber-500/30 bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {formLevel === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="text-center mb-4">
                        <h2 className="text-amber-400 text-xl font-semibold">Adventurer Details</h2>
                        <p className="text-gray-400 text-sm">Who seeks audience with the council?</p>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Your Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Enter your hero name" 
                                className="bg-gray-800 border-gray-700 text-gray-200"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Magic Scroll Address (Email)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="where.to.send@scrolls.com" 
                                className="bg-gray-800 border-gray-700 text-gray-200"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          onClick={() => {
                            if (form.getValues().name && form.getValues().email) {
                              if (form.formState.errors.name || form.formState.errors.email) {
                                return;
                              }
                              advanceLevel();
                            } else {
                              form.trigger(["name", "email"]);
                            }
                          }}
                          className="bg-amber-600 hover:bg-amber-700 text-black"
                        >
                          Continue Quest
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {formLevel === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="text-center mb-4">
                        <h2 className="text-amber-400 text-xl font-semibold">Quest Classification</h2>
                        <p className="text-gray-400 text-sm">What kind of quest brings you here?</p>
                      </div>

                      <FormField
                        control={form.control}
                        name="questType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Quest Type</FormLabel>
                            <div className="grid grid-cols-2 gap-3">
                              {["feature", "support", "feedback", "partnership"].map((type) => (
                                <div 
                                  key={type}
                                  onClick={() => field.onChange(type)}
                                  className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition border ${
                                    field.value === type 
                                      ? "border-amber-500 bg-amber-500/20" 
                                      : "border-gray-700 bg-gray-800 hover:bg-gray-700"
                                  }`}
                                >
                                  <div className="mr-3">{getQuestTypeIcon(type)}</div>
                                  <span className="capitalize text-gray-200">{type}</span>
                                </div>
                              ))}
                            </div>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setFormLevel(1)
                            demoteLevel();
                          }}
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={() => advanceLevel()}
                          className="bg-amber-600 hover:bg-amber-700 text-black"
                        >
                          Continue Quest
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {formLevel === 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="text-center mb-4">
                        <h2 className="text-amber-400 text-xl font-semibold">Your Quest Details</h2>
                        <p className="text-gray-400 text-sm">Share the chronicles of your journey</p>
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Your Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Describe your quest in detail..." 
                                className="bg-gray-800 border-gray-700 text-gray-200 min-h-[120px]"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setFormLevel(2)
                            demoteLevel();
                          }}
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="bg-yellow-500 hover:bg-yellow-600 text-black flex items-center"
                          onClick ={() => setFormLevel(1)}
                        >
                          <SendHorizonal className="mr-2 h-4 w-4" />
                          Complete Quest
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
