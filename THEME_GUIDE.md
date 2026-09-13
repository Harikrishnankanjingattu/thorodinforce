# THOR Theme Customization Guide

Welcome! The color system for the THOR web application is designed to be completely flexible. You can change the entire site's color scheme in seconds without breaking any layout, animations, or default styling.

---

## 1. How to Change the Color by Hand

To recolor the whole website manually, open [`styles.css`](styles.css) and look at lines 10–18 at the very top under **THEME CONTROL PANEL**:

```css
:root {
  /* 1. MAIN ACCENT: the neon color used for borders, glows, text highlights */
  --accent:          #00f2fe;        /* Type your hex color here (e.g. #39ff14 for neon green) */
  --accent-rgb:      0 242 254;      /* Type the same color as Red Green Blue numbers */

  /* 2. SECOND ACCENT: slightly different shade used in gradients/glows */
  --accent-2:        #00d2ff;        /* Complementary secondary shade */
  --accent-2-rgb:    0 210 255;
}
```

### Steps:
1. Choose any color you like (e.g., Neon Green `#39ff14`).
2. Convert that hex color into three decimal RGB numbers:
   - For `#39ff14`, Red = `57`, Green = `255`, Blue = `20`.
3. Set `--accent: #39ff14;` and `--accent-rgb: 57 255 20;`.
4. Save the file. Every button, border, glow, canvas particle, and text highlight across the entire site instantly updates to your new color!

---

## 2. How the Color Picker Works

1. A floating **THEME** button is anchored at the bottom-left corner of the screen so it never obstructs the conversational guardian widget.
2. Clicking the button opens a Cyber-Neobrutalist control matrix with a native color input, 6 one-click warrior preset swatches, and a Reset button.
3. When you pick or drag a color, JavaScript calculates complementary shades, lightens dark tones for contrast, and updates the CSS custom properties in real time.
4. The canvas lightning storm, particles, and modal templates dynamically read the active theme variables on every animation frame.
5. Your choice is automatically saved to your browser's local storage so it persists when you refresh, and clicking Reset returns the site to its original Electric Blue.

---

## 3. Where Each Token is Used

| CSS Token | Description & Usage Across the Site |
|---|---|
| `--accent` | Primary neon color: borders, active button states, icons, headlines, selection highlight, and glowing outlines. |
| `--accent-rgb` | The red, green, and blue numbers of `--accent`: used for transparent glows, soft badges, and backdrop tints (`rgb(var(--accent-rgb) / 0.15)`). |
| `--accent-2` | Secondary accent shade: subtle color shifts in gradients, secondary lightning arcs, and thunder flash highlights. |
| `--accent-2-rgb` | Transparent versions of the second accent used in multi-stop radial glows and soft atmospheric lighting. |
| `--accent-bright` | High-luminance accent shade: used for intense hover highlights, spark tips, and button click animations. |
| `--accent-deep` | Darker saturated shade: used for deep gradient stops, card drop-shadow glows, and container edges. |
| `--bg-abyss` | Absolute pitch-black foundation (`#000000`) for the deep space / void background. |
| `--bg-primary` & `--bg-secondary` | Deep midnight backgrounds with subtle reactive undertones matching the active theme. |
| `--surface-rgb` & `--surface-2-rgb` | Neobrutalist glass panels and modals: creates semi-transparent dark frosted glass surfaces. |
| `--text-primary` | Crisp white (`#ffffff`) for titles, hero statements, and high-priority labels. |
| `--text-secondary` | Soft pale sky-tinted text (`#b5e2fa`) for readable paragraphs and secondary descriptions. |
| `--text-muted` | Nordic slate grey (`#5e8aa8`) for subtitles, runic captions, and passive timestamps. |
| `--flash-1`, `--flash-2`, `--flash-3` | Multi-phase thunder strobe strobe sequence (white, main accent, and secondary accent). |

---

## 4. Change Report

- **Total Hard-Coded Thematic Instances Replaced**: **203** (119 in `styles.css`, 39 in `index.html`, 45 in `script.js`).
- **Elements Intentionally Left Neutral**:
  - Pure `#000000` (deep void backgrounds).
  - Pure `#ffffff` (crisp white typography).
  - Official Google Brand Colors (`#4285F4`, `#34A853`, `#FBBC05`, `#EA4335`) inside the Google Sign-In SVG icon.
  - Neutral dark greys and standard translucent black scrims (`rgba(0, 0, 0, 0.88)`).
- **Bug Fixes Applied**:
  - **Hero Grid Typo**: Fixed `.hero-grid` camelCase `grid-templateColumns` to valid CSS `grid-template-columns`.
  - **Hero Art Purple Glow**: Fixed off-palette `rgba(157, 78, 221, 0.15)` in `.hero-art-glow` to dynamic `rgb(var(--accent-2-rgb) / 0.15)`, allowing it to harmonize with any chosen theme.
