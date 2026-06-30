# Modern CSS Styles — Redesigned UI

A full redesign of the project CSS using a refined dark-glass aesthetic with warm amber accents, fluid motion, and layered depth. Drop-in replacement for all four original files.

---

## Global Styles (`src/css/global.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

:root {
  /* Color Palette */
  --clr-bg:           #0d0f14;
  --clr-surface:      #13161e;
  --clr-surface-2:    #1a1e2a;
  --clr-surface-3:    #212636;
  --clr-border:       rgba(255, 255, 255, 0.07);
  --clr-border-hover: rgba(255, 255, 255, 0.14);

  --clr-accent:       #f59e0b;
  --clr-accent-dim:   rgba(245, 158, 11, 0.15);
  --clr-accent-hover: #fbbf24;

  --clr-text:         #e8eaf0;
  --clr-muted:        #7c8399;
  --clr-faint:        #424760;

  --clr-success:      #34d399;
  --clr-success-bg:   rgba(52, 211, 153, 0.1);
  --clr-danger:       #f87171;
  --clr-danger-bg:    rgba(248, 113, 113, 0.1);

  /* Glass Effect */
  --glass-bg:         rgba(255, 255, 255, 0.04);
  --glass-border:     rgba(255, 255, 255, 0.08);
  --glass-blur:       blur(16px);

  /* Shadows */
  --shadow-sm:  0 1px 3px rgba(0, 0, 0, 0.4);
  --shadow-md:  0 4px 16px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-lg:  0 12px 40px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-accent: 0 0 20px rgba(245, 158, 11, 0.2);

  /* Radii */
  --radius-sm:  6px;
  --radius-md:  12px;
  --radius-lg:  18px;
  --radius-xl:  24px;
  --radius-full: 9999px;

  /* Typography */
  --font-display: 'Syne', system-ui, sans-serif;
  --font-body:    'DM Sans', system-ui, sans-serif;

  /* Transitions */
  --ease-out:   cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in:    cubic-bezier(0.55, 0, 1, 0.45);
  --ease-inout: cubic-bezier(0.65, 0, 0.35, 1);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.6;
  background-color: var(--clr-bg);
  color: var(--clr-text);
  min-height: 100vh;

  /* Subtle background texture */
  background-image:
    radial-gradient(ellipse 80% 50% at 20% 0%, rgba(245, 158, 11, 0.04) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 100%, rgba(99, 102, 241, 0.04) 0%, transparent 60%);
}

/* ── Layout ── */

.layout-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.page-container {
  padding: 2.5rem 2rem;
  max-width: 1240px;
  margin: 0 auto;
  width: 100%;
}

/* ── Header ── */

.app-header {
  background: rgba(13, 15, 20, 0.85);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--clr-border);
  padding: 0 2rem;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.3s var(--ease-out);
}

.app-header h1 {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--clr-accent);
  letter-spacing: -0.01em;
}

/* ── Sidebar ── */

.app-sidebar {
  width: 260px;
  background: var(--clr-surface);
  border-right: 1px solid var(--clr-border);
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: width 0.35s var(--ease-out), padding 0.35s var(--ease-out);
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}

.app-sidebar.retracted {
  width: 72px;
  padding: 1.5rem 0.75rem;
}

.sidebar-toggle {
  position: absolute;
  top: 1.25rem;
  right: 0.75rem;
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-full);
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: transform 0.35s var(--ease-out), background 0.2s;
  color: var(--clr-muted);
}

.sidebar-toggle:hover {
  background: var(--clr-surface-3);
  color: var(--clr-text);
}

.retracted .sidebar-toggle {
  right: 50%;
  transform: translateX(50%) rotate(180deg);
}

.app-sidebar h3 {
  font-family: var(--font-display);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--clr-faint);
  padding: 0 0.5rem;
  transition: opacity 0.2s;
}

.retracted h3 { opacity: 0; pointer-events: none; }

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.nav-link {
  text-decoration: none;
  color: var(--clr-muted);
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius-md);
  transition: all 0.2s var(--ease-out);
  font-weight: 500;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) scaleY(0);
  width: 3px;
  height: 60%;
  background: var(--clr-accent);
  border-radius: var(--radius-full);
  transition: transform 0.2s var(--ease-out);
}

.nav-link:hover,
.nav-link.active {
  color: var(--clr-text);
  background: var(--glass-bg);
}

.nav-link.active::before,
.nav-link:hover::before {
  transform: translateY(-50%) scaleY(1);
}

.nav-link.active {
  color: var(--clr-accent);
  background: var(--clr-accent-dim);
}

.retracted .nav-link {
  padding: 0.625rem;
  justify-content: center;
}

