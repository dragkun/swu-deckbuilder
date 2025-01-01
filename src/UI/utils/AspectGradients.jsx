const AspectGradients = {
  Command: { start: '#41ad49', end: '#41ad49' },
  Aggression: { start: '#d2232a', end: '#d2232a' },
  Cunning: { start: '#fdb933', end: '#fdb933' },
  Heroism: { start: '#c6c1a0', end: '#c6c1a0' },
  Vigilance: { start: '#6694ce', end: '#6694ce' },
  Villainy: { start: '#040004', end: '#040004' },
  'Command/Heroism': { start: '#41ad49', end: '#c6c1a0' },
  'Command/Villainy': { start: '#41ad49', end: '#040004' },
  'Aggression/Heroism': { start: '#d2232a', end: '#c6c1a0' },
  'Aggression/Villainy': { start: '#d2232a', end: '#040004' },
  'Cunning/Heroism': { start: '#fdb933', end: '#c6c1a0' },
  'Cunning/Villainy': { start: '#fdb933', end: '#040004' },
  'Vigilance/Heroism': { start: '#6694ce', middle: '#FFFFFF', end: '#c6c1a0', strokeWidth: '3px' },
  'Vigilance/Villainy': { start: '#6694ce', middle: '#000000', end: '#040004', strokeWidth: '3px' },
  'Command/Command': { start: '#41ad49', end: '#41ad49' },
  'Aggression/Aggression': { start: '#d2232a', end: '#d2232a' },
  'Cunning/Cunning': { start: '#fdb933', end: '#fdb933' },
  'Vigilance/Vigilance': { start: '#6694ce', end: '#6694ce' }
}

const patterns = {
  'Command': { primary: '#41ad49', secondary: '#41ad49' },
  'Aggression': { primary: '#d2232a', secondary: '#d2232a' },
  'Cunning': { primary: '#fdb933', secondary: '#fdb933' },
  'Vigilance': { primary: '#6694ce', secondary: '#6694ce' },
  'Heroism': { primary: '#c6c1a0', secondary: '#c6c1a0' },
  'Villainy': { primary: '#040004', secondary: '#040004' },
  'Command/Heroism': { primary: '#41ad49', secondary: '#c6c1a0' },
  'Command/Villainy': { primary: '#41ad49', secondary: '#040004' },
  'Aggression/Heroism': { primary: '#d2232a', secondary: '#c6c1a0' },
  'Aggression/Villainy': { primary: '#d2232a', secondary: '#040004' },
  'Cunning/Heroism': { primary: '#fdb933', secondary: '#c6c1a0' },
  'Cunning/Villainy': { primary: '#fdb933', secondary: '#040004' },
  'Vigilance/Heroism': { primary: '#6694ce', secondary: '#c6c1a0' },
  'Vigilance/Villainy': { primary: '#6694ce', secondary: '#040004' },
  'Command/Command': { primary: '#41ad49', secondary: '#308238' },
  'Aggression/Aggression': { primary: '#d2232a', secondary: '#a91e22' },
  'Cunning/Cunning': { primary: '#fdb933', secondary: '#f7b51a' },
  'Vigilance/Vigilance': { primary: '#6694ce', secondary: '#4A7CCF' },
  'Colorless': { primary: '#808080', secondary: '#808080' }
};

export default AspectGradients;
export { patterns };