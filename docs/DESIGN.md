# DESIGN.md — Maxxsiren Inventory System
## Single Source of Truth for All UI/Visual Decisions

**The system only supports light mode. Usage of the dark: prefix is prohibited.**

> **Mandatory Rule**: Read this file before working on any UI. Every visual decision not covered here must be added here before implementation — not after.

---

## Reference Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Styling | Tailwind CSS v4 |
| Component Library | Shadcn UI |
| CSS Variable System | HSL via `:root` (light mode only) |

---

## 1. Color System & Tokens

### 1.1 Brand Colors

| Token | Hex | HSL | Usage |
|---|---|---|---|
| `--primary` | `#3B8B72` | `161 40% 39%` | Primary CTA, active state, focus ring |
| `--secondary` | `#6A816A` | `120 10% 46%` | Secondary actions, neutral badge, active border |
| `--neutral` | `#444444` | `0 0% 27%` | Primary body text |

### 1.2 Semantic Colors

| Token | Hex | HSL | Usage |
|---|---|---|---|
| `--success` | `#2D8653` | `150 50% 35%` | Sufficient stock, successful transaction, active badge |
| `--warning` | `#C97B1A` | `35 78% 45%` | Low stock alert, attention |
| `--danger` | `#C0392B` | `5 64% 46%` | Delete, form error, out of stock |
| `--info` | `#2563EB` | `217 91% 54%` | Information, tooltip, link |

### 1.3 Neutral Scale (Gray)

| Token | HSL | Usage |
|---|---|---|
| `--background` | `0 0% 98%` | Page background |
| `--surface` | `0 0% 100%` | Card, modal, sidebar |
| `--surface-raised` | `0 0% 96%` | Table row hover, input background |
| `--border` | `0 0% 88%` | Component border |
| `--border-subtle` | `0 0% 93%` | Divider, table border |
| `--muted` | `0 0% 55%` | Placeholder, disabled label |
| `--foreground` | `0 0% 12%` | Primary text |
| `--foreground-muted` | `0 0% 45%` | Secondary text, caption |

### 1.4 Implementation: `globals.css`

Place this entire block in `src/app/globals.css`, replacing the default Shadcn configuration.

```css
@import "tailwindcss";

@theme inline {
  --color-background:     var(--background);
  --color-foreground:     var(--foreground);
  --color-surface:        var(--surface);
  --color-surface-raised: var(--surface-raised);

  --color-primary:             var(--primary);
  --color-primary-foreground:  var(--primary-foreground);
  --color-secondary:           var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);

  --color-success:   var(--success);
  --color-warning:   var(--warning);
  --color-danger:    var(--danger);
  --color-info:      var(--info);

  --color-muted:            var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border:           var(--border);
  --color-border-subtle:    var(--border-subtle);
  --color-input:            var(--input-bg);
  --color-ring:             var(--ring);

  --color-card:             var(--surface);
  --color-card-foreground:  var(--foreground);
  --color-popover:          var(--surface);
  --color-popover-foreground: var(--foreground);

  --color-destructive:            var(--danger);
  --color-destructive-foreground: var(--danger-foreground);

  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  --font-sans: var(--font-family-sans);
}

/* --- LIGHT MODE --- */
:root {
  --background:       hsl(0 0% 98%);
  --foreground:       hsl(0 0% 12%);
  --foreground-muted: hsl(0 0% 45%);

  --surface:        hsl(0 0% 100%);
  --surface-raised: hsl(0 0% 96%);

  --primary:            hsl(161 40% 39%);
  --primary-hover:      hsl(161 40% 33%);
  --primary-foreground: hsl(0 0% 100%);
  --primary-subtle:     hsl(161 40% 95%);

  --secondary:            hsl(120 10% 46%);
  --secondary-hover:      hsl(120 10% 40%);
  --secondary-foreground: hsl(0 0% 100%);
  --secondary-subtle:     hsl(120 10% 95%);

  --success:            hsl(150 50% 35%);
  --success-foreground: hsl(0 0% 100%);
  --success-subtle:     hsl(150 50% 94%);

  --warning:            hsl(35 78% 45%);
  --warning-foreground: hsl(0 0% 100%);
  --warning-subtle:     hsl(35 78% 94%);

  --danger:            hsl(5 64% 46%);
  --danger-foreground: hsl(0 0% 100%);
  --danger-subtle:     hsl(5 64% 95%);

  --info:            hsl(217 91% 54%);
  --info-foreground: hsl(0 0% 100%);
  --info-subtle:     hsl(217 91% 95%);

  --muted:            hsl(0 0% 96%);
  --muted-foreground: hsl(0 0% 55%);

  --border:        hsl(0 0% 88%);
  --border-subtle: hsl(0 0% 93%);
  --input-bg:      hsl(0 0% 100%);
  --ring:          hsl(161 40% 39%);

  --sidebar-bg:     hsl(161 25% 16%);
  --sidebar-text:   hsl(161 10% 85%);
  --sidebar-muted:  hsl(161 10% 60%);
  --sidebar-active: hsl(161 40% 39%);
  --sidebar-border: hsl(161 20% 22%);
}
```

