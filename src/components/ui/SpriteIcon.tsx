interface SpriteIconProps {
    src: string;
    index: number;
    size: number; // Size of each icon (e.g., 32)
    columns: number; // Number of columns in the sprite sheet
    className?: string;
  }
  
  const SpriteIcon: React.FC<SpriteIconProps> = ({ src, index, size, columns, className }) => {
    const x = (index % columns) * size;
    const y = Math.floor(index / columns) * size;
  
    return (
      <div
        className={`inline-block ${className}`}
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${src})`,
          backgroundPosition: `-${x}px -${y}px`,
          backgroundSize: 'auto',
          imageRendering: 'pixelated',
        }}
      />
    );
  };
  
  export default SpriteIcon;
  