---
name: Threshold
colors:
  surface: '#fff9ee'
  surface-dim: '#e0d9cd'
  surface-bright: '#fff9ee'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf3e6'
  surface-container: '#f4ede0'
  surface-container-high: '#eee7db'
  surface-container-highest: '#e9e2d5'
  on-surface: '#1e1b14'
  on-surface-variant: '#4c463f'
  inverse-surface: '#333028'
  inverse-on-surface: '#f7f0e3'
  outline: '#7d766e'
  outline-variant: '#cec5bc'
  surface-tint: '#635d57'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1f1b16'
  on-primary-container: '#8a837c'
  inverse-primary: '#cec5bd'
  secondary: '#a53c19'
  on-secondary: '#ffffff'
  secondary-container: '#fb7b54'
  on-secondary-container: '#6b1a00'
  tertiary: '#000102'
  on-tertiary: '#ffffff'
  tertiary-container: '#001c3b'
  on-tertiary-container: '#6b85af'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eae1d8'
  primary-fixed-dim: '#cec5bd'
  on-primary-fixed: '#1f1b16'
  on-primary-fixed-variant: '#4b4640'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb59f'
  on-secondary-fixed: '#3a0a00'
  on-secondary-fixed-variant: '#842503'
  tertiary-fixed: '#d5e3ff'
  tertiary-fixed-dim: '#adc8f5'
  on-tertiary-fixed: '#001c3b'
  on-tertiary-fixed-variant: '#2d486d'
  background: '#fff9ee'
  on-background: '#1e1b14'
  surface-variant: '#e9e2d5'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '400'
    lineHeight: '1.1'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.15em
  hindi-body:
    fontFamily: Noto Serif Devanagari
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.7'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  rule-thin: 0.5px
  rule-thick: 1px
---

## Brand & Style

The design system is rooted in the quiet authority of archival records and historical documentation. It evokes the sensory experience of a field researcher’s notebook—tactile, precise, and timeless. The target audience includes historians, researchers, and cultural enthusiasts who value clarity and a sense of "place" over modern digital flash.

The aesthetic follows a **Humanist-Archival** approach, blending the precision of early 20s-century survey documents with the warmth of natural materials. The interface is intentionally flat, eschewing shadows and depth in favor of tonal layering and hairline borders. A subtle 3% opacity paper grain texture is applied globally to the background to break the digital sterility and provide a haptic quality.

## Colors

The palette is derived from natural pigments and aged materials:
- **Paper & Surfaces:** The primary background uses `#F4EDE0` (Aged Paper). UI hierarchy is established through tonal shifts rather than shadows. `Surface-raised` is for interactive or prominent elements, while `Surface-sunken` is used for wells, input backgrounds, or secondary groupings.
- **Primary Ink:** All primary text and functional strokes use `#1F1B16`, a warm, deep charcoal that mimics iron-gall ink.
- **Accents:** Madder Red (`#9A3412`) is used for primary actions and historical highlights. Verdigris Green and Deep Indigo serve as sophisticated tertiary markers for categorization.
- **Status:** Status indicators use desaturated, traditional hues to remain harmonious with the muted background while providing clear semantic signals.

## Typography

Typography is the primary vehicle for the brand’s archival character. 
- **The Serif (Headings):** Use **EB Garamond** (as a high-quality alternative to Cormorant) for all editorial and display moments. It should feel confident, light, and airy.
- **The Sans (Functional UI):** **IBM Plex Sans** provides a neutral, systematic contrast for body copy and navigational elements.
- **The Mono (Metadata):** **IBM Plex Mono** (or JetBrains Mono) is used exclusively for "kicker" labels, metadata, and chips. These are always set in uppercase with generous letter-spacing to mimic typewriter tags.
- **Indic Script:** **Noto Serif Devanagari** is utilized for Hindi text to maintain the elegant, classic feel of printed manuscripts.

## Layout & Spacing

The layout philosophy follows a **Modular Document Grid**. It prioritizes generous inner margins and breathing room to evoke the feel of a broadsheet or a catalog.

- **Grid:** A 12-column fluid grid on desktop with wide 64px external margins. On mobile, transition to a 4-column grid with 16px margins.
- **Rules:** Vertical and horizontal hierarchy is defined by hairline rules (`0.5px` for secondary separation, `1px` for primary container boundaries).
- **Rhythm:** Use a 4px baseline grid. Components should use multiples of 8px for internal padding (e.g., 16px or 24px) to ensure a structured, systematic feel.

## Elevation & Depth

This design system rejects the concept of Z-axis elevation via shadows. Depth is achieved through:
1.  **Tonal layering:** Placing a `surface-raised` card on a `paper` background, or using `surface-sunken` for code blocks or form inputs.
2.  **Hairline Containment:** Sharp 1px borders in `#9A8F7C` define element boundaries.
3.  **Opacity & Stacking:** Overlapping elements should be avoided. When necessary, use hard edges and distinct color blocks to indicate a foreground state.

## Shapes

The shape language is strictly **geometric and sharp**.
- **Corner Radius:** All standard UI elements (buttons, cards, inputs) use a maximum radius of `2px` to prevent a "digital" softness.
- **Interactive Elements:** Buttons and chips are rectangular. Circular elements are reserved only for icons or specific status pips.
- **Diagrams:** Use unrounded, 0.5px ink strokes for all diagrammatic and illustrative UI ornaments.

## Components

- **Cards:** Defined by a 1px border of `#9A8F7C`. Background is either transparent or `surface-raised`. No hover shadows; use a subtle background color shift to `surface-sunken` or a border color change to `primary-text` on interaction.
- **Buttons:** 
  - *Primary:* Filled with `#1F1B16` or `#9A3412`, white or cream text, sharp corners.
  - *Secondary:* 1px border, no fill, monochrome text.
- **Monospace Kickers:** Every major section or card title should be preceded by a small `label-caps` kicker (e.g., "MUSEUM RECORD // 042") to establish the archival context.
- **Input Fields:** Use the `surface-sunken` background with a bottom-only 1px rule. Labels sit above in `label-caps`.
- **Chips/Tags:** Rectangular, thin borders, `IBM Plex Mono` text. Use status colors for the text/border, never as a heavy background fill.
- **State Glyphs:** Use thin-stroke icons. Active states should be indicated by a small, filled "Madder Red" square (2px x 2px) next to the item rather than a complex highlight.