import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ScrollText as ScrollTextIcon,
  MapPin, 
  Award as AwardIcon, 
  GitMerge as GitMergeIcon, 
  Link as LinkIcon, 
  Layers as LayersIcon, 
  Headphones as HeadphonesIcon, 
  Badge as BadgeIcon, 
  Focus as FocusIcon, 
  Users as UsersIcon, 
  BarChart as ChartBarIcon, 
  Settings as SettingsIcon, 
  CalendarDays as CalendarDaysIcon, 
  Sparkles as SparklesIcon, 
  Crown as CrownIcon 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const PricingTiers = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  
  const wandererFeatures = [
    {
      title: "Unlimited Quests",
      description: "Break big goals into endless mini-tasks. No cap, no ads, no guilt.",
      icon: <ScrollTextIcon className="w-4 h-4" />
    },
    {
      title: "Personal Roadmap Builder",
      description: "Visualize your progress with a dragon-slaying journey map (complete with checkpoint GIFs).",
      icon: <MapPin className="w-4 h-4" />
    },
    {
      title: "Basic Achievements",
      description: "Unlock badges like Inbox Vanquisher or Weekend Warrior to flex on haters.",
      icon: <AwardIcon className="w-4 h-4" />
    }
  ];

  const proHeroFeatures = [
    {
      title: "Jira Two-Way Sync",
      description: "Turn Jira tickets into quests. Complete a task in NextQuest? It auto-updates in Jira. Bye-bye, busywork.",
      icon: <GitMergeIcon className="w-4 h-4" />
    },
    {
      title: "Custom Integrations",
      description: "Connect to Slack, Trello, or Notion. Even automate rewards (e.g., 'Finish 10 tasks → Unlock 1hr of Netflix').",
      icon: <LinkIcon className="w-4 h-4" />
    },
    {
      title: "Advanced Quest Templates",
      description: "Pre-built templates for Sprint Marathons, Client Boss Battles, or Freelancer Survival Mode.",
      icon: <LayersIcon className="w-4 h-4" />
    },
    {
      title: "Priority Support",
      description: "Skip the line. Get help from our 24/7 'Quest Guardians' (response time: <2 hours).",
      icon: <HeadphonesIcon className="w-4 h-4" />
    },
    {
      title: "Premium Achievements",
      description: "Earn Code Wizard, Meeting Ninja, or Chaos Tamer badges.",
      icon: <BadgeIcon className="w-4 h-4" />
    },
    {
      title: "Focus Mode",
      description: "Block distractions + auto-reply 'BRB slaying dragons' to emails.",
      icon: <FocusIcon className="w-4 h-4" />
    }
  ];

  const guildMasterFeatures = [
    {
      title: "Collaborative Quests",
      description: "Assign roles (Leader, Tank, Bard), track squad progress, and host pizza-party victory screens.",
      icon: <UsersIcon className="w-4 h-4" />
    },
    {
      title: "Team Analytics",
      description: "See who's MVP, who's 'quest AFK,' and automate peer high-fives.",
      icon: <ChartBarIcon className="w-4 h-4" />
    },
    {
      title: "Admin Controls",
      description: "Mute chaotic teammates, set XP caps, and fund team rewards (like a 'No Meetings Friday' loot box).",
      icon: <SettingsIcon className="w-4 h-4" />
    },
    {
      title: "Team Retreat Planner",
      description: "Free annual template with optional 'capture the flag' mode.",
      icon: <CalendarDaysIcon className="w-4 h-4" />
    }
  ];

  const getProPrice = () => {
    return billingCycle === "annual" ? "9" : "12";
  };

  const getGuildPrice = () => {
    return billingCycle === "annual" ? "12" : "15";
  };

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <ToggleGroup 
          type="single" 
          value={billingCycle} 
          onValueChange={(value) => value && setBillingCycle(value as "monthly" | "annual")}
          className="bg-gray-800 rounded-lg"
        >
          <ToggleGroupItem 
            value="monthly" 
            className="px-4 text-white hover:bg-gray-700 data-[state=on]:bg-purple-600 data-[state=on]:text-white"
          >
            Monthly
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="annual" 
            className="px-4 text-white hover:bg-gray-700 data-[state=on]:bg-purple-600 data-[state=on]:text-white"
          >
            Annual (2 months FREE!)
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Wanderer Tier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    🆓 Free Forever
                  </Badge>
                  <h3 className="text-2xl font-bold text-white mb-2">The Wanderer</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-white">$0</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>
                  <p className="text-gray-400 mt-2">
                    For solo heroes who want unlimited quests without the price tag.
                  </p>
                </div>
                <SparklesIcon className="w-8 h-8 text-yellow-400" />
              </div>

              {/* Features List */}
              <div className="space-y-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Quest Features</h4>
                  <ul className="space-y-4">
                    {wandererFeatures.map((feature, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="flex-shrink-0 text-yellow-400">
                          {feature.icon}
                        </div>
                        <div>
                          <p className="text-white font-medium">{feature.title}</p>
                          <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limits Section */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Limits</h4>
                  <p className="text-gray-400">
                    Basic themes only (Starzone, Dark Forest and Cityscape)
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
                Start Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Pro Hero Tier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700 hover:border-purple-600 transition-colors">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge variant="secondary" className="mb-2 bg-purple-200 text-purple-900">
                    🦸 Pro Hero
                  </Badge>
                  <h3 className="text-2xl font-bold text-white mb-2">Go Pro</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-white">${billingCycle === "annual" ? "9" : "12"}</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>
                  <p className="text-gray-300 mt-2">
                    {billingCycle === "annual" ? "Billed annually = 2 months FREE!" : "Monthly billing"} – For pros who mean business (but still love fun).
                  </p>
                </div>
                <SparklesIcon className="w-8 h-8 text-purple-400" />
              </div>

              {/* Features List */}
              <div className="space-y-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Everything in Free, PLUS:</h4>
                  <ul className="space-y-4">
                    {proHeroFeatures.map((feature, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="flex-shrink-0 text-purple-400">
                          {feature.icon}
                        </div>
                        <div>
                          <p className="text-white font-medium">{feature.title}</p>
                          <p className="text-gray-300 text-sm">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Button */}
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold">
                Go Pro <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Guild Master Tier */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-700 to-amber-900 border-amber-600 hover:border-amber-500 transition-colors">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge variant="secondary" className="mb-2 bg-amber-200 text-amber-900">
                    👑 Guild Master
                  </Badge>
                  <h3 className="text-2xl font-bold text-white mb-2">Lead Your Guild</h3>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-white">${billingCycle === "annual" ? "12" : "15"}</span>
                    <span className="text-gray-300 ml-2">/month</span>
                  </div>
                  <p className="text-gray-300 mt-2">
                    {billingCycle === "annual" ? "Billed annually = 2 months FREE!" : "Monthly billing"} – For teams, clans, and chaotic coworking squads.
                  </p>
                </div>
                <CrownIcon className="w-8 h-8 text-amber-400" />
              </div>

              {/* Features List */}
              <div className="space-y-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Everything in Pro Hero, PLUS:</h4>
                  <ul className="space-y-4">
                    {guildMasterFeatures.map((feature, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="flex-shrink-0 text-amber-400">
                          {feature.icon}
                        </div>
                        <div>
                          <p className="text-white font-medium">{feature.title}</p>
                          <p className="text-gray-300 text-sm">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bonus Feature */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Special Bonus</h4>
                  <p className="text-gray-300">
                    Dedicated "Guild Onboarding Specialist" for stress-free setup.
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                Lead Your Guild <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingTiers;
