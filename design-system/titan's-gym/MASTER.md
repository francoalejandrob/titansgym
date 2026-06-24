# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Titan's Gym
**Generated:** 2026-06-21 (overridden manually to match existing brand identity)
**Category:** Fitness/Gym — Premium/Dramatic

**Brand source:** Logo, tarjeta de fidelidad y flyers promocionales existentes (carpeta raíz del proyecto). Paleta NO genérica — refleja la identidad visual ya impresa y publicada en Instagram (@titansgymec).

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable | Uso |
|------|-----|--------------|-----|
| Background | `#0A0A0A` | `--color-background` | Fondo base de toda la app |
| Surface | `#151515` | `--color-surface` | Cards, paneles, navbar |
| Surface Elevated | `#1F1F1F` | `--color-surface-elevated` | Cards hover, modales |
| Primary Accent | `#DC2626` | `--color-primary` | CTAs, links activos, badges |
| Primary Accent Hover | `#EF4444` | `--color-primary-hover` | Hover de CTAs |
| Secondary/Silver | `#A1A1AA` | `--color-secondary` | Detalles, bordes, iconos secundarios |
| Border | `#27272A` | `--color-border` | Bordes sutiles sobre fondo oscuro |
| Text Primary | `#F8FAFC` | `--color-text` | Texto principal |
| Text Muted | `#A1A1AA` | `--color-text-muted` | Texto secundario, subtítulos |
| Success | `#22C55E` | `--color-success` | Confirmaciones, estados activos |

**Color Notes:** Negro profundo + rojo intenso + plata, fiel al logo y material promocional existente (tarjeta de fidelidad, flyers de batido/café/taekwondo). Mismo lenguaje visual que Nike/Equinox: alto contraste, dramatismo, un solo acento de color (rojo) usado con disciplina.

### Typography

- **Heading Font:** Barlow Condensed (700/900, uppercase, tracking ajustado) — impacto tipo "TAEKWONDO" de los flyers
- **Body Font:** Barlow (400/500)
- **Mood:** atlético, potente, condensado, dramático
- **Google Fonts:** [Barlow Condensed + Barlow](https://fonts.google.com/share?selection.family=Barlow+Condensed:wght@400;500;600;700;800;900|Barlow:wght@300;400;500;600;700)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@300;400;500;600;700&display=swap');
```

**Tailwind Config:**
```js
fontFamily: {
  display: ['Barlow Condensed', 'sans-serif'],
  body: ['Barlow', 'sans-serif'],
}
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths (sobre fondo oscuro)

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.4)` | Subtle lift |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.5)` | Cards, buttons |
| `--shadow-lg` | `0 10px 30px rgba(0,0,0,0.6)` | Modals, dropdowns |
| `--shadow-glow-red` | `0 0 24px rgba(220,38,38,0.35)` | CTA hover, elementos destacados (usar con moderación) |

---

## Component Specs

### Buttons

```css
/* Primary Button (CTA) */
.btn-primary {
  background: #DC2626;
  color: #F8FAFC;
  padding: 14px 28px;
  border-radius: 6px;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  background: #EF4444;
  box-shadow: 0 0 24px rgba(220,38,38,0.35);
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #F8FAFC;
  border: 2px solid #A1A1AA;
  padding: 12px 26px;
  border-radius: 6px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-secondary:hover {
  border-color: #F8FAFC;
  background: rgba(248,250,252,0.05);
}
```

### Cards

```css
.card {
  background: #151515;
  border: 1px solid #27272A;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  border-color: #DC2626;
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  background: #151515;
  color: #F8FAFC;
  padding: 12px 16px;
  border: 1px solid #27272A;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #DC2626;
  outline: none;
  box-shadow: 0 0 0 3px rgba(220,38,38,0.15);
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
}

.modal {
  background: #151515;
  border: 1px solid #27272A;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Dark Mode Dramático + Exaggerated Minimalism (fusión)

**Keywords:** Negro profundo, alto contraste, tipografía oversized condensada, un solo acento (rojo), espacio negativo generoso, dramatismo fotográfico

**Best For:** Marcas atléticas/fuerza, fitness premium, brands con identidad ya consolidada en impreso

**Key Effects:** Secciones grandes (48px+ gaps), hover con glow rojo sutil, scroll reveal, contadores animados, tipografía hero clamp(3rem, 8vw, 9rem), transiciones 200-300ms

### Page Pattern (Home)

**Pattern Name:** Hero-Centric + Social Proof + Pricing (fusión Hero+Testimonials+CTA y Hero+Features+CTA)

- **Conversion Strategy:** Hero con CTA doble (WhatsApp directo + "Ver Planes") → Beneficios/stats animados → Planes con tabs (Gym/Clases) → Galería → Testimonios → Ubicación → Contacto → WhatsApp flotante persistente
- **CTA Placement:** Hero (sticky en navbar) + post-planes + post-testimonios + footer
- **Section Order:** 1. Hero impactante, 2. Stats animadas, 3. Beneficios, 4. Planes (tabs Gym/Clases), 5. Galería, 6. Testimonios, 7. Ubicación, 8. Contacto, 9. Footer

---

## Anti-Patterns (Do NOT Use)

- ❌ Más de un color de acento compitiendo con el rojo (mantener disciplina monocromática + 1 acento)
- ❌ Gradientes "AI purple/pink"
- ❌ Diseño estático sin jerarquía dramática
- ❌ Exceso de animación (prioridad: elegancia sobre cantidad)

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio (cuidado con plata #A1A1AA sobre negro en texto pequeño — usar solo para texto ≥16px o detalles)
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y (ring rojo `#DC2626` con offset)

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Contraste de texto 4.5:1 mínimo (verificar plata sobre negro)
- [ ] Focus states visibles (ring rojo) para navegación por teclado
- [ ] `prefers-reduced-motion` respetado
- [ ] Responsive: 375px, 768px, 1024px, 1440px, ultra-wide
- [ ] Sin contenido oculto detrás de navbar fijo
- [ ] Sin scroll horizontal en mobile
- [ ] Botón flotante de WhatsApp no tapa CTAs ni contenido en mobile
