function svgDataUri(title: string, accent: string, shade: string) {
  const safeTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="g" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${shade}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="900" rx="56" fill="url(#g)" />
      <circle cx="960" cy="180" r="160" fill="rgba(255,255,255,0.14)" />
      <circle cx="220" cy="720" r="220" fill="rgba(255,255,255,0.08)" />
      <text x="96" y="160" fill="white" font-size="34" font-family="Arial, sans-serif" opacity="0.74">EZY SMART SHOP</text>
      <text x="96" y="420" fill="white" font-size="74" font-weight="700" font-family="Arial, sans-serif">${safeTitle}</text>
      <text x="96" y="500" fill="white" font-size="28" font-family="Arial, sans-serif" opacity="0.82">Smart gadget essential</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const catalogImages = {
  nightLight: svgDataUri("Motion Sensor LED Night Light", "#06B6D4", "#0F172A"),
  chargingStation: svgDataUri("3-in-1 Wireless Charging Station", "#22C55E", "#111827"),
  carVacuum: svgDataUri("Portable Car Vacuum Cleaner", "#F97316", "#111827"),
  phoneHolder: svgDataUri("Magnetic Car Phone Holder", "#8B5CF6", "#1F2937"),
  lintRemover: svgDataUri("Electric Lint Remover", "#EC4899", "#0F172A"),
  ledStrip: svgDataUri("RGB LED Light Strip", "#A855F7", "#0F172A"),
  laptopTable: svgDataUri("Foldable Laptop Table", "#14B8A6", "#1E293B"),
  bottle: svgDataUri("Smart Temperature Water Bottle", "#0EA5E9", "#164E63"),
  ringLight: svgDataUri("Selfie Ring Light with Tripod", "#F59E0B", "#1F2937"),
  blender: svgDataUri("Mini Portable Blender", "#10B981", "#064E3B")
};