---

## 2. Typography

### 2.1 Font Family

```css
/* globals.css — add above :root */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

@theme inline {
  --font-family-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
}
```

> **Font choice**: Plus Jakarta Sans was chosen for its professional-neutral character that suits data dashboards, numbers are clearly readable, and it has visual differentiation compared to Inter.

### 2.2 Type Scale

| Token | Size | rem | Usage |
|---|---|---|---|
| `text-xs` | 11px | 0.6875rem | Table caption, small badge label |
| `text-sm` | 13px | 0.8125rem | Form label, table body, timestamp |
| `text-base` | 15px | 0.9375rem | Primary body text, input value |
| `text-lg` | 17px | 1.0625rem | Card subtitle, section title |
| `text-xl` | 20px | 1.25rem | Page subtitle, card header |
| `text-2xl` | 24px | 1.5rem | Page title |
| `text-3xl` | 30px | 1.875rem | Large dashboard metric number |
| `text-4xl` | 36px | 2.25rem | Hero number (total items, etc.) |

```css
/* Register custom scale in @theme inline */
@theme inline {
  --text-xs:   0.6875rem;
  --text-sm:   0.8125rem;
  --text-base: 0.9375rem;
  --text-lg:   1.0625rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;
  --text-3xl:  1.875rem;
  --text-4xl:  2.25rem;
}
```

### 2.3 Line Height

| Context | Value | Token |
|---|---|---|
| Very dense text (code, table) | 1.35 | `leading-tight` |
| Standard body text | 1.55 | `leading-normal` |
| Long paragraph / explanation | 1.7 | `leading-relaxed` |
| Heading / title | 1.2 | `leading-none` |

### 2.4 Font Weight

| Context | Weight | Tailwind Class |
|---|---|---|
| Body text, table data | 400 | `font-normal` |
| Label, subtitle, important caption | 500 | `font-medium` |
| Section heading, table column name | 600 | `font-semibold` |
| Page title, metric number | 700 | `font-bold` |

### 2.5 Semantic Text Rules

```
Page Title      -> text-2xl font-bold foreground
Section Title   -> text-xl font-semibold foreground
Card Header     -> text-lg font-semibold foreground
Body            -> text-base font-normal foreground
Label / Caption -> text-sm font-medium foreground-muted
Table Header    -> text-xs font-semibold tracking-wide uppercase foreground-muted
Table Cell      -> text-sm font-normal foreground
Metric Number   -> text-3xl font-bold primary
```

---

## 3. Spacing Scale

The spacing system follows **4px (0.25rem)** multiples from Tailwind. The following values are used in this system:

| Token | px | rem | Usage |
|---|---|---|---|
| `space-1` | 4px | 0.25rem | Gap between inline icon and text |
| `space-2` | 8px | 0.5rem | Badge padding, small form column gap |
| `space-3` | 12px | 0.75rem | Compact button padding, form field gap |
| `space-4` | 16px | 1rem | Card header padding, gap between components |
| `space-5` | 20px | 1.25rem | Section padding within card |
| `space-6` | 24px | 1.5rem | Standard card padding |
| `space-8` | 32px | 2rem | Gap between sections within a page |
| `space-10` | 40px | 2.5rem | Page padding (mobile) |
| `space-12` | 48px | 3rem | Page padding (desktop) |
| `space-16` | 64px | 4rem | Gap between large content blocks |

