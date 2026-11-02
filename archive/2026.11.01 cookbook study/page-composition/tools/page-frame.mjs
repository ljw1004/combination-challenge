// Place intact generated paintings within the page's native SVG composition.
// The three approved previews bypass this framing. Source PNGs stay unchanged.
export function pageFrame(ground, offset = 0) {
  if (!offset) return `<image href="${ground}" width="390" height="844" preserveAspectRatio="xMidYMin slice"/>`;
  const fadeStart = 620 + offset - 40;
  const fadeEnd = 620 + offset;
  return `<defs>
    <pattern id="fieldTexture" width="390" height="350" patternUnits="userSpaceOnUse"><image href="${ground}" y="-200" width="390" height="844" preserveAspectRatio="xMidYMin slice"/></pattern>
    <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="white"/><stop offset="0.50" stop-color="white"/><stop offset="0.67" stop-color="black"/><stop offset="1" stop-color="black"/></linearGradient>
    <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="844" gradientUnits="userSpaceOnUse"><stop offset="${fadeStart/844}" stop-color="black"/><stop offset="${fadeEnd/844}" stop-color="white"/></linearGradient>
    <mask id="topMask"><rect width="390" height="844" fill="url(#topFade)"/></mask>
    <mask id="bottomMask"><rect width="390" height="844" fill="url(#bottomFade)"/></mask>
  </defs>
  <rect width="390" height="844" fill="url(#fieldTexture)"/>
  <image href="${ground}" width="390" height="844" preserveAspectRatio="xMidYMin slice" mask="url(#topMask)"/>
  <g mask="url(#bottomMask)"><image href="${ground}" y="${offset}" width="390" height="844" preserveAspectRatio="xMidYMin slice"/></g>`;
}
