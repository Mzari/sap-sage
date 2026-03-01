import { createContext, useContext, useState, useEffect } from 'react';

// ─── Dark palette ──────────────────────────────────────────────────────────────
export const DARK = {
  bg:           '#020912',
  bgPanel:      '#050E1C',
  bgCard:       '#081422',
  bgCardHover:  '#0C1A2C',
  bgInput:      '#040C18',
  bgActive:     '#0A1830',
  border:       '#0D1E35',
  borderMid:    '#142840',
  borderBright: '#1E3D60',
  borderHover:  '#264A75',

  cyan:    '#00C8FF',  cyanDim:   '#003D55',
  amber:   '#FF9500',  amberDim:  '#3D2200',
  green:   '#00D68F',  greenDim:  '#003D28',
  red:     '#FF4466',  redDim:    '#3D0015',
  purple:  '#A855F7',  purpleDim: '#2A1060',
  blue:    '#3B82F6',  blueDim:   '#0D2060',
  yellow:  '#F59E0B',  yellowDim: '#3D2800',
  pink:    '#EC4899',  pinkDim:   '#3D0025',
  teal:    '#14B8A6',  tealDim:   '#003D38',

  text:        '#B8CCE0',
  textSub:     '#3D5A78',
  textMute:    '#1A2E46',
  textBright:  '#DCE8F8',
  white:       '#EEF5FF',
  isDark:      true,
};

// ─── Light palette ─────────────────────────────────────────────────────────────
export const LIGHT = {
  bg:           '#EEF2F7',
  bgPanel:      '#E4EAF2',
  bgCard:       '#FFFFFF',
  bgCardHover:  '#F5F8FC',
  bgInput:      '#F0F4F8',
  bgActive:     '#DDE8F4',
  border:       '#CDD8E8',
  borderMid:    '#B4C6DB',
  borderBright: '#8AAAC8',
  borderHover:  '#6090B4',

  cyan:    '#0088BB',  cyanDim:   '#CCE8F4',
  amber:   '#C06000',  amberDim:  '#FFF0DC',
  green:   '#007850',  greenDim:  '#D0F0E4',
  red:     '#CC1133',  redDim:    '#FFE0E6',
  purple:  '#7730CC',  purpleDim: '#EDD8FF',
  blue:    '#1A5ED8',  blueDim:   '#D8E8FF',
  yellow:  '#A06000',  yellowDim: '#FFF4D0',
  pink:    '#C01868',  pinkDim:   '#FFD8ED',
  teal:    '#007068',  tealDim:   '#C8EDE8',

  text:        '#1E3450',
  textSub:     '#4A6A8A',
  textMute:    '#90AABF',
  textBright:  '#0A1828',
  white:       '#0A1828',
  isDark:      false,
};

const ThemeCtx = createContext({ C: DARK, toggleTheme: () => {}, isDark: true });

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('sap-sage-theme') !== 'light'; } catch { return true; }
  });

  const C = isDark ? DARK : LIGHT;

  useEffect(() => {
    try { localStorage.setItem('sap-sage-theme', isDark ? 'dark' : 'light'); } catch {}
    // Apply CSS vars for markdown / global classes
    const root = document.documentElement;
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    root.style.setProperty('--bg',          C.bg);
    root.style.setProperty('--bgCard',      C.bgCard);
    root.style.setProperty('--bgInput',     C.bgInput);
    root.style.setProperty('--border',      C.border);
    root.style.setProperty('--borderMid',   C.borderMid);
    root.style.setProperty('--text',        C.text);
    root.style.setProperty('--textSub',     C.textSub);
    root.style.setProperty('--textMute',    C.textMute);
    root.style.setProperty('--textBright',  C.textBright);
    root.style.setProperty('--white',       C.white);
    root.style.setProperty('--cyan',        C.cyan);
    root.style.setProperty('--green',       C.green);
    root.style.setProperty('--amber',       C.amber);
    root.style.setProperty('--red',         C.red);
    document.body.style.background = C.bg;
  }, [isDark]);

  return (
    <ThemeCtx.Provider value={{ C, isDark, toggleTheme: () => setIsDark(p => !p) }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
