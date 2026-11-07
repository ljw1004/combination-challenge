export const conditionalWorld = `# ![icon](default.svg) A changing world
## Formation
background: ![space](space.svg)
Make a moon and light the world.
**Items**
- \`world\` Rocky world
  - icon: ![world](default.svg)
- \`sun\` Sun
  - icon: ![sun](sun.svg) (center 78px, 548.6px)
- \`asteroid\` Asteroid
  - icon: ![asteroid](asteroid.svg) (center 292.5px, 548.6px)
- \`moon\` Moon
  - icon: ![moon](moon.svg)
- \`light\` Light
  - icon: ![light](light.svg)
- \`remnant\` Remnant
  - icon: ![remnant](remnant.svg)
**Hotspots**
- \`world\` (center 195px, 253.2px)
  - icon: ![before](before.svg)
  - icon after creating \`moon\`: ![after impact](impact.svg)
  - icon after creating \`light\`: ![illuminated](lit.svg) (circular)
**Goals**
- Illuminate -- \`light\`
- Make a remnant -- \`remnant\`
**Combinations**
- \`asteroid\` [consume] @ \`world\` [preserve] -> \`moon\` (tutorial)
- \`sun\` [preserve] @ \`world\` [preserve] -> \`light\`
- \`moon\` [consume] + \`sun\` [preserve] -> \`remnant\`
## Inherited
The same scene.
## Revisited
background: ![space](space.svg)
**Hotspots**
- \`world\` (center 234px, 337.6px)
  - icon: ![another view](revisited.svg)
`;
