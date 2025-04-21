import React from "react";
import { motion } from "framer-motion";
import { Sword, Trophy, Users, Sparkles, Star, Gift, Gamepad, AlarmClock, CalendarArrowDown, ArrowRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FeatureSection from "@/components/Features/FeatureSection";
import { Button } from "@/components/ui/button";

const Features = () => {
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
              Level Up Your Productivity
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Transform mundane tasks into epic quests. Gain XP, collect rewards, and conquer your goals with features designed for the hero in you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features Content */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          <FeatureSection
            icon={Gamepad}
            title="🎮 Play Your Way"
            description="Customize the Fun"
            features={[
              {
                title: "Theme Store",
                description: "Unlock themes: Space Pirate, Zombie Apocalypse Survival, or Corporate Unicorn. Yes, you can make spreadsheets sparkle."
              },
              {
                title: "Meme Task Mode",
                description: "Add reaction GIFs to tasks, or auto-generate funny task names (\"Defeat the Mighty Laundry Volcano\")."
              },
              {
                title: "Leaderboards & Rivalries",
                description: "Compete with friends for weekly top spots. Loser buys coffee. (Pro tip: Tag your overachiever cousin.)"
              }
            ]}
          />

          <FeatureSection
            icon={Users}
            title="👥 Guild Mode: Team Quests"
            description="Because Even Heroes Need a Squad"
            features={[
              {
                title: "Collaborative Quests",
                description: "Turn team projects into \"guild missions\" with shared progress bars, role assignments (Tank, Healer, DPS… or just \"Excel Guru\"), and squad XP."
              },
              {
                title: "Victory Screens & Trash Talk",
                description: "Celebrate wins with animated confetti + GIF battles. Shame slackers with playful \"motivational\" memes (\"The Dragon Ate Your Report, Dave\")."
              },
              {
                title: "Analytics for Guild Masters",
                description: "Track team productivity stats, MVP rankings, and who's hoarding all the XP."
              }
            ]}
            reversed
          />

          <FeatureSection
            icon={Trophy}
            title="🏰 Level Up Your Life"
            description="Progress That Feels Like a Game"
            features={[
              {
                title: "XP & Skill Trees",
                description: "Earn XP for every task crushed. Allocate points to 'skills' like Boss-Level Focus or Creative Wizardry to unlock perks."
              },
              {
                title: "Badges of Honor",
                description: "Collect achievements: Weekend Warrior, Email Slayer, Dad Joke Champion. Brag about them on LinkedIn (seriously, we dare you)."
              },
              {
                title: "Real-World Rewards",
                description: "Redeem coins for coffee, donate to charity, or an extra day off?!"
              }
            ]}
          />

          <FeatureSection
            icon={Sword}
            title="⚔️ Quest Creation & Customization"
            description="Turn 'Ugh' into 'Let's Go!' with Tools Built for Fun"
            features={[
              {
                title: "Quest Creator 3000™",
                description: "Break goals into bite-sized 'quests' with deadlines, nested tasks, and meme-worthy GIFs. Add custom XP values (because folding laundry = 50XP, right?)."
              },
              {
                title: "Epic Story Mode",
                description: "Assign themes like Cyberpunk Deadline Rush or Medieval Grocery Run. Add plot twists (example: 'If dishes aren't done by 8 PM, the Kitchen Dragon attacks!')."
              },
              {
                title: "Power-Ups & Bonuses",
                description: "Unlock focus timers ('Hyperfocus Potion'), bonus XP for streaks, and loot boxes with surprise rewards (Netflix time, anyone?)."
              }
            ]}
            reversed
          />

          <FeatureSection
            icon={AlarmClock}
            title="🔒 Heroic Tools for Real Life"
            description="No-Fluff Adulting, Promise"
            features={[
              {
                title: "Reminders That Don't Suck",
                description: "Get nudges like \"Quest Alert: A new settlement needs your tasks completed!\""
              },
              {
                title: "Sync with Calendar, 2You, Jira & More",
                description: "Auto-import deadlines, turn 2You messages into mini-quests and make Jira more fun with real-time quest additions."
              }
            ]}
          />
        </div>
      </main>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
              Ready to Transform Tasks into Treasure Hunts?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join heroes in 90+ countries who've made productivity their favorite game.
            </p>
            <Button 
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
