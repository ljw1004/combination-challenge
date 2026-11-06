export const conditionalWorld = `# A changing world
## Formation
background: ![space](space.svg)
Make a moon and light the world.
**Items**
- \`world\` Rocky world
  - icon: ![world](default.svg)
- \`sun\` Sun
  - icon: ![sun](sun.svg) (at 20%, 65%)
- \`asteroid\` Asteroid
  - icon: ![asteroid](asteroid.svg) (at 75%, 65%)
- \`moon\` Moon
  - icon: ![moon](moon.svg)
- \`light\` Light
  - icon: ![light](light.svg)
- \`remnant\` Remnant
  - icon: ![remnant](remnant.svg)
**Hotspots**
- \`world\` (at 50%, 30%)
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
- \`world\` (at 60%, 40%)
  - icon: ![another view](revisited.svg)
`;
