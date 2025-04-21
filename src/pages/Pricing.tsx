import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PricingTiers from "@/components/Pricing/PricingTiers";
import PricingFAQ from "@/components/Pricing/PricingFAQ";

const Pricing = () => {
  // SEO Meta Tags
  React.useEffect(() => {
    document.title = "NextQuest Pricing: Free Quests, Pro Integrations & Team Plans for Gamified Productivity";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Unlimited quests for $0? YEP. NextQuest's pricing tiers include Jira sync, custom integrations, and guild tools. Turn productivity into play—no wallet dragons here.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
              ⚡ Choose Your Hero Tier
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              All plans include all our tools, meme-powered reminders, and 10+ fun themes to slay boredom.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          <PricingTiers />
        </div>
      </main>

      {/* Hidden Perks Section */}
      <section className="py-16 bg-gradient-to-br from-purple-900 to-indigo-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-purple-300 to-indigo-400 bg-clip-text text-transparent">
              💎 Hidden Perks
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Yearly Savings</h3>
                <p className="text-gray-300">
                  Get 2 months free with annual billing. Use the cash for actual loot (like coffee).
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Charity Rewards</h3>
                <p className="text-gray-300">
                  Redeem quest coins to plant trees, donate books, or support mental health causes.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Custom Badge Requests</h3>
                <p className="text-gray-300">
                  Pro/Guild users can petition for new achievements (Master of Microwave Meal Prep, anyone?).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing FAQ Section */}
      <PricingFAQ />

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-indigo-400 bg-clip-text text-transparent">
              🎯 Your Productivity Quest Starts Free
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Join heroes who work like they play.
            </p>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3">
              Begin Your Adventure
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
