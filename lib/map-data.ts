// Accurate, high-detail SVG landmass silhouettes for global finance map
// Projection window: viewBox="0 0 520 340"
// Projection: Equirectangular / Robinson style centered on Eurasia

export const WORLD_PATHS = {
  // NORTH AMERICA & SOUTH AMERICA
  americas: [
    // North America (Canada, US, Mexico)
    "M 15,25 C 22,18 35,15 52,18 C 65,20 78,28 85,42 C 78,50 72,58 65,65 C 55,62 48,68 40,75 C 32,82 28,95 25,110 C 20,118 15,108 12,95 C 10,80 12,65 15,50 Z",
    // South America
    "M 32,130 C 42,132 55,140 62,152 C 68,168 62,185 55,202 C 48,220 42,238 38,255 C 32,250 28,235 28,220 C 26,198 28,175 32,152 Z",
  ],

  // AFRICA & MADAGASCAR
  africa: [
    // Mainland Africa
    "M 112,112 C 125,108 142,106 160,110 C 172,112 185,118 192,130 C 195,142 188,152 178,158 C 170,165 174,178 178,190 C 172,205 162,220 152,235 C 142,248 132,242 128,228 C 125,212 122,195 118,180 C 112,168 104,155 106,138 Z",
    // Madagascar
    "M 198,202 C 202,198 206,208 202,222 C 198,228 194,222 198,202 Z",
  ],

  // EUROPE & BRITISH ISLES
  europe: [
    // Continental Europe (excluding France which is separately detailed)
    "M 118,52 C 125,48 135,42 148,44 C 158,38 168,32 180,35 C 178,48 172,55 165,62 C 158,68 150,65 142,72 C 136,75 128,70 122,78 C 118,72 114,62 118,52 Z",
    // Scandinavia (Norway, Sweden, Finland)
    "M 132,18 C 138,12 148,15 155,22 C 158,32 150,42 142,40 C 138,32 132,25 132,18 Z",
    // British Isles (UK & Ireland)
    "M 106,46 C 112,42 115,50 110,58 C 104,60 102,52 106,46 Z M 98,52 C 102,48 104,54 100,58 C 96,56 96,52 98,52 Z",
    // Iberian Peninsula (Spain & Portugal)
    "M 104,82 C 112,78 118,80 118,90 C 112,98 102,96 100,88 Z",
    // Italian Peninsula
    "M 138,82 C 144,80 148,88 145,98 C 142,102 138,98 138,82 Z",
  ],

  // FRANCE (Highlighted Core European Node)
  france: [
    "M 115,68 C 122,65 128,68 132,74 C 130,82 124,88 118,88 C 112,85 110,76 115,68 Z",
  ],

  // ASIA & MIDDLE EAST
  asia: [
    // Mainland Asia (Russia, China, India, Central Asia, SE Asia)
    "M 180,35 C 210,28 250,22 290,25 C 330,22 370,28 410,25 C 435,32 448,45 435,60 C 420,55 412,65 425,75 C 440,70 455,82 442,95 C 428,92 418,102 432,112 C 445,110 452,122 438,132 C 422,128 412,138 422,148 C 408,145 398,155 405,170 C 415,168 420,180 408,192 C 398,202 388,212 378,208 C 372,192 364,198 352,188 C 348,172 338,170 328,182 C 318,178 310,164 298,162 C 288,170 275,162 268,150 C 254,148 242,156 230,148 C 220,152 212,142 202,146 C 195,136 182,138 180,35 Z",
    // Indian Subcontinent
    "M 270,132 C 282,135 292,148 285,168 C 275,178 268,165 262,150 Z",
    // Southeast Asia & Indochina Peninsula
    "M 355,152 C 368,155 375,170 368,188 C 360,182 352,170 355,152 Z",
    // Korean Peninsula
    "M 418,105 C 424,102 426,115 420,122 C 415,118 414,110 418,105 Z",
    // Japanese Archipelago
    "M 438,98 C 445,92 452,105 448,118 C 442,122 436,110 438,98 Z",
    // Indonesia & Philippines Archipelago
    "M 368,195 C 380,192 395,198 412,195 C 405,202 388,205 368,195 Z M 402,165 C 410,162 412,175 406,182 Z",
  ],

  // HONG KONG & PEARL RIVER DELTA AREA (Highlighted East Asian Node)
  hongkong: [
    "M 382,158 C 388,155 392,160 389,166 C 384,168 380,163 382,158 Z",
  ],

  // OCEANIA / AUSTRALIA & NEW ZEALAND
  oceania: [
    // Australia Mainland
    "M 382,230 C 412,222 442,230 452,248 C 445,268 425,280 398,275 C 380,262 375,245 382,230 Z",
    // New Zealand
    "M 460,268 C 468,262 475,275 468,288 C 462,282 458,272 460,268 Z",
  ],
};
