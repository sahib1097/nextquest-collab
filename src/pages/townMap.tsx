import React, { useRef, useEffect } from 'react';
import Phaser from 'phaser';
import {retrieveProjects} from '@/utils/projectLogger';

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

    // Fetch projects for quest frames
    const user = JSON.parse(localStorage.getItem('fluxUser') || '{}');
    const teamId = user.teamId;
    console.log("Team ID: ", teamId[0]);
    
    const loadProjects = async () => {
      try {
        const fetchedProjects = await retrieveProjects(teamId[0]);
        if (fetchedProjects) {
          return fetchedProjects;
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        return [];
      }
    };
    
    const framePositions: { x: number; y: number; enable : boolean }[] = [
      { x: 250,   y: 250, enable: false}, //1
      { x: 300,   y: 900, enable: false},
      { x: 550,   y: 450, enable: false},
      { x: 700,   y: 800, enable: false},
      { x: 1100,  y: 650, enable: false}, //5
      { x: 1450,  y: 800, enable: false},
      { x: 1900,  y: 850, enable: false},
      { x: 2200,  y: 600, enable: false},
      { x: 2500,  y: 575, enable: false},
      { x: 2780,  y: 550, enable: false}, //10
      { x: 3000,  y: 400, enable: false},
      { x: 3300,  y: 800, enable: false},
      { x: 275,   y: 525, enable: false},
      { x: 1500,  y: 500, enable: false},
      { x: 1800,  y: 500, enable: false}, //15
      { x: 2225,  y: 850, enable: false},
      { x: 2450,  y: 875, enable: false},
      { x: 950,   y: 200, enable: false},
      { x: 1000,  y: 900, enable: false},
      { x: 3160,  y: 550, enable: false}, //20
    ];
      
    loadProjects().then(fetchedProjects => {
      // Get all tasks from all projects
      const allTasks = fetchedProjects?.reduce((acc, project) => {
        const tasksWithProject = (project.tasks || []).map(task => ({
          ...task,
          projectName: project.name || 'Unknown Project',
          projectId: project.id
        }));
        return acc.concat(tasksWithProject);
      }, []);

      // Enable frames based on number of tasks
      const taskCount = allTasks?.length || 0;
      console.log('Total tasks:', taskCount);
      
      for (let i = 0; i < taskCount && i < framePositions.length; i++) {
        framePositions[i].enable = true;
      }
      
      // Create frames and characters
      framePositions.forEach(({ x, y, enable }, idx) => {
        if (enable && allTasks[idx]) {
          const charKey = Phaser.Utils.Array.GetRandom(characters);
          const container = this.add.container(x, y).setDepth(2);

          const task = allTasks[idx];
          const taskName = task.title || `Task ${idx + 1}`;
          const truncatedTaskName = taskName.length > 10 ? `${taskName.substring(0, 10)}...` : taskName;
          const questLabel = `${task.projectName} - ${truncatedTaskName}`;

          const character = this.add.image(0, -15, charKey).setScale(0.8*scale);
          const frame = this.add.image(0, 0, 'frame1').setScale(0.6*scale)
            .setInteractive({ cursor: 'pointer' })
            .on('pointerdown', () => {
              const projectUrl = `http://localhost:8080/admin/projects/${task.projectId}`;
              console.log(`Navigating to: ${projectUrl}`);
              window.location.href = projectUrl;
            });
          const label = this.add.text(
              0,
              frame.displayHeight / 2 + 10,
              questLabel,
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
        }
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

export const TownMap: React.FC<TownMapProps> = () => {
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
      scene: TownScene
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

export default TownMap;
