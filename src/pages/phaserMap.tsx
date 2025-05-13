import React, { useRef, useEffect } from 'react'
import Phaser from 'phaser'

const DESIGN_WIDTH  = 1920
const DESIGN_HEIGHT = 1080

interface PhaserMapProps {
  width?: string | number
  height?: string | number
}

class PhaserScene extends Phaser.Scene {
  private isDragging  = false
  private dragStartX  = 0
  private startCamX   = 0

  constructor() {
    super({ key: 'PhaserScene' })
  }

  preload() {
    this.load.image('background',    '/assets/phaser/6bb25211af052438abadba4168b38faf/preview.png')
    this.load.image('frame1',        '/assets/phaser/c6807ce6f6d314f58b70d530034dd87b/preview.png')
    this.load.image('mountain-pin',  '/assets/phaser/6bb25211af052438abadba4168b38faf/preview-back.png')
    this.load.image('mountain-pin2', '/assets/phaser/ed628ce2c541949c99f4b1e045ebe644/preview.png')
    this.load.image('cloud1',        '/assets/phaser/c9c9105953fdb412a9bd078cc80725bf/preview.png')
    this.load.image('character1',    '/assets/phaser/f6313571193a34c69bf86bd5f7534400/preview.png')
    this.load.image('character2',    '/assets/phaser/e197b7adebadb41cc9fa48e9315dec30/preview.png')
    this.load.image('character3',    '/assets/phaser/e2b11d76254d44099902f08f8a982d07/preview.png')
    this.load.image('character4',    '/assets/phaser/da86e4638545e49c5a35ad42727549bd/preview.png')
    this.load.image('character5',    '/assets/phaser/c41606eb9567047c282de7b58c1c6de1/preview.png')
    this.load.image('character6',    '/assets/phaser/c5e4c547daf78478ba0a36f68660ff02/preview.png')
  }

  create() {
    const bg = this.add.image(0, 0, 'background').setOrigin(0, 0)
    const scale = DESIGN_HEIGHT / bg.height
    const cam = this.cameras.main;
    //const scale = cam.height / DESIGN_HEIGHT;
    bg.setScale(scale)

    

    // 2️⃣ World bounds
    const worldWidth  = bg.width * scale
    const worldHeight = DESIGN_HEIGHT
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight)
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight)

    // 3️⃣ Parallax underlay
    this.add.image(0, 0, 'mountain-pin')
      .setOrigin(0, 0)
      .setDepth(-1)
      .setScrollFactor(0.2)

    // 4️⃣ Overlay pins/clouds
    this.add.image(1250, 740, 'mountain-pin2')
      .setOrigin(0, 0)
      .setScale(0.5*scale)
      .setDepth(0)
      .setScrollFactor(1)

    this.add.image(1930, 350, 'cloud1')
      .setOrigin(0, 0)
      .setScale(0.2*scale)
      .setDepth(1)
      .setScrollFactor(1)

    // 5️⃣ Bouncing frames (20 quests, y ≤ 400 except quest5 & quest7)
    const characters = [
      'character1','character2','character3',
      'character4','character5','character6'
    ]
    
    const framePositions = [
      // Quest 1–4 (y ≤ 400)
      { x: 300,  y: 700 },
      { x: 450,  y: 850 },
      { x: 600,  y: 750 },
      { x: 750,  y: 680 },

      // Quest 5 (static original spot: y=530)
      { x:1100, y: 530 },

      { x:1200, y: 780 },
      { x:1380, y: 650 },

      // Quest 7 (static original spot: y=400)
      { x:1900, y: 400 },

      // Quest 8–20 (y ≤ 400)
      { x:1700, y: 620 },
      { x:2000, y: 760 },
      { x:2180, y: 690 },
      { x:2360, y: 590 },
      { x:2550, y: 500 },
      { x:2700, y: 550 },
      { x:2980, y: 700 },
      { x:3120, y: 630 },
      { x:3270, y: 720 },
      { x:3400, y: 560 },
      { x:3550, y: 790 },
      { x:3700, y: 600 }
    ]

    const numUsers = framePositions.length
    console.log('Number of users:', numUsers)

    framePositions.forEach(({ x, y }, idx) => {
      const charKey = Phaser.Utils.Array.GetRandom(characters)
      const container = this.add.container(x, y).setDepth(2)

      const character = this.add.image(0, -15, charKey).setScale(0.8*scale)
      const frame     = this.add.image(0, 0, 'frame1').setScale(0.6*scale)
        .setInteractive({ cursor: 'pointer' })
        .on('pointerdown', () =>
          console.log(`Clicked Quest ${idx+1} at (${x},${y})`)
        );
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
      ).setOrigin(0.5, 0)

      container.add([character, frame, label])

      this.tweens.add({
        targets: container,
        y:       y - 10,
        ease:    'Sine.easeInOut',
        duration:1000,
        yoyo:    true,
        repeat:  -1
      })
    })

    // 6️⃣ Horizontal drag
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.isDragging = true
      this.dragStartX = p.x
      this.startCamX  = this.cameras.main.scrollX
    })
    this.input.on('pointerup',   () => this.isDragging = false)
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!this.isDragging) return
      this.cameras.main.scrollX = Phaser.Math.Clamp(
        this.startCamX - (p.x - this.dragStartX),
        0,
        worldWidth - this.cameras.main.width
      )
    })

    // 7️⃣ Wheel-to-Pan
    this.input.on(
      'wheel',
      (_ptr: Phaser.Input.Pointer, _objs: any, _dx: number, dy: number) => {
        this.cameras.main.scrollX = Phaser.Math.Clamp(
          this.cameras.main.scrollX + dy,
          0,
          worldWidth - this.cameras.main.width
        )
      }
    )
  }
}

export const PhaserMap: React.FC<PhaserMapProps> = () => {
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
      scene: PhaserScene
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

export default PhaserMap;