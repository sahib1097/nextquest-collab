import { motion } from "framer-motion";
import { CityDistrict, CyberBuilding, DistrictType } from "@/types/mapTypes"; // Added DistrictType import
import { useEffect, useState } from "react";
import { generateDistrictBuildings } from "@/utils/mapGenerationUtils";
import { useTheme } from "@/contexts/ThemeContext";

interface CityDistrictsProps {
  districts: CityDistrict[];
  timeOfDay: "day" | "night" | "rain";
}

const CityDistricts = ({ districts, timeOfDay }: CityDistrictsProps) => {
  const [animatedDistricts, setAnimatedDistricts] = useState<CityDistrict[]>([]);
  const [districtBuildings, setDistrictBuildings] = useState<Map<string, CyberBuilding[]>>(new Map());
  const { currentTheme } = useTheme();
  
  // Stagger the appearance of districts for a nice animation effect
  useEffect(() => {
    setAnimatedDistricts([]);
    const buildingsMap = new Map<string, CyberBuilding[]>();
    
    const timer = setTimeout(() => {
      districts.forEach((district, index) => {
        setTimeout(() => {
          setAnimatedDistricts(prev => {
            const buildings = generateDistrictBuildings(district);
            buildingsMap.set(district.id, buildings);
            setDistrictBuildings(new Map(buildingsMap));
            return [...prev, district];
          });
        }, index * 150);
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [districts]);
  
  const getDistrictColor = (type: DistrictType) => {
    switch (type) {
      case "corporate":
        return timeOfDay === "night" ? "from-blue-900 to-cyan-800" : 
               timeOfDay === "rain" ? "from-blue-900 to-cyan-900" :
               "from-blue-800 to-cyan-700";
      case "creative":
        return timeOfDay === "night" ? "from-purple-900 to-fuchsia-800" : 
               timeOfDay === "rain" ? "from-purple-900 to-fuchsia-900" :
               "from-purple-800 to-fuchsia-700";
      case "guild":
        return timeOfDay === "night" ? "from-amber-800 to-yellow-700" : 
               timeOfDay === "rain" ? "from-amber-900 to-yellow-800" :
               "from-amber-800 to-yellow-600";
      default:
        return timeOfDay === "night" ? "from-gray-900 to-gray-800" :
               timeOfDay === "rain" ? "from-gray-900 to-slate-800" :
               "from-gray-800 to-gray-700";
    }
  };
  
  const getWindowColor = (type: DistrictType, active: boolean) => {
    if (!active) return "bg-gray-500/30";
    
    switch (type) {
      case "corporate": return "bg-cyan-400";
      case "creative": return "bg-fuchsia-400";
      case "guild": return "bg-amber-400";
      default: return "bg-blue-300";
    }
  };
  
  const renderBuildings = (district: CityDistrict) => {
    const buildings = districtBuildings.get(district.id) || [];
    
    return buildings.map((building, index) => {
      // Generate windows for the building
      const windows = Array.from({ length: building.windows }).map((_, windowIndex) => {
        // Randomly determine if window is lit
        const isLit = Math.random() > 0.3;
        
        return (
          <div 
            key={`window-${district.id}-${index}-${windowIndex}`}
            className={`absolute w-1.5 h-1.5 ${getWindowColor(district.type, isLit)}`}
            style={{ 
              left: building.width / 2,
              bottom: windowIndex * 8 + 4,
              opacity: isLit ? 0.8 : 0.3
            }}
          />
        );
      });
      
      return (
        <motion.div
          key={`building-${district.id}-${index}`}
          className={`absolute bottom-0 bg-gradient-to-t ${getDistrictColor(district.type)}`}
          style={{ 
            left: building.x + district.width / 2, 
            width: building.width, 
            height: 0,
          }}
          initial={{ height: 0 }}
          animate={{ height: building.height }}
          transition={{ 
            delay: 0.5 + index * 0.1, 
            duration: 0.8,
            ease: "easeOut"
          }}
        >
          {windows}
          
          {/* Building top */}
          <div 
            className="absolute w-full h-2 top-0 left-0"
            style={{ backgroundColor: `rgba(${district.type === "corporate" ? "0, 255, 255" : 
                                              district.type === "creative" ? "255, 0, 255" : 
                                              district.type === "guild" ? "255, 215, 0" : "150, 150, 150"}, 0.5)` 
            }}
          />
          
          {/* Antennas */}
          {building.antennas && (
            <motion.div 
              className="absolute top-0 left-1/2 w-0.5 bg-gray-500"
              style={{ height: 10 + Math.random() * 15, marginLeft: -1 }}
              initial={{ height: 0 }}
              animate={{ height: 10 + Math.random() * 15 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
            >
              <motion.div 
                className="absolute top-0 w-3 h-0.5 bg-red-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.2 }}
              />
            </motion.div>
          )}
        </motion.div>
      );
    });
  };
  
  const renderHolographicDistrictName = (district: CityDistrict) => {
    const color = district.type === "corporate" ? currentTheme.colors.primary : 
                 district.type === "creative" ? currentTheme.colors.accent : 
                 district.type === "guild" ? currentTheme.colors.secondary : 
                 currentTheme.colors.text;
                 
    return (
      <motion.div
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div 
          className="font-bold text-sm mb-1"
          style={{ color }}
        >
          {district.name}
        </div>
        <div 
          className="text-xs"
          style={{ color: `${color}70` }}
        >
          {district.detail}
        </div>
        <motion.div 
          className="h-8 w-0.5 mx-auto"
          style={{ backgroundColor: `${color}50` }}
          initial={{ height: 0 }}
          animate={{ height: 8 }}
          transition={{ delay: 1.2, duration: 0.3 }}
        />
      </motion.div>
    );
  };
  
  const renderDistrictFloor = (district: CityDistrict) => {
    let gridColor = `${currentTheme.colors.primary}15`;
    if (district.type === "creative") gridColor = `${currentTheme.colors.accent}15`;
    if (district.type === "guild") gridColor = `${currentTheme.colors.secondary}15`;
    
    return (
      <div 
        className="absolute bottom-0 left-0 right-0" 
        style={{ 
          height: 1, 
          backgroundImage: `linear-gradient(90deg, ${gridColor} 1px, transparent 1px), 
                          linear-gradient(0deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          width: district.width,
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom',
        }}
      />
    );
  };

  return (
    <div className="absolute inset-0 z-0">
      {animatedDistricts.map((district) => (
        <motion.div
          key={`district-${district.id}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="absolute"
          style={{ 
            left: district.position.x - district.width / 2, 
            top: district.position.y - district.height / 2 
          }}
        >
          {/* District base */}
          <div 
            className="relative rounded-sm"
            style={{ width: district.width, height: district.height }}
          >
            {renderDistrictFloor(district)}
            {renderHolographicDistrictName(district)}
            {renderBuildings(district)}
            
            {/* District glow effect */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-10 opacity-20 blur-lg"
              style={{ 
                background: `radial-gradient(ellipse at center, 
                  ${district.type === "corporate" ? "rgba(0, 255, 255, 0.8)" : 
                    district.type === "creative" ? "rgba(255, 0, 255, 0.8)" : 
                    district.type === "guild" ? "rgba(255, 215, 0, 0.8)" : 
                    "rgba(100, 100, 255, 0.8)"} 0%, 
                  transparent 70%)`
              }}
            />
            
            {/* Holographic projections for each district type */}
            {district.type === "corporate" && (
              <motion.div 
                className="absolute -top-24 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.4, 0.7, 0.4],
                  y: [-5, 0, -5]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 4
                }}
              >
                <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center hologram">
                  <div className="text-cyan-400 font-bold text-xl">C</div>
                </div>
              </motion.div>
            )}
            
            {district.type === "creative" && (
              <motion.div 
                className="absolute -top-20 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.4, 0.7, 0.4],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 8
                }}
              >
                <div className="w-16 h-16 rounded-sm bg-fuchsia-500/10 border border-fuchsia-400/30 flex items-center justify-center hologram">
                  <div className="text-fuchsia-400 font-bold text-xl">∞</div>
                </div>
              </motion.div>
            )}
            
            {district.type === "guild" && (
              <motion.div 
                className="absolute -top-16 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  scale: [0.9, 1.1, 0.9]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3
                }}
              >
                <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/40 flex items-center justify-center hologram"
                     style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                  <div className="text-amber-400 font-bold text-lg">G</div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CityDistricts;
