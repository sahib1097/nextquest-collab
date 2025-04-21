
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Drone } from "@/types/mapTypes";

interface GamePiecesProps {
  drones: Drone[];
  mapStyle: "parchment" | "woodland" | "dungeon" | "tavern";
}

// Renamed component from Drones to GamePieces
const GamePieces = ({ drones, mapStyle }: GamePiecesProps) => {
  const [activePieces, setActivePieces] = useState<Array<Drone & { currentPathIndex: number }>>([]);
  
  useEffect(() => {
    // Initialize game pieces with their starting positions
    const initializedPieces = drones.map(drone => ({
      ...drone,
      currentPathIndex: 0
    }));
    
    setActivePieces(initializedPieces);
    
    // Update piece positions periodically
    const interval = setInterval(() => {
      setActivePieces(current => 
        current.map(piece => {
          // Move to next path point
          const nextPathIndex = (piece.currentPathIndex + 1) % piece.path.length;
          return {
            ...piece,
            position: piece.path[piece.currentPathIndex],
            currentPathIndex: nextPathIndex
          };
        })
      );
    }, 3000); // Update every 3 seconds for a more deliberate movement
    
    return () => clearInterval(interval);
  }, [drones]);
  
  const getPieceColor = (type: string) => {
    switch (type) {
      case "delivery":
        return "bg-red-600";
      case "patrol":
        return "bg-blue-600";
      case "scanner":
        return "bg-purple-600";
      default:
        return "bg-gray-600";
    }
  };
  
  const getPieceShape = (type: string) => {
    switch (type) {
      case "delivery":
        return "rounded-full"; // circular token
      case "patrol":
        return "rounded"; // square token with rounded corners
      case "scanner":
        return "diamond"; // diamond shape
      default:
        return "triangle"; // triangle
    }
  };

  const getPieceShadow = () => {
    switch (mapStyle) {
      case "parchment":
        return "shadow-amber-800/30";
      case "woodland":
        return "shadow-emerald-800/30";
      case "dungeon":
        return "shadow-stone-900/50";
      case "tavern":
        return "shadow-amber-700/30";
      default:
        return "shadow-gray-800/30";
    }
  };
  
  const renderPieceTrail = (piece: Drone & { currentPathIndex: number }) => {
    // Calculate previous point in path
    const prevIndex = (piece.currentPathIndex + piece.path.length - 1) % piece.path.length;
    const prevPoint = piece.path[prevIndex];
    const currentPoint = piece.position;
    
    if (!prevPoint) return null;
    
    // Dotted line trail based on map style
    const trailStyle = mapStyle === "parchment" ? "border-amber-800/40" :
                       mapStyle === "woodland" ? "border-emerald-600/40" :
                       mapStyle === "dungeon" ? "border-stone-500/40" :
                       "border-amber-700/40";
    
    return (
      <motion.div
        className={`absolute top-0 left-0 h-0.5 border-t border-dashed ${trailStyle}`}
        style={{
          width: Math.sqrt(
            Math.pow(currentPoint.x - prevPoint.x, 2) + 
            Math.pow(currentPoint.y - prevPoint.y, 2)
          ),
          transformOrigin: '0 0',
          transform: `translate(${prevPoint.x}px, ${prevPoint.y}px) 
                     rotate(${Math.atan2(
                       currentPoint.y - prevPoint.y, 
                       currentPoint.x - prevPoint.x
                     )}rad)`,
        }}
        animate={{ opacity: [0.7, 0.3, 0] }}
        transition={{ duration: 3, ease: "easeOut" }}
      />
    );
  };
  
  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      {activePieces.map(piece => (
        <div key={piece.id}>
          {renderPieceTrail(piece)}
          
          <motion.div
            className="absolute"
            style={{ 
              left: piece.position.x, 
              top: piece.position.y,
            }}
            animate={{
              x: piece.path[piece.currentPathIndex].x - piece.position.x,
              y: piece.path[piece.currentPathIndex].y - piece.position.y,
            }}
            transition={{
              duration: 3,
              ease: "easeInOut"
            }}
          >
            {/* Game piece */}
            <motion.div 
              className={`absolute top-0 left-0 ${getPieceColor(piece.type)} w-4 h-4
                ${getPieceShape(piece.type)} shadow-lg ${getPieceShadow()} 
                border border-white/30 -translate-x-1/2 -translate-y-1/2`}
              animate={piece.type === "scanner" ? { 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              } : {
                y: [0, -2, 0, 2, 0]
              }}
              transition={{ 
                duration: piece.type === "scanner" ? 4 : 2, 
                repeat: Infinity 
              }}
            >
              {/* Piece markings */}
              <div className={`absolute inset-0 flex items-center justify-center text-[8px] text-white font-bold`}>
                {piece.type === "delivery" ? "D" : piece.type === "patrol" ? "P" : "S"}
              </div>
            </motion.div>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default GamePieces;
