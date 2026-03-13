# UTILITYnet ERP — Design System v2.0
*Unified Light + Dark Mode System · FractalShift × Gnar · Confidential*

---

## Overview

The UTILITYnet ERP platform uses a single unified design system with two modes:

- **Light Mode (default)** — Clean Meridian. High-legibility, professional B2B SaaS. Optimized for daily operator use.
- **Dark Mode** — Alberta Deep. Data-forward, enterprise-grade dark surfaces. Preferred for analytics-heavy workflows and low-light environments.

Users toggle between modes via a sun/moon icon in the top-right nav bar. Preference is persisted to `localStorage`. Both modes share the same typography, spacing, radius, component structure, and brand DNA. Only color tokens change.

---

## Brand DNA (Both Modes)

UTILITYnet's brand identity is carried through all color treatments:

| Element | Value | Notes |
|---|---|---|
| Primary font | Quicksand | Google Fonts — rounded, approachable enterprise feel |
| Mono / data font | JetBrains Mono | Labels, badges, IDs, timestamps, data values |
| Brand teal | `#1E88B4` | Core identity color — nav, active states, info |
| Brand navy | `#045477` | Deep anchor — nav bar, dark surfaces |
| Brand gold | `#ECB324` | Accent — section underlines, highlights, CTAs on dark |
| Gold underline | 48px × 3px | Centered beneath section titles — preserved from source brand |

---

## 01 — Color Tokens

### CSS Implementation

```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* ── LIGHT MODE (default) ── */
:root,
[data-theme="light"] {
  --bg:           #F4F7FA;
  --surface:      #FFFFFF;
  --s2:           #EEF2F6;

  --teal:         #1678A0;
  --teal-dim:     rgba(22, 120, 160, 0.08);
  --teal-bdr:     rgba(22, 120, 160, 0.25);

  --navy:         #045477;

  --gold:         #D4A017;
  --gold-dim:     rgba(212, 160, 23, 0.10);
  --gold-bdr:     rgba(212, 160, 23, 0.30);

  --text:         #4A5568;
  --light:        #1A2B3C;
  --muted:        #8896A5;

  --border:       #E2E8EF;
  --bormid:       #CBD5E0;

  --success:      #27AE60;
  --warning:      #D4A017;
  --error:        #E53E3E;
  --info:         #1678A0;

  --nav-bg:       #045477;
  --nav-text:     #FFFFFF;
  --sidebar-bg:   #FFFFFF;
  --sidebar-bdr:  #E2E8EF;

  --btn-primary-bg:     #1678A0;
  --btn-primary-text:   #FFFFFF;
  --btn-sec-bg:         transparent;
  --btn-sec-text:       #1678A0;
  --btn-sec-bdr:        #1678A0;

  --input-bg:     #F4F7FA;
  --card-shadow:  0 1px 4px rgba(0, 0, 0, 0.06);
  --label-color:  #1678A0;
  --kpi-color:    #1678A0;
  --active-nav-bg: rgba(22, 120, 160, 0.10);
  --active-nav-color: #1678A0;
  --active-nav-bdr: #D4A017;
}

/* ── DARK MODE ── */
[data-theme="dark"] {
  --bg:           #0A1628;
  --surface:      #0F2040;
  --s2:           #162B52;

  --teal:         #1E88B4;
  --teal-dim:     rgba(30, 136, 180, 0.12);
  --teal-bdr:     rgba(30, 136, 180, 0.30);

  --navy:         #045477;

  --gold:         #ECB324;
  --gold-dim:     rgba(236, 179, 36, 0.10);
  --gold-bdr:     rgba(236, 179, 36, 0.30);

  --text:         #A8BFCC;
  --light:        #E8F2F7;
  --muted:        #6B8FA3;

  --border:       rgba(168, 191, 204, 0.08);
  --bormid:       rgba(168, 191, 204, 0.15);

  --success:      #2ECC71;
  --warning:      #ECB324;
  --error:        #E74C3C;
  --info:         #1E88B4;

  --nav-bg:       #0F2040;
  --nav-text:     #E8F2F7;
  --sidebar-bg:   #0F2040;
  --sidebar-bdr:  rgba(168, 191, 204, 0.08);

  --btn-primary-bg:     #ECB324;
  --btn-primary-text:   #0A1628;
  --btn-sec-bg:         transparent;
  --btn-sec-text:       #A8BFCC;
  --btn-sec-bdr:        rgba(168, 191, 204, 0.20);

  --input-bg:     #0A1628;
  --card-shadow:  none;
  --label-color:  #1E88B4;
  --kpi-color:    #ECB324;
  --active-nav-bg: rgba(30, 136, 180, 0.12);
  --active-nav-color: #4BAED4;
  --active-nav-bdr: #ECB324;
}
```

