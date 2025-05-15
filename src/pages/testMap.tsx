import React, { useRef, useEffect } from 'react'
import Phaser from 'phaser'

const DESIGN_WIDTH  = 1920
const DESIGN_HEIGHT = 1080

interface TestMapProps {
  width?: string | number
  height?: string | number
}

class TestScene extends Phaser.Scene {
  private isDragging = false
  private dragStartX = 0
  private startCamX = 0

  constructor() {
    super({ key: 'TestScene' })
  }

  preload() {
    this.load.image('background',    '/assets/phaser/6bb25211af052438abadba4168b38faf/preview.png')
    this.load.image('frame1',        '/assets/phaser/c6807ce6f6d314f58b70d530034dd87b/preview.png')
    this.load.image('mountain-pin',  '/assets/phaser/6bb25211af052438abadba4168b38faf/preview-back.png')
    this.load.image('mountain-pin2', '/assets/phaser/ed628ce2c541949c99f4b1e045ebe644/preview.png')
    this.load.image('character1',    '/assets/phaser/f6313571193a34c69bf86bd5f7534400/preview.png')
    this.load.image('character2',    '/assets/phaser/e197b7adebadb41cc9fa48e9315dec30/preview.png')
    this.load.image('character3',    '/assets/phaser/e2b11d76254d44099902f08f8a982d07/preview.png')
    this.load.image('character4',    '/assets/phaser/da86e4638545e49c5a35ad42727549bd/preview.png')
    this.load.image('character5',    '/assets/phaser/c41606eb9567047c282de7b58c1c6de1/preview.png')
    this.load.image('character6',    '/assets/phaser/c5e4c547daf78478ba0a36f68660ff02/preview.png')
    this.load.image('landmark1',     '/assets/phaser/0f2cb881a84ee44509761fcf4225021d/preview.png')
  }

