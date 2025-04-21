
import React from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/Landing/HeroSection";
import KeyFeatures from "@/components/Landing/KeyFeatures";
import HowItWorksSection from "@/components/Landing/HowItWorksSection";
import PricingSection from "@/components/Landing/PricingSection";
import TestimonialsSection from "@/components/Landing/TestimonialsSection";
import FinalCTA from "@/components/Landing/FinalCTA";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <NavBar />
      <main>
        <HeroSection />
        <section className="py-16 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent"
            >
              The World's First MMOWPG
              <span className="block text-xl md:text-2xl mt-2 text-gray-300">
                (Massively Multiplayer Online Work-Playing Game!)
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-300 max-w-3xl mx-auto"
            >
              Keep your tasks strictly to your team, or let your staff create a guild with members from other companies. Don't worry - tasks are always hidden from other companies!
            </motion.p>
          </div>
        </section>
        <section id="features">
          <KeyFeatures />
        </section>
        <HowItWorksSection />
        <section id="pricing">
          <PricingSection />
        </section>
        <TestimonialsSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
