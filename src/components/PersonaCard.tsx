
import React from "react";
import { Check } from "lucide-react";

interface PersonaCardProps {
  image: string;
  title: string;
  description: string;
  features: string[];
}

const PersonaCard = ({ image, title, description, features }: PersonaCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={image} 
            alt={title} 
            className="w-16 h-16 rounded-full object-cover"
          />
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{description}</p>
        
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="bg-green-100 p-1 rounded-full text-green-600">
                <Check size={14} />
              </span>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PersonaCard;