### Standard Padding per Context

| Component | Padding |
|---|---|
| Card | `p-6` (24px) |
| Card Header | `px-6 py-4` |
| Card Body | `px-6 py-5` |
| Table Cell | `px-4 py-3` |
| Table Header Cell | `px-4 py-3` |
| Button Medium | `px-4 py-2` |
| Button Large | `px-5 py-2.5` |
| Button Small | `px-3 py-1.5` |
| Input | `px-3 py-2` |
| Sidebar Item | `px-3 py-2.5` |
| Page Container | `px-6 py-8` (desktop), `px-4 py-6` (mobile) |

---

## 4. Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-sm` | 6px | Badge, small tag |
| `rounded-md` | 8px | Input, button |
| `rounded-lg` | 12px | Card, dropdown, modal |
| `rounded-xl` | 16px | Large card, panel |
| `rounded-full` | 9999px | Avatar, toggle, pill badge |

---

## 5. Shadow System

```css
@theme inline {
  --shadow-card:   0 1px 3px hsl(0 0% 0% / 0.06), 0 1px 2px hsl(0 0% 0% / 0.04);
  --shadow-raised: 0 4px 12px hsl(0 0% 0% / 0.08), 0 2px 4px hsl(0 0% 0% / 0.04);
  --shadow-modal:  0 20px 60px hsl(0 0% 0% / 0.15), 0 8px 20px hsl(0 0% 0% / 0.08);
  --shadow-focus:  0 0 0 3px hsl(161 40% 39% / 0.25);
}
```

---

## 6. UI Component Standards

### 6.1 Button Variants

All buttons use `rounded-md`, `font-medium`, `text-sm`, `transition-colors duration-150`.

#### Primary
```
bg: --primary         | hover: --primary-hover     | text: --primary-foreground
focus-ring: --ring (3px offset)
Disabled: opacity-50, cursor-not-allowed
```

```tsx
// Example Tailwind classes
"bg-primary text-primary-foreground hover:bg-primary/90
 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
 disabled:pointer-events-none disabled:opacity-50
 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors"
```

#### Secondary
```
bg: --secondary       | hover: --secondary-hover   | text: --secondary-foreground
```

#### Outline
```
bg: transparent       | hover bg: --surface-raised
border: 1px --border  | hover border: --secondary  | text: --foreground
```

#### Ghost
```
bg: transparent       | hover bg: --surface-raised | text: --foreground
No border. Used for table row actions (edit, delete row).
```

#### Destructive
```
bg: --danger          | hover: hsl(5 64% 40%)       | text: --danger-foreground
Only for permanent actions: delete data.
```

#### Size Variants

| Size | Height | Padding | Font |
|---|---|---|---|
| `sm` | h-7 (28px) | px-3 | text-xs |
| `md` (default) | h-9 (36px) | px-4 | text-sm |
| `lg` | h-11 (44px) | px-5 | text-base |
| `icon` | h-9 w-9 | p-0 | — |

---

### 6.2 Input Standards

All inputs: `rounded-md`, `text-sm`, `border border-border`, `bg-input`, `text-foreground`.

#### Text Input

```
Height:      h-9 (36px)
Padding:     px-3 py-2
Border:      1px solid --border
Background:  --input-bg
Font:        text-sm text-foreground
Placeholder: text-muted-foreground

State: focus  -> outline-none ring-2 ring-ring ring-offset-0 border-primary
State: error  -> border-danger ring-2 ring-danger/20
State: disabled -> opacity-50 cursor-not-allowed bg-surface-raised
```

#### Select / Dropdown

```
Component: Shadcn <Select>
Same as Text Input for sizing and border
Chevron icon: text-muted-foreground on the right side
Dropdown panel: bg-surface shadow-raised rounded-lg border border-border
Option hover: bg-surface-raised
Option selected: bg-primary-subtle text-primary font-medium
```

#### Search Bar

