export const levels = [
    // Tutorial Level 1: Basic Movement
    {
      tutorial: {
        messages: [
          { text: "Use A/D or Arrow Keys to move left and right", position: { x: 100, y: 200 } }
        ]
      },
      platforms: [
        { width: 400, bottom: 20, left: 200 }
      ],
      goalPosition: { bottom: 60, right: 50 },
      playerStart: { x: 50, y: 50 }
    },
    // Tutorial Level 2: Jumping
    {
      tutorial: {
        messages: [
          { text: "Press SPACE or UP to jump!", position: { x: 100, y: 200 } },
          { text: "Try jumping to reach the next platform", position: { x: 300, y: 250 } }
        ]
      },
      platforms: [
        { width: 200, bottom: 20, left: 50 },
        { width: 200, bottom: 120, left: 350 }
      ],
      goalPosition: { bottom: 160, right: 50 },
      playerStart: { x: 50, y: 50 }
    },
    // Tutorial Level 3: Power-ups
    {
      tutorial: {
        messages: [
          { text: "Collect power-ups for special abilities!", position: { x: 250, y: 200 } },
          { text: "Yellow: Speed Boost", position: { x: 300, y: 150 } }
        ]
      },
      platforms: [
        { width: 200, bottom: 20, left: 50 },
        { width: 200, bottom: 150, left: 250 }
      ],
      powerups: [
        { type: 'speed', bottom: 200, left: 300 }
      ],
      goalPosition: { bottom: 190, right: 50 },
      playerStart: { x: 50, y: 50 }
    },
    // Tutorial Level 4: Moving Platforms
    {
      tutorial: {
        messages: [
          { text: "Watch out for moving platforms!", position: { x: 250, y: 250 } }
        ]
      },
      platforms: [
        { width: 200, bottom: 20, left: 50 },
        { width: 200, bottom: 150, left: 250, moving: true }
      ],
      goalPosition: { bottom: 190, right: 50 },
      playerStart: { x: 50, y: 50 }
    },
    // Modified first 8 levels with powerups
    {
      platforms: [
        { width: 200, bottom: 20, left: 50 },
        { width: 200, bottom: 150, left: 250 },
        { width: 200, bottom: 280, left: 450 }
      ],
      powerups: [
        { type: 'speed', bottom: 200, left: 300 }
      ],
      goalPosition: { bottom: 320, right: 50 },
      playerStart: { x: 50, y: 50 }
    },
    {
      platforms: [
        { width: 150, bottom: 20, left: 50 },
        { width: 150, bottom: 120, left: 300 },
        { width: 150, bottom: 220, left: 550 }
      ],
      powerups: [
        { type: 'jump', bottom: 150, left: 400 }
      ],
      goalPosition: { bottom: 260, right: 50 },
      playerStart: { x: 50, y: 50 }
    },
    {
      platforms: [
        { width: 150, bottom: 20, left: 50 },
        { width: 150, bottom: 150, left: 250, moving: true },
        { width: 150, bottom: 280, left: 450 }
      ],
      powerups: [
        { type: 'size', bottom: 250, left: 300 }
      ],
      goalPosition: { bottom: 320, right: 50 },
      playerStart: { x: 50, y: 50 }
    },
    {
      platforms: [
        { width: 100, bottom: 20, left: 50 },
        { width: 100, bottom: 120, left: 200, moving: true },
        { width: 100, bottom: 220, left: 400 },
        { width: 100, bottom: 320, left: 600 }
      ],
      powerups: [
        { type: 'jump', bottom: 200, left: 500 }
      ],
      goalPosition: { bottom: 360, right: 50 },
      playerStart: { x: 50, y: 50 }
    },
    // Zigzag Challenge
    {
      platforms: [
        { width: 100, bottom: 20, left: 50 },
        { width: 100, bottom: 100, left: 200 },
        { width: 100, bottom: 180, left: 50 },
        { width: 100, bottom: 260, left: 200 }
      ],
      powerups: [
        { type: 'speed', bottom: 220, left: 100 }
      ],
      goalPosition: { bottom: 300, right: 50 },
      playerStart: { x: 50, y: 50 }
    },
    // Moving Platform Maze
    {
      platforms: [
        { width: 100, bottom: 20, left: 50 },
        { width: 150, bottom: 120, left: 200, moving: true },
        { width: 150, bottom: 220, left: 400, moving: true },
        { width: 100, bottom: 320, left: 600 }
      ],
      powerups: [
        { type: 'size', bottom: 280, left: 300 }
      ],
      goalPosition: { bottom: 360, right: 50 },
      playerStart: { x: 50, y: 50 }
    },
    // Vertical Challenge
    {
      platforms: [
        { width: 100, bottom: 20, left: 50 },
        { width: 80, bottom: 100, left: 200 },
        { width: 80, bottom: 180, left: 50 },
        { width: 80, bottom: 260, left: 200 },
        { width: 80, bottom: 340, left: 50 }
      ],
      powerups: [
        { type: 'jump', bottom: 240, left: 150 }
      ],
      goalPosition: { bottom: 380, right: 50 },
      playerStart: { x: 50, y: 50 }
    },
    // Moving Platform Symphony
    {
      platforms: [
        { width: 100, bottom: 20, left: 50 },
        { width: 120, bottom: 120, left: 200, moving: true },
        { width: 120, bottom: 220, left: 400, moving: true },
        { width: 120, bottom: 320, left: 600, moving: true }
      ],
      powerups: [
        { type: 'speed', bottom: 300, left: 250 }
      ],
      goalPosition: { bottom: 360, right: 50 },
      playerStart: { x: 50, y: 50 }
    }
  ];
  
  // Modify the generateAdditionalLevels function
  const generateAdditionalLevels = () => {
    const additionalLevels = [];
    
    for (let i = 8; i < 54; i++) {
      const baseLevel = levels[i % 8];
      const newLevel = JSON.parse(JSON.stringify(baseLevel));
      const difficultyModifier = Math.floor(i / 8);
      
      // Modify platforms
      newLevel.platforms = newLevel.platforms.map(platform => ({
        ...platform,
        width: Math.max(50, platform.width - (difficultyModifier * 10)),
        moving: platform.moving || Math.random() < (i / 54)
      }));
      
      // Add powerups
      newLevel.powerups = [];
      const powerupTypes = ['speed', 'jump', 'size'];
      
      // Add 1-3 powerups based on level number
      const numPowerups = 1 + Math.floor(Math.random() * 3);
      for (let j = 0; j < numPowerups; j++) {
        newLevel.powerups.push({
          type: powerupTypes[Math.floor(Math.random() * powerupTypes.length)],
          bottom: 100 + Math.random() * 250,
          left: 100 + Math.random() * 600
        });
      }
      
      // Add additional platforms for higher levels
      if (i > 20) {
        newLevel.platforms.push({
          width: 80,
          bottom: 200 + (i % 100),
          left: 300 + (i % 200),
          moving: i > 30
        });
      }
      
      // Adjust goal position
      newLevel.goalPosition = {
        bottom: Math.min(380, baseLevel.goalPosition.bottom + (difficultyModifier * 20)),
        right: baseLevel.goalPosition.right
      };
      
      additionalLevels.push(newLevel);
    }
    
    return additionalLevels;
  };
  
  // Add the additional levels to the main levels array
  levels.push(...generateAdditionalLevels());