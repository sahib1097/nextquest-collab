
import React from "react";
import { motion } from "framer-motion";
import { Sword, Trophy, Users, Gamepad } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: <Sword className="w-8 h-8" />,
    title: "Gamified Task Management",
    description: "Break tasks into \"quests\" with XP points, power-ups, and epic storylines. Even \"File Taxes\" feels like slaying a dragon.",
    color: "from-purple-500/20 to-purple-600/20 text-purple-400"
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: "Epic Rewards & Achievements",
    description: "Unlock custom badges, collect coins for real-world perks, and flaunt your progress with shareable victory screens.",
    color: "from-yellow-500/20 to-yellow-600/20 text-yellow-400"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Collaborative Quests",
    description: "Team up for guild missions! Assign roles, track squad progress, and celebrate wins with party animations.",
    color: "from-blue-500/20 to-blue-600/20 text-blue-400"
  },
  {
    icon: <Gamepad className="w-8 h-8" />,
    title: "Play Your Way",
    description: "Choose themes (space pirate? wizard academy?), add memes to tasks, or compete on leaderboards.",
    color: "from-green-500/20 to-green-600/20 text-green-400"
  }
];

const KeyFeatures = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Why NextQuest Makes Productivity an Adventure
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex"
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors flex flex-col w-full">
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className={`w-14 h-14 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 flex-grow">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