```
Component: <Input> with Search icon on the left side
Left icon padding: pl-9 (to make room for the icon)
Icon: text-muted-foreground, size 16px, position absolute left-3
Placeholder: "Search item name, code..."
Clear button: appears when there is input (X icon, ghost, size icon sm)
```

#### Textarea

```
Min-height: 80px
Resize: vertical only (resize-y)
Same as Text Input for color and border
```

#### Form Field Anatomy

```
[Label]          -> text-sm font-medium text-foreground, mb-1.5
[Input/Select]   -> h-9, full-width
[Helper/Error]   -> text-xs mt-1.5
  Normal:  text-muted-foreground
  Error:   text-danger flex items-center gap-1 (+ AlertCircle icon 12px)
```

#### Transaction Form Disclaimer (BarangMasuk & BarangKeluar)

Since transactions are immutable (cannot be modified/deleted after saving), a disclaimer must be displayed at the top of the form before input fields:

```tsx
<div className="rounded-md border border-warning/30 bg-warning-subtle px-4 py-3 text-sm text-warning flex gap-2 items-start">
  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
  <span>Make sure the data is correct before saving. Transactions cannot be modified after saving.</span>
</div>
```

---

Tables are the core component in this inventory system. Use `<Table>` from Shadcn.

#### Visual Structure

```
Container:   rounded-lg border border-border overflow-hidden bg-surface shadow-card

Header Row:  bg-surface-raised
  Cell:      px-4 py-3 text-xs font-semibold uppercase tracking-wide text-foreground-muted
  Border:    border-b border-border

Body Row:    bg-surface
  Hover:     hover:bg-surface-raised transition-colors duration-100
  Cell:      px-4 py-3 text-sm text-foreground
  Divider:   border-b border-border-subtle (except last row)

Footer Row:  bg-surface-raised border-t border-border
  Used for: pagination, total rows count
```

#### Standard Columns per Feature

**Items Table**:
```
No | Code | Item Name | Category | Stock | Unit | Min. Stock | Status | Actions
```

**Incoming / Outgoing Items Table**:
```
No | Time (dd MMM yyyy, HH:mm) | Item Name | Quantity | Notes | Recorded by | Actions
```

**Stock Table**:
```
No | Code | Item Name | Category | Current Stock | Min. Stock | Status
```

#### Status Badge in Tables

| Condition | Variant | Color |
|---|---|---|
| Sufficient stock | `success` | bg-success-subtle text-success border-success/20 |
| Low stock (≤ min) | `warning` | bg-warning-subtle text-warning border-warning/20 |
| Out of stock (= 0) | `danger` | bg-danger-subtle text-danger border-danger/20 |
| Active | `success` | — |
| Inactive | `muted` | bg-muted text-muted-foreground |

```tsx
// Badge class pattern
"inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border"
```

#### Table Row Actions

```
Always use Button variant="ghost" size="icon"
Grouped in a single "Actions" column on the far right
Edit Icon:  Pencil, text-muted-foreground hover:text-foreground
Delete Icon: Trash2, text-muted-foreground hover:text-danger
Tooltip required on every icon button
```

#### Empty State for Tables

```tsx
// When data is empty or search results are nil
<tr>
  <td colSpan={columnCount}>
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <PackageOpen size={40} className="mb-3 opacity-40" />
      <p className="text-sm font-medium">No data available</p>
      <p className="text-xs mt-1">Try changing filters or add new data</p>
    </div>
  </td>
</tr>
```

---

### 6.4 Card

```
bg-surface rounded-lg border border-border shadow-card

Card Header:  px-6 py-4 border-b border-border-subtle
  Title:      text-lg font-semibold text-foreground
  Subtitle:   text-sm text-muted-foreground mt-0.5
  Action:     Button variant outline size sm, float right

Card Body:    px-6 py-5

Card Footer:  px-6 py-4 border-t border-border-subtle bg-surface-raised
```

---

### 6.5 Dashboard Metric Card

```
bg-surface rounded-xl border border-border shadow-card p-6

Layout:
  [Icon Container]  w-10 h-10 rounded-lg bg-primary-subtle text-primary
  [Label]           text-sm font-medium text-muted-foreground mt-4
  [Value]           text-3xl font-bold text-foreground mt-1
  [Delta/Trend]     text-xs text-success/warning mt-2 (+ ArrowUp/ArrowDown icon)
```

