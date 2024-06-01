export interface svgIcon {
  name: string;
  value: string
}

export const helper: svgIcon = {
  name: 'helper',
  value:   
  `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="18" fill="#ccc" />
  <rect x="12" y="10" width="16" height="10" fill="#222" />
  <circle cx="10" cy="15" r="2" fill="#fff" />
  <circle cx="30" cy="15" r="2" fill="#fff" />
  <line x1="15" y1="25" x2="25" y2="25" stroke="#222" stroke-width="2" />
  <rect x="18" y="30" width="4" height="5" fill="#222" />
</svg>`
};

export const industrial: svgIcon = {
  name: 'industrial',
  value:  `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="20" height="20" fill="#999" />
  <circle cx="15" cy="15" r="3" fill="#222" />
  <circle cx="25" cy="15" r="3" fill="#222" />
  <path d="M18 25 L22 30 L28 25 Z" fill="#222" />
  <rect x="15" y="32" width="10" height="3" fill="#ccc" />
</svg>`
};

export const friendlyAI: svgIcon = {
  name: 'friendlyAI',
  value:  `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="18" fill="#ccc" />
  <ellipse cx="15" cy="15" rx="5" ry="7" fill="#222" />
  <ellipse cx="25" cy="15" rx="5" ry="7" fill="#222" />
  <circle cx="20" cy="25" r="2" fill="#000" />
</svg>`
};

export const explorer : svgIcon = {
  name: 'helper',
  value: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="18" fill="#ccc" />
  <rect x="12" y="10" width="4" height="10" fill="#222" />
  <rect x="24" y="10" width="4" height="10" fill="#222" />
  <circle cx="10" cy="15" r="2" fill="#fff" />
  <circle cx="30" cy="15" r="2" fill="#fff" />
  <path d="M25 28 L20 35 L15 28 Z" fill="#f00" />
</svg>`
};

export const catBot: svgIcon = {
  name: 'helper',
  value: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="18" fill="#fff" />
  <circle cx="15" cy="15" r="3" fill="#222" />
  <circle cx="25" cy="15" r="3" fill="#222" />
  <path d="M18 22 L22 28 L13 28 Z" fill="#222" />
  <triangle points="20,32 25,30 15,30" fill="#222" />
</svg>`
};

export const delivery: svgIcon = {
  name: 'helper',
  value:  `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="20" cy="15" rx="10" ry="20" fill="#ccc" />
  <circle cx="15" cy="10" r="3" fill="#222" />
  <circle cx="25" cy="10" r="3" fill="#222" />
  <rect x="12" y="25" width="16" height="5" fill="#999" />
  <circle cx="20" cy="35" r="2" fill="#222" />
</svg>`
};

/*
Icon 6: Bipedal Delivery Droid

Code snippet
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="20" cy="15" rx="10" ry="20" fill="#ccc" />
  <circle cx="15" cy="10" r="3" fill="#222" />
  <circle cx="25" cy="10" r="3" fill="#222" />
  <rect x="12" y="25" width="16" height="5" fill="#999" />
  <circle cx="20" cy="35" r="2" fill="#222" />
</svg>
Use code with caution.
content_copy
Icon 7: Music Bot

Code snippet
<svg viewBox="0 0 40 40" xmlns="http://www.w3.  org/2000/svg">
  <circle cx="20" cy="20" r="18" fill="#ccc" />
  <rect x="12" y="15" width="6" height="10" fill="#222" />
  <rect x="22" y="15" width="6" height="10" fill="#222" />
  <path d="M18 28 L20 32 L22 28 Z" fill="#f00" />
  <path d="M25 22 L23 25 L21 22 Z" fill="#00f" />
</svg>
Use code with caution.
content_copy
Icon 8: Construction Worker Bot

Code snippet
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="20" height="20" fill="#ddd" />
  <circle cx="15" cy="15" r="3" fill="#222" />
  <circle cx="25" cy="15" r="3" fill="#222" />
  <path d="M18 25 L28 25 L23 30 Z" fill="#222" />
  <line x1="18" y1="32" x2="28" y2="32" stroke="#222" stroke-width="2" />
  <circle cx="23" cy="35" r="1" fill="#f00" />
</svg>
Use code with caution.
content_copy
Icon 9: Hovering Drone

Code snippet
<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="15" r="10" fill="#ccc" />
  <circle cx="15" cy="10" r="2" fill="#222" />
  <circle cx="25" cy="10" r="2" fill="#222" />
  <path d="M10 20 L10 30 L20 30 L20 20 Z" fill="#ddd" />
  <path d="M30 20 L30 30 L20 30 L20 20 Z" fill="#ddd" />
  <rect
Use code with caution.

*/

export const list: svgIcon[] = [ helper, industrial, friendlyAI, explorer, catBot ];
