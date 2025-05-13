import React, { useRef, useEffect } from 'react';
import Phaser from 'phaser';

const DESIGN_WIDTH  = 1920
const DESIGN_HEIGHT = 1080

interface TownMapProps {
  width?: string | number
  height?: string | number
}

class TownScene extends Phaser.Scene {
  private isDragging = false;
  private dragStartX = 0;
  private startCamX = 0;

  constructor() {
    super({ key: 'TownScene' });
  }

  preload(){
    this.load.image('background', '/assets/phaser/town-map/background.png');
    this.load.image('city', '/assets/phaser/town-map/background-mid.png');
    this.load.image('frame1', '/assets/phaser/c6807ce6f6d314f58b70d530034dd87b/location-marker.png');
    this.load.image(
      'character1',
      '/assets/phaser/f6313571193a34c69bf86bd5f7534400/preview.png'
    );
    this.load.image(
      'character2',
      '/assets/phaser/e197b7adebadb41cc9fa48e9315dec30/preview.png'
    );
    this.load.image(
      'character3',
      '/assets/phaser/e2b11d76254d44099902f08f8a982d07/preview.png'
    );
    this.load.image(
      'character4',
      '/assets/phaser/da86e4638545e49c5a35ad42727549bd/preview.png'
    );
    this.load.image(
      'character5',
      '/assets/phaser/c41606eb9567047c282de7b58c1c6de1/preview.png'
    );
    this.load.image(
      'character6',
      '/assets/phaser/c5e4c547daf78478ba0a36f68660ff02/preview.png'
    );
  }

  create(){
    const bg = this.add.image(0, 0, 'background').setOrigin(0, 0);
    const scale = DESIGN_HEIGHT / bg.height;
    const cam = this.cameras.main;
    bg.setScale(scale);

    // World bounds
    const worldWidth  = bg.width * scale;
    const worldHeight = DESIGN_HEIGHT;
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // Parallax underlay
    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDepth(-1)
      .setScrollFactor(0.5);

    this.add.image(0, 0, 'city')
      .setOrigin(0, 0)
      .setDepth(0)
      .setScale(0.5 * scale)
      .setScrollFactor(1)

    // // Add layers
    // this.add
    //   .image(0, 0, 'bg')
    //   .setOrigin(0)
    //   .setDepth(0)
    //   .setScrollFactor(0.7)
    //   .setScale(scale);

    // this.add
    //   .image(0, 0, 'city')
    //   .setOrigin(0)
    //   .setDepth(1)
    //   .setScale(scale);


    // ── Characters & Floating Frames ──
    const characters = [
      'character1',
      'character2',
      'character3',
      'character4',
      'character5',
      'character6'
    ];

    const framePositions: { x: number; y: number }[] = [
      { x: 300, y: 450 },
      { x: 400, y: 400 },
      { x: 700, y: 450 },
      { x: 1000, y: 400 },
      { x: 1100, y: 450 },
      { x: 1600, y: 400 },
      { x: 1900, y: 450 },
      { x: 2200, y: 400 },
      { x: 2500, y: 450 },
      { x: 2780, y: 400 },
    ];

    framePositions.forEach(({ x, y }, idx) => {
      const charKey = Phaser.Utils.Array.GetRandom(characters);
      const container = this.add.container(x, y).setDepth(2);

      const character = this.add.image(0, -15, charKey).setScale(0.8*scale);
      const frame = this.add.image(0, 0, 'frame1').setScale(0.6*scale)
        .setInteractive({ cursor: 'pointer' })
        .on('pointerdown', () =>
          console.log(`Clicked on frame ${idx + 1} at (${x}, ${y})`)
        );
      const label = this.add.text(
          0,
          frame.displayHeight / 2 + 10,
          `Quest – ${idx + 1}`,
          {
            fontSize: `${18 * scale}px`,
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: { x: 6, y:4},
          }
        )
        .setOrigin(0.5, 0);

      container.add([character, frame, label]);

      this.tweens.add({
        targets: container,
        y: y - 10,
        ease: 'Sine.easeInOut',
        duration: 1000,
        yoyo: true,
        repeat: -1,
      });
    });

    // ── Drag & Wheel-to-Pan ──
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.isDragging = true;
      this.dragStartX = p.x;
      this.startCamX = cam.scrollX;
    });
    this.input.on('pointerup',   () => this.isDragging = false)
        this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
          if (!this.isDragging) return
          this.cameras.main.scrollX = Phaser.Math.Clamp(
            this.startCamX - (p.x - this.dragStartX),
            0,
            worldWidth - this.cameras.main.width
          )
        })

    this.input.on(
      'wheel',
      (_ptr: Phaser.Input.Pointer, _objs: any, _dx: number, dy: number) => {
        this.cameras.main.scrollX = Phaser.Math.Clamp(
          this.cameras.main.scrollX + dy,
          0,
          worldWidth - this.cameras.main.width
        )
      }
    );
  }
}

export const TownMap: React.FC<TownMapProps> = ({
  width = '100%',
  height = '100%'
}) => {
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
      scene: TownScene,
    })
    return () => game.destroy(true)
  }, [])

  return (
    <div
      ref={phaserRef}
      style={{
        width,
        height,
        overflow: 'hidden'
      }}
    />
  )
}

export default TownMap;