  create() {
    const bg = this.add.image(0, 0, 'background').setOrigin(0, 0).setScrollFactor(1)
    const scale = DESIGN_HEIGHT / bg.height
    bg.setScale(scale)

    const worldWidth = bg.width * scale
    const worldHeight = DESIGN_HEIGHT
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight)
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight)

    const characterContainers: Phaser.GameObjects.Container[] = []
    const landmarkContainers: Phaser.GameObjects.Container[] = [];

    let landmarkContainer: Phaser.GameObjects.Container | null = null


    this.add.image(0, 0, 'mountain-pin')
      .setOrigin(0, 0)
      .setDepth(-1)
      .setScrollFactor(0.2)

    this.add.image(1250, 740, 'mountain-pin2')
      .setOrigin(0, 0)
      .setScale(0.5 * scale)
      .setDepth(0)
      .setScrollFactor(1)

    const characters = [
      'character1','character2','character3',
      'character4','character5','character6'
    ]

    const framePositions = [
      { x: 300, y: 500 }, { x: 700, y: 400 }, { x: 1100, y: 500 },
      { x: 1450, y: 600 }, { x: 1900, y: 700 }, { x: 2150, y: 800 },
      { x: 2500, y: 900 }, { x: 2800, y: 650 }, { x: 3100, y: 450 },
      { x: 3350, y: 350 }, { x: 500, y: 750 }, { x: 900, y: 850 },
      { x: 1250, y: 750 }, { x: 1650, y: 850 }, { x: 2000, y: 350 },
      { x: 2350, y: 450 }, { x: 2600, y: 550 }, { x: 3050, y: 750 },
      { x: 3350, y: 850 }, { x: 3600, y: 600 }
    ]

    const landmarkPositions = [
        {x: 2000, y: 500},
        {x: 1000, y: 500},
        {x: 2500, y: 500}
    ]

    const numUsers = framePositions.length
    console.log('Number of users:', numUsers)


    landmarkPositions.forEach(({ x, y }, idx) => {
        const saved = localStorage.getItem(`landmark-${idx}`)
        const pos = saved ? JSON.parse(saved) : { x, y }
      
        const container = this.add.container(pos.x, pos.y).setDepth(2)
        container.setSize(300, 300) // Size required for draggable hitbox
        container.setInteractive({ draggable: true })

        landmarkContainers.push(container);
        (container as any).linkedCharacters = new Set<Phaser.GameObjects.Container>();

        if (idx === 0) {
            landmarkContainer = container
          }
      
        const landmarkimg = this.add.image(0, -15, 'landmark1').setScale(0.8 * scale)

      
        const label = this.add.text(
          0,
          landmarkimg.displayHeight / 2 + 10,
          `Landmark – ${idx + 1}`,
          {
            fontSize: `${18 * scale}px`,
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: { x: 6, y: 4 },
          }
        ).setOrigin(0.5, 0)
      
        container.add([landmarkimg, label])
      
        // Bounce tween — store reference to stop it later

      
        // Enable dragging on the container
        this.input.setDraggable(container)

        container.on('dragstart', () => {
            // Example: stop any bounce tween here if you have one
          })
    
      
        container.on('drag', (_pointer: any, dragX: number, dragY: number) => {
          container.x = dragX
          container.y = dragY
        })
      
        container.on('dragend', () => {
          localStorage.setItem(`landmark-${idx}`, JSON.stringify({ x: container.x, y: container.y }))
        })
      })


    framePositions.forEach(({ x, y }, idx) => {
        const saved = localStorage.getItem(`quest-${idx}`)
        const pos = saved ? JSON.parse(saved) : { x, y }
      
        const charKey = Phaser.Utils.Array.GetRandom(characters)
        const container = this.add.container(pos.x, pos.y).setDepth(2)
        container.setSize(100, 100) // Size required for draggable hitbox
        container.setInteractive({ draggable: true })

        characterContainers.push(container)
      
        const character = this.add.image(0, -15, charKey).setScale(0.8 * scale)
        const frame = this.add.image(0, 0, 'frame1').setScale(0.6 * scale)
      
        const label = this.add.text(
          0,
          frame.displayHeight / 2 + 10,
          `Quest – ${idx + 1}`,
          {
            fontSize: `${18 * scale}px`,
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: { x: 6, y: 4 },
          }
        ).setOrigin(0.5, 0)
      
        container.add([character, frame, label])
      
        // Bounce tween — store reference to stop it later
        const bounceTween = this.tweens.add({
          targets: container,
          y: container.y - 10,
          ease: 'Sine.easeInOut',
          duration: 1000,
          yoyo: true,
          repeat: -1
        })
      
        // Enable dragging on the container
        this.input.setDraggable(container)
      
        container.on('dragstart', () => {
          bounceTween.stop() // Prevent tween from interfering
        })
      
        container.on('drag', (_pointer: any, dragX: number, dragY: number) => {
          container.x = dragX
          container.y = dragY
        })
      
        container.on('dragend', () => {
          localStorage.setItem(`quest-${idx}`, JSON.stringify({ x: container.x, y: container.y }))
        })
      })


    if (!landmarkContainer) return; // safety

    (landmarkContainer as any).linkedCharacters = new Set<Phaser.GameObjects.Container>();

    const LINK_RANGE = 250;  // <-- Adjust this number to control range (in pixels)

    const isWithinRange = (c1: Phaser.GameObjects.Container, c2: Phaser.GameObjects.Container) => {
        const dx = c1.x - c2.x;
        const dy = c1.y - c2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist <= LINK_RANGE;
    };


    const updateLinkForCharacter = (charContainer: Phaser.GameObjects.Container) => {
        const linkedChars = (landmarkContainer as any).linkedCharacters;
        if (isWithinRange(charContainer, landmarkContainer)) {
          if (!linkedChars.has(charContainer)) {
            linkedChars.add(charContainer);
            console.log('Character linked to landmark');
          }
        } else {
          if (linkedChars.has(charContainer)) {
            linkedChars.delete(charContainer);
            console.log('Character unlinked from landmark');
          }
        }
        updateLines();
      };
      
      
    const graphics = this.add.graphics();
    graphics.setDepth(1); // beneath containers but above background

    const updateLines = () => {
        graphics.clear();
        graphics.lineStyle(2, 0xffd700, 0.9); // Gold lines
      
        if (!landmarkContainer) return;
      
        const linkedChars: Set<Phaser.GameObjects.Container> = (landmarkContainer as any).linkedCharacters;
      
        linkedChars.forEach(char => {
          graphics.beginPath();
          graphics.moveTo(landmarkContainer.x, landmarkContainer.y);
          graphics.lineTo(char.x, char.y);
          graphics.strokePath();
        });
      };

    // Call this once at start:
    updateLines();

    // Then call again whenever things move:
    [landmarkContainer, ...characterContainers].forEach(container => {
    container.on('drag', updateLines);
    container.on('dragend', updateLines);
    });

    this.events.on('update', updateLines)

    characterContainers.forEach(container => {
        container.on('drag', (_pointer: any, dragX: number, dragY: number) => {
            container.x = dragX;
            container.y = dragY;
            updateLinkForCharacter(container);
        });
        
        container.on('dragend', () => {
            localStorage.setItem(`quest-${characterContainers.indexOf(container)}`, JSON.stringify({ x: container.x, y: container.y }));
            updateLinkForCharacter(container); // final check on drag end
        });
        
        // Also check once on start so initial links can be detected (optional)
        updateLinkForCharacter(container);
        });

    // Horizontal drag (camera)
    // this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
    //   this.isDragging = true
    //   this.dragStartX = p.x
    //   this.startCamX = this.cameras.main.scrollX
    // })
    // this.input.on('pointerup', () => this.isDragging = false)
    // this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
    //   if (!this.isDragging) return
    //   this.cameras.main.scrollX = Phaser.Math.Clamp(
    //     this.startCamX - (p.x - this.dragStartX),
    //     0,
    //     worldWidth - this.cameras.main.width
    //   )
    // })

    // Scroll wheel to pan
    this.input.on('wheel', (_ptr, _objs, _dx, dy) => {
      this.cameras.main.scrollX = Phaser.Math.Clamp(
        this.cameras.main.scrollX + dy,
        0,
        worldWidth - this.cameras.main.width
      )
    })
  }
}

export const TestMap: React.FC<TestMapProps> = () => {
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
      scene: TestScene
    })

    return () => game.destroy(true)
  }, [])

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

export default TestMap