.nav-link svg,
.nav-link .icon {
  font-size: 1.125rem;
  flex-shrink: 0;
  opacity: 0.8;
}

/* ── Sidebar Footer ── */

.sidebar-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--clr-border);
}

.btn-logout {
  background: var(--clr-danger-bg);
  color: var(--clr-danger);
  width: 100%;
  text-align: left;
  border-radius: var(--radius-md);
  font-weight: 500;
}

.btn-logout:hover {
  background: rgba(248, 113, 113, 0.2);
}

.retracted .btn-logout {
  text-align: center;
  padding: 0.625rem;
}

/* ── Footer ── */

.app-footer {
  padding: 1.25rem 2rem;
  border-top: 1px solid var(--clr-border);
  background: var(--clr-surface);
  text-align: center;
  color: var(--clr-faint);
  font-size: 0.8125rem;
  margin-top: auto;
}

/* ── Cards ── */

.card {
  background: var(--clr-surface);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--clr-border);
  box-shadow: var(--shadow-md);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.card:hover {
  border-color: var(--clr-border-hover);
  box-shadow: var(--shadow-lg);
}

/* ── Buttons ── */

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.125rem;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: white;
  opacity: 0;
  transition: opacity 0.15s;
}

.btn:active::after { opacity: 0.06; }

.btn-primary {
  background: var(--clr-accent);
  color: #0d0f14;
  font-weight: 600;
  box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
}

.btn-primary:hover {
  background: var(--clr-accent-hover);
  box-shadow: var(--shadow-accent);
  transform: translateY(-1px);
}

.btn-primary:active { transform: translateY(0); }

.btn-ghost {
  background: transparent;
  color: var(--clr-muted);
  border: 1px solid var(--clr-border);
}

.btn-ghost:hover {
  background: var(--glass-bg);
  color: var(--clr-text);
  border-color: var(--clr-border-hover);
}

.btn-danger {
  background: var(--clr-danger-bg);
  color: var(--clr-danger);
}

.btn-danger:hover { background: rgba(248, 113, 113, 0.2); }
```

---

## Login Styles (`src/css/login.css`)

```css
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background: var(--clr-bg);
  background-image:
    radial-gradient(ellipse 100% 80% at 50% 0%, rgba(245, 158, 11, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse 60% 60% at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%);
  position: relative;
  overflow: hidden;
}

/* Decorative orbs */
.login-page::before,
.login-page::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.login-page::before {
  width: 500px;
  height: 500px;
  background: rgba(245, 158, 11, 0.06);
  top: -120px;
  left: -100px;
}

.login-page::after {
  width: 400px;
  height: 400px;
  background: rgba(99, 102, 241, 0.05);
  bottom: -100px;
  right: -80px;
}

.login-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  padding: 2.5rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  animation: fadeUp 0.5s var(--ease-out) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Logo mark */
.login-card::before {
  content: '';
  display: block;
  width: 40px;
  height: 4px;
  background: var(--clr-accent);
  border-radius: var(--radius-full);
  margin-bottom: 1.75rem;
}

.login-card h2 {
  font-family: var(--font-display);
  margin-bottom: 0.375rem;
  color: var(--clr-text);
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.login-card .subtitle {
  color: var(--clr-muted);
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.125rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: var(--clr-muted);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--clr-text);
  transition: all 0.2s var(--ease-out);
}

.form-group input::placeholder { color: var(--clr-faint); }

.form-group input:focus {
  outline: none;
  border-color: var(--clr-accent);
  background: var(--clr-surface-3);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
}

.login-btn {
  width: 100%;
  padding: 0.8125rem;
  margin-top: 1.5rem;
  background: var(--clr-accent);
  color: #0d0f14;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.01em;
  transition: all 0.2s var(--ease-out);
}

.login-btn:hover {
  background: var(--clr-accent-hover);
  box-shadow: var(--shadow-accent);
  transform: translateY(-1px);
}

.login-btn:active { transform: translateY(0); }

.error-message {
  color: var(--clr-danger);
  font-size: 0.875rem;
  margin-top: 1rem;
  text-align: center;
  background: var(--clr-danger-bg);
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(248, 113, 113, 0.2);
}

.check-btn {
  margin-top: 1.25rem;
  width: 100%;
  background: transparent;
  border: 1px dashed var(--clr-border);
  color: var(--clr-faint);
  padding: 0.5rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.8125rem;
  font-family: var(--font-body);
  transition: all 0.2s;
}

.check-btn:hover {
  border-color: var(--clr-border-hover);
  color: var(--clr-muted);
  background: var(--glass-bg);
}
```

---

## Homepage Styles (`src/css/homepages.css`)

```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
}

/* ── Welcome ── */

