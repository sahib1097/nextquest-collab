
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-amber-900 py-20 md:py-28">
      <div className="container px-4 mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Turn Tasks into <span className="text-yellow-400">Quests</span>.
              <br />
              Conquer Your To-Dos Like a Hero!
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              Ditch boring checklists. NextQuest transforms your work, chores, and goals into thrilling adventures. 
              Earn rewards, unlock achievements, and level up your productivity!
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold group"
              >
                Start Your Free Adventure
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-900/80 to-amber-900/80 rounded-xl p-6 backdrop-blur-sm border border-yellow-500/20">
              <div className="space-y-4">
                <div className="h-3 bg-yellow-500/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="h-full bg-yellow-500 rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-semibold">Quest Progress</span>
                  <span className="text-white">75%</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-black/30 p-4 rounded-lg border border-yellow-500/10">
                    <Sparkles className="w-6 h-6 text-yellow-400 mb-2" />
                    <div className="h-2 bg-yellow-500/20 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 bg-yellow-500/20 rounded-full p-8 backdrop-blur-sm" />
            <div className="absolute -bottom-6 -left-6 bg-yellow-600/20 rounded-full p-6 backdrop-blur-sm" />
          </motion.div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default HeroSection;