Four main dashboard cards:
1. Total Item Types -> icon: Package -> primary
2. Total Overall Stock -> icon: Layers -> info
3. Low Stock -> icon: AlertTriangle -> warning
4. Transactions Today -> icon: Activity -> success

---

### 6.6 Sidebar Navigation

```
Width:    240px (expanded) | 64px (collapsed)
Bg:       --sidebar-bg
Border:   border-r border-sidebar-border

Logo Area: h-16 px-4, border-b border-sidebar-border
Nav Item (default):
  px-3 py-2.5 rounded-md mx-2 text-sm font-medium
  text-sidebar-text hover:bg-white/10 transition-colors
Nav Item (active):
  bg-primary text-primary-foreground
Nav Item (icon): text-[inherit] size-4 mr-3 shrink-0
Section Label: px-5 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-muted

User Area: mt-auto border-t border-sidebar-border p-4
  Avatar: w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-semibold
  Name: text-sm font-medium text-sidebar-text
  Role: text-xs text-sidebar-muted
```

---

## 7. Accessibility (A11y) Rules

| Rule | Implementation |
|---|---|
| Focus visible required | All interactive elements must have `focus-visible:ring-2` |
| Do not rely on color alone | Status (out of stock, error) must not be differentiated by color alone — add icon or text |
| ARIA label | Every `<IconButton>` must have an `aria-label` |
| Minimum 4.5:1 contrast | All text on background must meet WCAG AA |
| Skip link | Add `<a href="#main-content">` as the first element in layout |

---

## 8. Layout & Grid

### Dashboard Page Structure

```
+-----------------------------------------------------------+
|  SIDEBAR (240px fixed)  |  MAIN CONTENT AREA              |
|                         |  +--- TOP BAR/HEADER ----------+|
|  Logo                   |  | Page Title + Breadcrumb     ||
|  ---------              |  +-----------------------------+|
|  Nav Items              |  +--- PAGE BODY ---------------+|
|                         |  | p-6 lg:p-8                  ||
|                         |  |                             ||
|  ---------              |  +-----------------------------+|
|  User Area              |                                 |
+-----------------------------------------------------------+
```

### Breakpoints

| Breakpoint | Width | Behavior |
|---|---|---|
| `sm` | 640px | Mobile-first layout starts adjusting |
| `md` | 768px | Sidebar starts appearing |
| `lg` | 1024px | Full desktop layout |
| `xl` | 1280px | Wider content |

### Content Grid

```
Metric Cards:   grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4
Form Layout:    grid grid-cols-1 md:grid-cols-2 gap-4
Table Container: w-full (full width within page body)
Page Max Width: max-w-7xl mx-auto (for very wide screens)
```

---

## 9. Quick Reference — Common Class Combinations

```tsx
// Page Title
<h1 className="text-2xl font-bold text-foreground">Item Management</h1>

// Section subtitle
<p className="text-sm text-muted-foreground mt-1">Manage master inventory item data</p>

// Standard Card
<div className="bg-surface rounded-lg border border-border shadow-card">

// Table wrapper
<div className="rounded-lg border border-border overflow-hidden">

// Primary button
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">

// Danger button (delete)
<Button variant="destructive">Delete</Button>

// Ghost icon button (table actions)
<Button variant="ghost" size="icon" aria-label="Edit item">
  <Pencil className="h-4 w-4" />
</Button>

// Form label
<label className="text-sm font-medium text-foreground">Item Name</label>

// Error message
<p className="text-xs text-danger flex items-center gap-1 mt-1.5">
  <AlertCircle className="h-3 w-3" /> Item name is required
</p>

// Status badge sufficient stock
<span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
  bg-success-subtle text-success border border-success/20">
  Available
</span>

// Muted caption
<span className="text-xs text-muted-foreground">Last updated: 3 minutes ago</span>
```

---

## Changelog

Every change to this file must be recorded with the format:

```
[YYYY-MM-DD] [Section changed]: [Brief description of change]
```
