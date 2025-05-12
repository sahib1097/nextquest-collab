import React, { useRef, useEffect } from 'react';
import Phaser from 'phaser';

class TownScene extends Phaser.Scene {
  private isDragging = false;
  private dragStartX = 0;
  private startCamX = 0;

  constructor() {
    super({ key: 'TownScene' });
  }

  preload(): void {
    // Layers
    this.load.image('bg', '/assets/phaser/town-map/background.png');
    this.load.image('fg', '/assets/phaser/town-map/background-mid.png');
    // Frame + Characters
    this.load.image(
      'frame1',
      '/assets/phaser/c6807ce6f6d314f58b70d530034dd87b/location-marker.png'
    );
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

  create(): void {
    const cam = this.cameras.main;
    const H = cam.height;

    // Source sizes
    const imgBg = this.textures.get('bg').getSourceImage() as HTMLImageElement;
    const imgFg = this.textures.get('fg').getSourceImage() as HTMLImageElement;

    // Scale so height fills viewport
    const scaleBg = H / imgBg.height;
    const scaleFg = H / imgFg.height;

    // Scaled widths
    const Wbg = imgBg.width * scaleBg;
    const Wfg = imgFg.width * scaleFg;
    const worldWidth = Math.max(Wbg, Wfg);

    // Add layers
    this.add
      .image(0, 0, 'bg')
      .setOrigin(0)
      .setDepth(0)
      .setScrollFactor(0.7)
      .setScale(scaleBg);

    this.add
      .image(0, 0, 'fg')
      .setOrigin(0)
      .setDepth(1)
      .setScale(scaleFg);

    // World bounds (lock vertical, allow horizontal)
    cam.setBounds(0, 0, worldWidth, H);
    this.physics.world.setBounds(0, 0, worldWidth, H);

    // ── Characters & Floating Frames ──
    const characterKeys: string[] = [
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
      const charKey = Phaser.Utils.Array.GetRandom(characterKeys);
      const container = this.add.container(x, y).setDepth(2);

      const character = this.add.image(0, 0, charKey).setScale(0.6);
      const frame = this.add
        .image(0, 8, 'frame1')
        .setScale(0.45)
        .setInteractive({ cursor: 'pointer' })
        .on('pointerdown', () =>
          console.log(`Clicked on frame ${idx + 1} at (${x}, ${y})`)
        );
      const label = this.add
        .text(
          0,
          frame.displayHeight / 2 + 8,
          `Quest – ${idx + 1}`,
          {
            fontSize: '16px',
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: { x: 6, y: 2 },
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
    this.input.on('pointerup', () => (this.isDragging = false));
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!this.isDragging) return;
      const dx = p.x - this.dragStartX;
      cam.scrollX = Phaser.Math.Clamp(
        this.startCamX - dx,
        0,
        worldWidth - cam.width
      );
    });
    this.input.on(
      'wheel',
      (_ptr: Phaser.Input.Pointer, _objs: any, _dx: number, dy: number) => {
        cam.scrollX = Phaser.Math.Clamp(
          cam.scrollX + dy,
          0,
          worldWidth - cam.width
        );
      }
    );
  }
}

const TownMap: React.FC = () => {
  const phaserRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: phaserRef.current!,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: { gravity: {
            y: 0,
            x: 0
        } },
      },
      scene: TownScene,
    };

    const game = new Phaser.Game(config);
    return () => game.destroy(true);
  }, []);

  return (
    <div
      ref={phaserRef}
      style={{ width: '100%', height: '80vh', overflow: 'hidden' }}
    />
  );
};

export default TownMap;