.welcome-section {
  margin-bottom: 2.5rem;
  position: relative;
}

.welcome-section h1 {
  font-family: var(--font-display);
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--clr-text);
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.welcome-section h1 span {
  color: var(--clr-accent);
}

.welcome-section p {
  color: var(--clr-muted);
  margin-top: 0.5rem;
  font-size: 0.9375rem;
}

/* ── Stat Cards ── */

.stat-card {
  background: var(--clr-surface);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--clr-border);
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  position: relative;
  overflow: hidden;
  transition: border-color 0.25s, transform 0.25s var(--ease-out), box-shadow 0.25s;
}

.stat-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--clr-accent), transparent);
  opacity: 0;
  transition: opacity 0.25s;
}

.stat-card:hover {
  border-color: var(--clr-border-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stat-card:hover::after { opacity: 1; }

.stat-card .label {
  font-size: 0.8125rem;
  color: var(--clr-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.stat-card .value {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--clr-text);
  letter-spacing: -0.02em;
  line-height: 1;
}

.stat-card .trend {
  font-size: 0.8125rem;
  color: var(--clr-success);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* ── Chart Area Placeholder ── */

.chart-card {
  background: var(--clr-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--clr-border);
  padding: 1.5rem;
  grid-column: span 2;
}

.chart-card h3 {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--clr-text);
  margin-bottom: 1.25rem;
}
```

---

## Sub-Page Styles (`src/css/pages.css`)

```css
/* ── Page Header ── */

.page-header {
  margin-bottom: 2.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-header-text h2 {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--clr-text);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.page-header-text p {
  color: var(--clr-muted);
  margin-top: 0.375rem;
  font-size: 0.9375rem;
}

/* ── Data Table ── */

.table-wrapper {
  background: var(--clr-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--clr-border);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: var(--clr-surface-2);
}

.data-table th {
  padding: 0.875rem 1.25rem;
  text-align: left;
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--clr-muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  border-bottom: 1px solid var(--clr-border);
  white-space: nowrap;
}

.data-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--clr-border);
  color: var(--clr-text);
  font-size: 0.9rem;
  transition: background 0.15s;
}

.data-table tbody tr:last-child td { border-bottom: none; }

.data-table tbody tr:hover td {
  background: var(--glass-bg);
}

/* ── Badges ── */

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.625rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.badge::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.8;
}

.badge-success {
  background: var(--clr-success-bg);
  color: var(--clr-success);
  border: 1px solid rgba(52, 211, 153, 0.2);
}

.badge-warning {
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.badge-danger {
  background: var(--clr-danger-bg);
  color: var(--clr-danger);
  border: 1px solid rgba(248, 113, 113, 0.2);
}

.badge-neutral {
  background: var(--clr-surface-3);
  color: var(--clr-muted);
  border: 1px solid var(--clr-border);
}

/* ── Settings Form ── */

.settings-form { max-width: 640px; }

.form-section {
  background: var(--clr-surface);
  padding: 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--clr-border);
  margin-bottom: 1.5rem;
}

.form-section-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--clr-text);
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--clr-border);
  letter-spacing: -0.01em;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: var(--clr-muted);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.6875rem 0.9375rem;
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--clr-text);
  transition: all 0.2s var(--ease-out);
}

.form-group input::placeholder,
.form-group textarea::placeholder { color: var(--clr-faint); }

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--clr-accent);
  background: var(--clr-surface-3);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
}

/* ── Utilities ── */

.divider {
  height: 1px;
  background: var(--clr-border);
  margin: 1.5rem 0;
}

.text-muted { color: var(--clr-muted); }
.text-accent { color: var(--clr-accent); }
.text-success { color: var(--clr-success); }
.text-danger  { color: var(--clr-danger); }
```

---

## What Changed

| Area | Old | New |
|---|---|---|
| **Theme** | Light (`#f8fafc` bg, white cards) | Dark (`#0d0f14` bg, layered surfaces) |
| **Accent** | Indigo `#6366f1` | Warm amber `#f59e0b` |
| **Typography** | Inter (generic) | Syne (display) + DM Sans (body) |
| **Cards** | Flat white with light shadow | Dark glass with hover lift & accent border |
| **Sidebar** | Solid white | Dark surface with animated active indicator |
| **Header** | Solid white | Frosted glass backdrop-filter |
| **Buttons** | Flat indigo | Amber with glow shadow on hover |
| **Badges** | Flat green/yellow | Bordered pill with dot indicator |
| **Tables** | White flat rows | Dark striped with hover highlight |
| **Inputs** | White border | Dark inset with amber focus ring |
| **Animations** | None | Page load fade-up, hover lifts, border transitions |
| **Backgrounds** | Solid | Radial gradient atmospheric glows |
