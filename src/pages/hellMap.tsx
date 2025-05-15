import React, { useRef, useEffect } from 'react';
import Phaser from 'phaser';

// Design resolution for static scaling
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

// 1️⃣ Subclass Phaser.Scene and add horizontal drag state
class HellScene extends Phaser.Scene {
  private isDragging = false;
  private dragStartX = 0;
  private startCamX = 0;

  constructor() {
    super({ key: 'HellScene' });
  }

  preload() {
    // Load background layers
    this.load.image('background',    '/assets/phaser/hell-map/campaign_map_background.png');
    this.load.image('background-mid', '/assets/phaser/hell-map/campaign_map_mid.png');
    this.load.image('background-fore','/assets/phaser/hell-map/campaign_map_foreground.png');
    // Load characters & frame
    this.load.image('character1', '/assets/phaser/f6313571193a34c69bf86bd5f7534400/preview.png');
    this.load.image('character2', '/assets/phaser/e197b7adebadb41cc9fa48e9315dec30/preview.png');
    this.load.image('character3', '/assets/phaser/e2b11d76254d44099902f08f8a982d07/preview.png');
    this.load.image('character4', '/assets/phaser/da86e4638545e49c5a35ad42727549bd/preview.png');
    this.load.image('character5', '/assets/phaser/c41606eb9567047c282de7b58c1c6de1/preview.png');
    this.load.image('character6', '/assets/phaser/c5e4c547daf78478ba0a36f68660ff02/preview.png');
    this.load.image('frame1',     '/assets/phaser/c6807ce6f6d314f58b70d530034dd87b/location-marker.png');
  }

  create() {
    // 1️⃣ Background scaled to design height
    const bg = this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0.5)
      .setDepth(-1);
    const scale = DESIGN_HEIGHT / bg.height;
    bg.setScale(scale);

    // 2️⃣ Parallax middleground & foreground
    this.add.image(0, 0, 'background-mid')
      .setOrigin(0, 0)
      .setDepth(0)
      .setScrollFactor(1)
      .setScale(scale);

    this.add.image(0, 0, 'background-fore')
      .setOrigin(0, 0)
      .setDepth(1)
      .setScrollFactor(1)
      .setScale(scale);

    // 3️⃣ World & camera bounds
    const worldWidth  = bg.width * scale;
    const worldHeight = DESIGN_HEIGHT;
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // 4️⃣ Characters & frames
    const characterKeys = [
      'character1','character2','character3',
      'character4','character5','character6'
    ];
    const framePositions: { x: number; y: number; enable: boolean}[] = [
      { x: 250,  y: 450, enable: true }, //1
      { x: 1200, y: 300, enable: true }, 
      { x: 450,  y: 250, enable: true },
      { x: 250,  y: 900, enable: true }, 
      { x: 850,  y: 200, enable: true }, //5
      { x: 850,  y: 575, enable: true },
      { x: 1100, y: 750, enable: true }, 
      { x: 1030, y: 450, enable: true }, 
      { x: 2500, y: 700, enable: true },
      { x: 1700, y: 800, enable: true }, //10
      { x: 1745, y: 550, enable: true}, 
      { x: 100,  y: 650, enable: true}, 
      { x: 1400, y: 400, enable: true},
      { x: 2050, y: 700, enable: true}, 
      { x: 1400, y: 850, enable: true}, //15
      { x: 1600, y: 350, enable: true},
      { x: 1900, y: 400, enable: true}, 
      { x: 2300, y: 520, enable: true}, 
      { x: 2700, y: 400, enable: true},
      { x: 2750, y: 850, enable: true} //20
    ];

    framePositions.forEach(({ x, y, enable}, idx) => {
      if(enable){
        const container = this.add.container(x, y).setDepth(2);
        const charKey = Phaser.Utils.Array.GetRandom(characterKeys);

        // Character
        const character = this.add.image(0, -15, charKey)
          .setScale(0.8 * scale);
        container.add(character);

        // Frame
        const frame = this.add.image(0, 0, 'frame1')
          .setScale(0.6 * scale)
          .setInteractive({ cursor: 'pointer' })
          .on('pointerdown', () =>
            console.log(`Clicked on frame ${idx+1} at (${x}, ${y})`)
          );
        container.add(frame);

        // Label
        const label = this.add.text(
          0,
          frame.displayHeight / 2 + 10,
          `Quest – ${idx+1}`,
          {
            fontSize: `${18*scale}px`,
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: { x: 6, y: 4 },
          }
        ).setOrigin(0.5, 0);
        container.add(label);

        // Tween
        this.tweens.add({
          targets: container,
          y:       y - 10,
          ease:    'Sine.easeInOut',
          duration:1000,
          yoyo:    true,
          repeat:  -1,
        });
      }
    });

    // 5️⃣ Horizontal drag to pan
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.isDragging  = true;
      this.dragStartX  = p.x;
      this.startCamX   = this.cameras.main.scrollX;
    });
    this.input.on('pointerup',   () => { this.isDragging = false; });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!this.isDragging) return;
      this.cameras.main.scrollX = Phaser.Math.Clamp(
        this.startCamX - (p.x - this.dragStartX),
        0,
        worldWidth - this.cameras.main.width
      );
    });
  
    // 6️⃣ Wheel-to-Pan
    this.input.on(
      'wheel',
      (_ptr: Phaser.Input.Pointer, _objs: any, _dx: number, dy: number) => {
        this.cameras.main.scrollX = Phaser.Math.Clamp(
          this.cameras.main.scrollX + dy,
          0,
          worldWidth - this.cameras.main.width
        );
      }
)


  }
}

// 5️⃣ React wrapper using FIT scaling for static map
export const HellMap: React.FC = () => {
  const phaserRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!phaserRef.current) return

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: phaserRef.current,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DESIGN_WIDTH,
        height: DESIGN_HEIGHT,
      },
      physics: {
        default: 'arcade',
        arcade: { gravity: { x: 0, y: 0 } }
      },
      scene: HellScene
    })

    return () => game.destroy(true)
  }, [])

  // Maintain 16:9 aspect ratio using padding hack
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: `${(DESIGN_HEIGHT / DESIGN_WIDTH) * 100}%`,
        overflow: 'hidden',
      }}
    >
      <div
        ref={phaserRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />
    </div>
  )
}

export default HellMap;