---

### Color Reference Table

| Token | Light Value | Dark Value | Use |
|---|---|---|---|
| `--bg` | `#F4F7FA` | `#0A1628` | Page / app background |
| `--surface` | `#FFFFFF` | `#0F2040` | Cards, panels, nav, sidebar |
| `--s2` | `#EEF2F6` | `#162B52` | Table alternates, nested, hover |
| `--teal` | `#1678A0` | `#1E88B4` | Primary brand, active states, info |
| `--teal-dim` | `rgba(22,120,160,0.08)` | `rgba(30,136,180,0.12)` | Hover bg, active card bg |
| `--teal-bdr` | `rgba(22,120,160,0.25)` | `rgba(30,136,180,0.30)` | Active borders |
| `--navy` | `#045477` | `#045477` | Nav bar bg (light), deep anchor |
| `--gold` | `#D4A017` | `#ECB324` | Accent, highlights, section decorator |
| `--gold-dim` | `rgba(212,160,23,0.10)` | `rgba(236,179,36,0.10)` | Insight card bg, Emberlyn bg |
| `--gold-bdr` | `rgba(212,160,23,0.30)` | `rgba(236,179,36,0.30)` | Insight card border |
| `--text` | `#4A5568` | `#A8BFCC` | Body copy, table content, descriptions |
| `--light` | `#1A2B3C` | `#E8F2F7` | Headlines, strong values, nav items |
| `--muted` | `#8896A5` | `#6B8FA3` | Metadata, secondary labels |
| `--border` | `#E2E8EF` | `rgba(168,191,204,0.08)` | Default card/element borders |
| `--bormid` | `#CBD5E0` | `rgba(168,191,204,0.15)` | Table rows, section dividers |
| `--success` | `#27AE60` | `#2ECC71` | Positive states, enrolled, reconciled |
| `--warning` | `#D4A017` | `#ECB324` | Pending, caution, alerts |
| `--error` | `#E53E3E` | `#E74C3C` | Exceptions, failures, critical |
| `--info` | `#1678A0` | `#1E88B4` | Informational, in-progress |
| `--btn-primary-bg` | `#1678A0` | `#ECB324` | Primary CTA background |
| `--btn-primary-text` | `#FFFFFF` | `#0A1628` | Primary CTA text |
| `--label-color` | `#1678A0` | `#1E88B4` | Section labels (mono uppercase) |
| `--kpi-color` | `#1678A0` | `#ECB324` | Primary KPI value color |

---

## 02 — Typography

