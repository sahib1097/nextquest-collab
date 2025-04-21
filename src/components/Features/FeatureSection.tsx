
import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureSectionProps {
  title: string;
  description: string;
  features: {
    title: string;
    description: string;
    icon?: LucideIcon;
  }[];
  icon: LucideIcon;
  reversed?: boolean;
}

const FeatureSection = ({ title, description, features, icon: Icon, reversed = false }: FeatureSectionProps) => {
  return (
    <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 py-16 items-center`}>
      <motion.div 
        initial={{ opacity: 0, x: reversed ? 20 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/3 flex justify-center"
      >
        <div className="p-8 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
          <Icon size={120} className="text-yellow-500" />
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: reversed ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-2/3 space-y-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-300 text-lg mb-8">{description}</p>
        
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800/70 transition-colors"
            >
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FeatureSection;
