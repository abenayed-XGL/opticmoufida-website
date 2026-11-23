/*
 * Brands shown on the Brands page and on the home page.
 *   name     = brand name
 *   img      = photo in assets/img/brands/ (4:5, 800x1000). Leave out for a text-only card.
 *   cats     = any of "optical", "sun", "kids"
 *   examples = a few model references (optional)
 *   home     = true to feature it on the home page
 * The list is not exhaustive — many more brands and models are in store.
 */
window.BRANDS = [
  { name: "Gucci",          img: "gucci",          cats: ["sun", "optical"], examples: ["GG1254S", "GG1333", "GG1205O"], home: true },
  { name: "Dior",           img: "dior",           cats: ["sun", "optical"], examples: ["GemDior"], home: true },
  { name: "Prada",          img: "prada",          cats: ["sun", "optical"], examples: ["PR 17WS", "PR 06YS"], home: true },
  { name: "Chanel",         img: "chanel",         cats: ["optical", "sun"], examples: [], home: true },
  { name: "Tom Ford",       img: "tom-ford",       cats: ["sun", "optical"], examples: ["79052"], home: true },
  { name: "Fendi",          img: "fendi",          cats: ["sun"],            examples: ["FD03828"], home: true },
  { name: "Ray-Ban",        img: "ray-ban",        cats: ["sun", "optical"], examples: [] },
  { name: "Emporio Armani", img: "emporio-armani", cats: ["optical"],        examples: ["EA4152", "EA4115"] },
  { name: "Lacoste",        img: "lacoste",        cats: ["optical", "sun"], examples: ["L2290"] },
  { name: "David Beckham",  img: "david-beckham",  cats: ["sun", "optical"], examples: ["DB 7007/S", "DB 7044/S"] },
  { name: "Nano Vista",     img: "nano-vista",     cats: ["kids"],           examples: ["Glitch", "Battle Royale", "Love"] },
  { name: "Swing",          img: "swing",          cats: ["kids"],           examples: [] },
  { name: "Cartier",        cats: ["sun", "optical"], examples: ["CT0303S"] },
  { name: "Saint Laurent",  cats: ["sun", "optical"], examples: ["SL 539 Paloma"] },
  { name: "Versace",        cats: ["sun", "optical"], examples: ["VE4361"] },
  { name: "Giorgio Armani", cats: ["optical", "sun"], examples: ["AR7220", "AR6107"] },
  { name: "Jimmy Choo",     cats: ["optical", "sun"], examples: ["JC5006U", "JC3017U"] },
  { name: "Philipp Plein",  cats: ["sun"],            examples: ["SPP012"] },
  { name: "Charriol",       cats: ["optical"],        examples: ["75067"] },
  { name: "Polar",          cats: ["sun", "optical"], examples: ["531", "Clip-On 502"] }
];