```css
--font-ui:   'Quicksand', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

| Role | Font | Weight | Size | Use |
|---|---|---|---|---|
| Page Title | Quicksand | 700 | 20–26px | Module headers, empty state headings |
| Section Heading | Quicksand | 600 | 15–17px | Card titles, panel headers, column headers |
| UI Body | Quicksand | 500 | 13–14px | All body copy, table content, descriptions |
| UI Small | Quicksand | 400 | 11–12px | Secondary descriptions, helper text |
| Section Label | JetBrains Mono | 500 | 8–10px | Module section labels — UPPERCASE + tracking |
| Data Value | JetBrains Mono | 400 | 10–12px | KPI numbers, IDs, timestamps, amounts |
| Badge Text | JetBrains Mono | 500 | 7.5–9px | Status pills, record type badges — UPPERCASE |

### Key Rules

- **Never** use Inter, Roboto, Arial, or system fonts — Quicksand + JetBrains Mono is the identity
- Section labels: JetBrains Mono · uppercase · `letter-spacing: 0.10–0.12em` · `var(--label-color)`
- KPI values: JetBrains Mono or Quicksand 700 depending on context
- Nav logo: Quicksand 700 · `letter-spacing: -0.02em` — always tight

---

## 03 — Spacing Scale

| Token | Value | Use |
|---|---|---|
| `xs` | 4px | Icon gaps, tight inline spacing |
| `sm` | 8px | Badge padding, chip gaps, small margins |
| `md` | 12px | Card internal spacing, row padding |
| `lg` | 16px | Panel padding, input padding |
| `xl` | 20–24px | Card padding, section content |
| `2xl` | 28–32px | Page horizontal padding, major gaps |
| `3xl` | 48px | Page vertical padding, section separation |

---

## 04 — Border Radius

| Value | Use |
|---|---|
| `3px` | Status badges (mono text labels) |
| `6px` | Chips, small tags |
| `7px` | Avatars |
| `8px` | Buttons, inputs, icon buttons |
| `9–10px` | Cards, panels, major containers |
| `100px` | Status pills, tag pills |

---

## 05 — Components

### Nav Bar
```css
height: 56px;
background: var(--nav-bg);    /* navy in light · surface in dark */
border-bottom: 1px solid var(--border);
padding: 0 24px;
display: flex; align-items: center; gap: 12px;
```

Light mode nav is deep navy (`#045477`) — this is the strongest brand statement on the page. Dark mode nav matches the surface color with a subtle border.

### Left Sidebar
```css
width: 220px;
background: var(--sidebar-bg);
border-right: 1px solid var(--sidebar-bdr);
padding: 12px 0;
```

**Active nav item:**
```css
background: var(--active-nav-bg);
border-left: 2px solid var(--active-nav-bdr);  /* gold indicator */
color: var(--active-nav-color);
font-weight: 600;
```

**Inactive nav item:**
```css
border-left: 2px solid transparent;
color: var(--text);
font-weight: 500;
```

### Left Navigation — Module Labels

```
Dashboard
Customers
Billing
Settlement
Marketers
Analytics        ← NOT "BI2AI" — analytics is a capability, not a product name
Finance
Admin
```

### Primary Button
```css
background: var(--btn-primary-bg);
color: var(--btn-primary-text);
border: none;
border-radius: 8px;
padding: 10px 20px;
font: 600 14px var(--font-ui);
cursor: pointer;
transition: all 0.15s ease;
```

### Secondary Button
```css
background: var(--btn-sec-bg);
color: var(--btn-sec-text);
border: 1.5px solid var(--btn-sec-bdr);
border-radius: 8px;
padding: 10px 20px;
font: 500 14px var(--font-ui);
```

### Ghost Button
```css
background: transparent;
color: var(--text);
border: 1px solid var(--border);
border-radius: 8px;
padding: 8px 16px;
font: 500 13px var(--font-ui);
```

### Card
```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 10px;
padding: 20px 24px;
box-shadow: var(--card-shadow);  /* 0 1px 4px in light · none in dark */
```

**Accent / Featured Card** (insight panels, Emberlyn panel):
```css
border-color: var(--gold-bdr);
background: var(--gold-dim);
```

**Teal Accent Card** (active processes, in-progress):
```css
border-color: var(--teal-bdr);
background: var(--teal-dim);
```

### KPI Stat Card
```css
/* The featured metric card uses gold border */
border-color: var(--gold-bdr);
background: var(--gold-dim);

.kpi-label {
  font: 500 8px var(--font-mono);
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--text);
  opacity: 0.75;
  margin-bottom: 6px;
}

.kpi-value {
  font: 700 22px var(--font-ui);
  color: var(--kpi-color);
}

.kpi-delta {
  font: 600 9.5px var(--font-ui);
  color: var(--success);
  margin-top: 4px;
}
```

### Data Table
```css
/* Table header row */
thead tr {
  background: var(--s2);
  border-bottom: 2px solid var(--teal);   /* teal underline on header */
}

thead th {
  font: 500 7.5px var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text);
  opacity: 0.65;
  padding: 8px 14px;
}

/* Data rows */
tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.15s ease;
}

tbody tr:hover {
  background: var(--teal-dim);
}

tbody td {
  padding: 9px 14px;
  font: 500 11px var(--font-ui);
  color: var(--light);
}
```

