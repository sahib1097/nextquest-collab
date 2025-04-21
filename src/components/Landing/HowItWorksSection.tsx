
import React from "react";
import { motion } from "framer-motion";
import { FileEdit, Target, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: <FileEdit className="w-12 h-12" />,
    title: "Create a Quest",
    description: "Add tasks, set deadlines, and spice it up with GIFs, themes, or custom rewards.",
    color: "from-purple-500/20 to-purple-600/20 text-purple-400"
  },
  {
    icon: <Target className="w-12 h-12" />,
    title: "Complete Challenges",
    description: "Check off tasks to earn XP, unlock loot boxes, and watch your progress bar crush boredom.",
    color: "from-yellow-500/20 to-yellow-600/20 text-yellow-400"
  },
  {
    icon: <Trophy className="w-12 h-12" />,
    title: "Level Up Your Life",
    description: "Redeem coins for coffee, donate to charity, or flex your \"Productivity Legend\" trophy on social media.",
    color: "from-green-500/20 to-green-600/20 text-green-400"
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Your Quest Begins in 3 Easy Steps
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-6">
                  <div className={`w-20 h-20 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${step.color}`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">
                    {step.description}
                  </p>
                  
                  {/* Step connector line for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-gray-700 transform -translate-y-1/2" />
                  )}
                </CardContent>
              </Card>
              
              {/* Step number */}
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
