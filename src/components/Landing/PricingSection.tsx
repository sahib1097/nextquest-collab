
import React from "react";
import { motion } from "framer-motion";
import { Check, Sword, Crown, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const tiers = [
  {
    name: "Free",
    icon: <Scroll className="w-12 h-12" />,
    price: "0",
    description: "Unlimited Tasks, Quests and Roadmaps",
    features: [
      "Create unlimited quests",
      "Personal roadmap",
      "Basic achievements",
      "Core gamification features",
      "Progress tracking"
    ],
    color: "from-blue-500/20 to-blue-600/20",
    textColor: "text-blue-400",
    buttonVariant: "outline" as const
  },
  {
    name: "Pro Hero",
    icon: <Sword className="w-12 h-12" />,
    price: "7",
    description: "2-Way Jira communication and powerful integrations",
    features: [
      "All Free features",
      "Jira two-way sync",
      "Custom integrations",
      "Advanced quest templates",
      "Priority support"
    ],
    color: "from-purple-500/20 to-purple-600/20",
    textColor: "text-purple-400",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    name: "Guild Master",
    icon: <Crown className="w-12 h-12" />,
    price: "15",
    description: "Team analytics, priority support, and pizza-party funding",
    features: [
      "All Pro Hero features",
      "Team analytics dashboard",
      "VIP support",
      "Custom team achievements",
      "Monthly pizza budget"
    ],
    color: "from-yellow-500/20 to-yellow-600/20",
    textColor: "text-yellow-400",
    buttonVariant: "outline" as const
  }
];

const PricingSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Choose Your Adventure Tier
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Pick the perfect plan for your quest. All core features free forever!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              <Card className={`h-full bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors ${tier.popular ? 'border-yellow-500/50' : ''}`}>
                <CardContent className="p-6">
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  )}
                  
                  <div className={`w-20 h-20 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${tier.color}`}>
                    {tier.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    {tier.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">${tier.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  
                  <p className="text-gray-400 mb-6">
                    {tier.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className={`mr-3 h-5 w-5 ${tier.textColor}`} />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={tier.buttonVariant}
                    className={`w-full ${tier.buttonVariant === 'default' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'border-gray-600'}`}
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