### Status Pills
```css
display: inline-flex;
align-items: center;
gap: 5px;
border-radius: 100px;
padding: 3px 10px;
font: 500 7.5px var(--font-mono);
letter-spacing: 0.08em;
text-transform: uppercase;
```

| Status | Background | Border | Color |
|---|---|---|---|
| ACTIVE / ENROLLED | `var(--teal-dim)` | `var(--teal-bdr)` | `var(--teal)` |
| PENDING | `var(--gold-dim)` | `var(--gold-bdr)` | `var(--gold)` |
| EXCEPTION | `rgba(229,62,62,0.10)` | `rgba(229,62,62,0.30)` | `var(--error)` |
| RECONCILED | `rgba(39,174,96,0.10)` | `rgba(39,174,96,0.30)` | `var(--success)` |
| DRAFT | `rgba(128,128,128,0.08)` | `rgba(128,128,128,0.18)` | `var(--muted)` |
| CLOSED | `var(--s2)` | `var(--bormid)` | `var(--muted)` |

### Inputs & Textareas
```css
background: var(--input-bg);
border: 1px solid var(--border);
border-radius: 8px;
padding: 10px 14px;
font: 500 13px var(--font-ui);
color: var(--light);
outline: none;
transition: border-color 0.15s ease;

/* Focus */
border-color: var(--teal-bdr);

/* Placeholder */
color: var(--muted);
opacity: 0.6;
```

### Section Label Convention
```css
font: 500 9px var(--font-mono);
letter-spacing: 0.12em;
text-transform: uppercase;
color: var(--label-color);
margin-bottom: 6px;
```

### Gold Section Underline Decorator
Preserved from the original UTILITYnet brand — appears beneath section/page titles:
```css
.section-title::after {
  content: '';
  display: block;
  width: 48px;
  height: 3px;
  background: var(--gold);
  border-radius: 2px;
  margin-top: 8px;
}

/* Centered variant (used in marketing/hero sections) */
.section-title.centered::after {
  margin: 8px auto 0;
}
```

---

## 06 — Emberlyn Panel

Emberlyn is the AI operations copilot — present on every module as a persistent right panel or collapsible drawer.

```css
/* Panel container */
.emberlyn-panel {
  width: 300px;
  background: var(--surface);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Panel header */
.emberlyn-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--bormid);
  background: var(--gold-dim);
  border-top: 2px solid var(--gold);   /* gold top accent */
}

.emberlyn-label {
  font: 500 8px var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 3px;
}

.emberlyn-title {
  font: 600 13px var(--font-ui);
  color: var(--light);
}

/* Message area */
.emberlyn-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* AI message bubble */
.bubble-ai {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px 10px 10px 2px;
  padding: 10px 12px;
  font: 400 12px var(--font-ui);
  color: var(--light);
  line-height: 1.6;
  max-width: 88%;
}

/* User message bubble */
.bubble-user {
  background: var(--teal);
  color: #FFFFFF;
  border-radius: 10px 10px 2px 10px;
  padding: 10px 12px;
  font: 500 12px var(--font-ui);
  line-height: 1.5;
  max-width: 88%;
  align-self: flex-end;
}

/* Action preview card (before confirming a change) */
.action-preview {
  background: var(--gold-dim);
  border: 1px solid var(--gold-bdr);
  border-radius: 8px;
  padding: 10px 12px;
  font: 500 11px var(--font-ui);
  color: var(--light);
}

/* Input area */
.emberlyn-input-area {
  padding: 12px 14px;
  border-top: 1px solid var(--border);
  background: var(--surface);
}
```

**Critical behavior rule:** Emberlyn never silently applies changes. Flow is always:
`interpret → show structured action preview → user confirms → apply`

---

## 07 — Mode Toggle

```html
<!-- Toggle button in nav bar, top-right -->
<button class="mode-toggle" aria-label="Toggle dark mode">
  <!-- Sun icon in dark mode, Moon icon in light mode -->
</button>
```

```css
.mode-toggle {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.10);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #FFFFFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.15s ease;
}

.mode-toggle:hover {
  background: rgba(255, 255, 255, 0.18);
}
```

```javascript
// Mode toggle logic
const toggle = document.querySelector('.mode-toggle');
const root = document.documentElement;

// Default: light
const saved = localStorage.getItem('utilitynet-theme') || 'light';
root.setAttribute('data-theme', saved);
updateIcon(saved);

toggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  localStorage.setItem('utilitynet-theme', next);
  updateIcon(next);
});

function updateIcon(theme) {
  toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}
```

---

## 08 — Page Layout

```
┌─────────────────────────────────────────────────────┐
│  NAV BAR · 56px · var(--nav-bg)                     │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  SIDEBAR     │  MAIN CONTENT AREA                   │
│  220px       │  flex: 1 · max-width 1100px          │
│  var(--      │  padding: 24px 28px                  │
│  sidebar-bg) │                                      │
│              │                                      │
│              │  [optional: Emberlyn panel 300px]    │
└──────────────┴──────────────────────────────────────┘
```

```css
/* App shell */
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg);
  font-family: var(--font-ui);
}

.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  max-width: 1100px;
}

/* With Emberlyn open */
.main-content.with-panel {
  max-width: calc(100% - 300px);
}
```

---

## 09 — Motion & Animation

```css
/* All interactive elements */
transition: all 0.15s ease;

/* Card / panel entrance */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card-enter { animation: fadeUp 0.2s ease; }

/* Status dot pulse (Emberlyn active indicator) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}

/* Skeleton loading */
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--s2) 25%,
    var(--border) 50%,
    var(--s2) 75%
  );
  background-size: 400px 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 4px;
}

/* Mode transition (smooth theme switch) */
*, *::before, *::after {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.1s ease;
}
```

**Rules:**
- Never exceed `0.4s` for UI interactions
- Never exceed `1s` for data transitions
- Entrance: always `fadeUp` — not slide-from-side, not fade-only
- Hover: `all 0.15s ease` — color, border, background together

---

## 10 — Quick Reference

```
LIGHT MODE
  Backgrounds:  #F4F7FA · #FFFFFF · #EEF2F6
  Primary CTA:  #1678A0 (teal button + white text)
  Nav:          #045477 (navy)
  Accent:       #D4A017 (muted gold)
  Body text:    #4A5568
  Headlines:    #1A2B3C
  Borders:      #E2E8EF · #CBD5E0

DARK MODE
  Backgrounds:  #0A1628 · #0F2040 · #162B52
  Primary CTA:  #ECB324 (gold button + dark text)
  Nav:          #0F2040 (surface)
  Accent:       #ECB324 (vivid gold)
  Body text:    #A8BFCC
  Headlines:    #E8F2F7
  Borders:      rgba(168,191,204,0.08) · rgba(168,191,204,0.15)

SHARED
  Fonts:        Quicksand (UI) · JetBrains Mono (data/labels)
  Radius:       3 · 6 · 7 · 8 · 10 · 100px
  Motion:       0.15s hover · 0.2s entrance · 1.4s shimmer
  Gold dec:     48px × 3px underline beneath section titles
  Nav modules:  Dashboard · Customers · Billing · Settlement
                Marketers · Analytics · Finance · Admin
```

---

## 11 — Module Navigation Reference

| # | Label | Icon suggestion | Notes |
|---|---|---|---|
| 1 | Dashboard | Grid / Home | Default landing, KPIs + Emberlyn |
| 2 | Customers | Person | Enrollment, CRM, 360 view |
| 3 | Billing | Document | Batch runs, invoices, exceptions |
| 4 | Settlement | Arrows | Reconciliation, marketer statements |
| 5 | Marketers | Building | Partner directory, margin, performance |
| 6 | Analytics | Chart | Reporting, forecasting, prescriptive insights |
| 7 | Finance | Currency | GL, AR, AP, reconciliation |
| 8 | Admin | Settings | Integrations, permissions, audit log |

> **Naming note:** "Analytics" is the module label. The underlying philosophy of moving from reporting → prediction → prescription is a capability story told inside the module — not a product name shown in navigation or UI chrome.

---

*UTILITYnet ERP Demo · Design System v2.0 · FractalShift × Gnar · Confidential · March 2026*
