================================================================================
                    JOBSCOUT DESIGN SYSTEM v1.0
                    OFFICIAL & LOCKED DESIGN TOKENS
================================================================================

Status: LOCKED
Version: 1.0.0
Last Updated: 2026-09-10
Author: Design Engineering Team

IMPORTANT: These design tokens are locked and must be used consistently across
all pages, components, and features of the JobScout application.

================================================================================
1. DESIGN PRINCIPLES
================================================================================

1. CLARITY OVER DECORATION
   - Every element serves a purpose
   - Remove anything that doesn't add value
   - White space is a feature, not waste

2. SUBTLE DEPTH
   - Use shadows and layers meaningfully
   - Layered shadows for realistic elevation
   - Borders soften the edges

3. PURPOSEFUL MOTION
   - Animations guide attention, not distract
   - Fast micro-interactions (100-150ms)
   - Deliberate transitions (200-300ms)

4. GENEROUS WHITESPACE
   - Let content breathe
   - Consistent spacing rhythm
   - Visual hierarchy through space

5. TYPOGRAPHIC HIERARCHY
   - Clear information architecture
   - Tight letter-spacing for headings
   - Readable line heights for body


================================================================================
2. COLOR SYSTEM
================================================================================

--------------------------------------------------------------------------------
BRAND PRIMARY - Sophisticated Deep Blue
--------------------------------------------------------------------------------
Use for: Primary buttons, links, active states, brand elements

Token           Hex         Usage
───────────────────────────────────────────────────────────────────────────────
brand-50        #EEF4FF     Hover backgrounds, selected states
brand-100       #E0EAFF     Light fills, badges
brand-200       #C6D8FF     Borders on primary elements
brand-300       #A3BFFF     Disabled primary elements
brand-400       #7A9CFF     Secondary buttons
brand-500       #5478F6     Links, accents
brand-600       #3B5CE9     PRIMARY DEFAULT - buttons, CTAs
brand-700       #2D4AD4     Primary hover
brand-800       #2840AB     Primary active/pressed
brand-900       #273B87     Dark primary
brand-950       #1A2452     Darkest primary

--------------------------------------------------------------------------------
ACCENT - Vibrant Teal
--------------------------------------------------------------------------------
Use for: Success CTAs, highlights, special actions

Token           Hex         Usage
───────────────────────────────────────────────────────────────────────────────
accent-50       #EFFEFA     Light backgrounds
accent-100      #C8FFF0     Subtle fills
accent-200      #92FFE3     Borders
accent-300      #51F7D2     Hover states
accent-400      #1DE4BC     Active states
accent-500      #00C9A2     Accent default
accent-600      #00A485     Accent buttons
accent-700      #00836C     Hover
accent-800      #046756     Active
accent-900      #065548     Dark
accent-950      #00332D     Darkest

--------------------------------------------------------------------------------
NEUTRAL - Warm Gray Palette
--------------------------------------------------------------------------------
Use for: Text, backgrounds, borders, disabled states

Token           Hex         Usage
───────────────────────────────────────────────────────────────────────────────
neutral-0       #FFFFFF     Primary background (light)
neutral-50      #FAFAFA     Secondary background
neutral-100     #F4F4F5     Tertiary background, hover
neutral-150     #ECECED     Subtle borders
neutral-200     #E4E4E7     Borders, dividers
neutral-300     #D4D4D8     Disabled borders
neutral-400     #A1A1AA     Placeholder text, disabled
neutral-500     #71717A     Secondary text
neutral-600     #52525B     Body text
neutral-700     #3F3F46     Headings
neutral-800     #27272A     High emphasis text
neutral-850     #1F1F23     Dark mode surface
neutral-900     #18181B     Dark mode background
neutral-950     #0D0D0F     Darkest, maximum contrast

--------------------------------------------------------------------------------
SEMANTIC COLORS
--------------------------------------------------------------------------------

SUCCESS (Green)
  success-50:   #ECFDF5     Light background
  success-100:  #D1FAE5     Subtle fill
  success-500:  #10B981     Default
  success-600:  #059669     Hover
  success-700:  #047857     Active/Dark

WARNING (Amber)
  warning-50:   #FFFBEB     Light background
  warning-100:  #FEF3C7     Subtle fill
  warning-500:  #F59E0B     Default
  warning-600:  #D97706     Hover
  warning-700:  #B45309     Active/Dark

ERROR (Red)
  error-50:     #FEF2F2     Light background
  error-100:    #FEE2E2     Subtle fill
  error-500:    #EF4444     Default
  error-600:    #DC2626     Hover
  error-700:    #B91C1C     Active/Dark

INFO (Blue)
  info-50:      #EFF6FF     Light background
  info-100:     #DBEAFE     Subtle fill
  info-500:     #3B82F6     Default
  info-600:     #2563EB     Hover
  info-700:     #1D4ED8     Active/Dark


================================================================================
3. TYPOGRAPHY
================================================================================

--------------------------------------------------------------------------------
FONT FAMILIES
--------------------------------------------------------------------------------

Primary (UI & Body):
  font-family: 'Inter var', 'Inter', -apple-system, BlinkMacSystemFont, 
               'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;

Display (Headlines):
  font-family: 'Inter var', 'Inter', -apple-system, BlinkMacSystemFont, 
               sans-serif;

Monospace (Code):
  font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

--------------------------------------------------------------------------------
TYPE SCALE
--------------------------------------------------------------------------------

Token       Size        Line Height   Letter Spacing   Usage
───────────────────────────────────────────────────────────────────────────────
text-xs     0.75rem     1.125rem      0.01em           Labels, captions
text-sm     0.8125rem   1.25rem       0.005em          Secondary text, meta
text-base   0.9375rem   1.5rem        0                Body text default
text-md     1rem        1.5rem        -0.01em          Emphasized body
text-lg     1.125rem    1.75rem       -0.01em          Lead paragraphs
text-xl     1.25rem     1.875rem      -0.015em         Card titles
text-2xl    1.5rem      2rem          -0.02em          Section headings
text-3xl    1.875rem    2.375rem      -0.025em         Page titles
text-4xl    2.25rem     2.75rem       -0.03em          Hero headings
text-5xl    3rem        3.5rem        -0.035em         Display large
text-6xl    3.75rem     4.25rem       -0.04em          Display hero

--------------------------------------------------------------------------------
FONT WEIGHTS
--------------------------------------------------------------------------------

Weight      Value       Usage
───────────────────────────────────────────────────────────────────────────────
normal      400         Body text, descriptions
medium      500         Buttons, emphasized text, labels
semibold    600         Headings, card titles
bold        700         Hero text, strong emphasis


================================================================================
4. SPACING
================================================================================

Base Unit: 4px (0.25rem)

Token       Value       Pixels      Usage
───────────────────────────────────────────────────────────────────────────────
space-0     0           0           Reset
space-0.5   0.125rem    2px         Micro adjustments
space-1     0.25rem     4px         Tight gaps (icon-text)
space-1.5   0.375rem    6px         Compact elements
space-2     0.5rem      8px         Related elements
space-2.5   0.625rem    10px        Button padding Y
space-3     0.75rem     12px        Form input padding
space-3.5   0.875rem    14px        Medium gaps
space-4     1rem        16px        Standard gap (default)
space-5     1.25rem     20px        Card padding compact
space-6     1.5rem      24px        Card padding standard
space-8     2rem        32px        Section spacing
space-10    2.5rem      40px        Large gaps
space-12    3rem        48px        Section breaks
space-16    4rem        64px        Page sections
space-20    5rem        80px        Major sections
space-24    6rem        96px        Hero spacing


================================================================================
5. BORDER RADIUS
================================================================================

Token           Value       Pixels      Usage
───────────────────────────────────────────────────────────────────────────────
rounded-sm      0.25rem     4px         Subtle rounding, badges
rounded         0.375rem    6px         Default, inputs
rounded-md      0.5rem      8px         Buttons, chips
rounded-lg      0.75rem     12px        Cards
rounded-xl      1rem        16px        Modals, large cards
rounded-2xl     1.25rem     20px        Feature cards
rounded-3xl     1.5rem      24px        Hero elements
rounded-full    9999px      -           Pills, avatars


================================================================================
6. SHADOWS
================================================================================

Token           Value                                       Usage
───────────────────────────────────────────────────────────────────────────────
shadow-xs       0 1px 2px 0 rgb(0 0 0 / 0.03)              Minimal lift
shadow-sm       0 1px 2px 0 rgb(0 0 0 / 0.04),             Subtle elevation
                0 1px 2px -1px rgb(0 0 0 / 0.04)
shadow          0 1px 3px 0 rgb(0 0 0 / 0.05),             Default cards
                0 1px 2px -1px rgb(0 0 0 / 0.05)
shadow-md       0 4px 6px -1px rgb(0 0 0 / 0.05),          Hover states
                0 2px 4px -2px rgb(0 0 0 / 0.05)
shadow-lg       0 10px 15px -3px rgb(0 0 0 / 0.06),        Dropdowns
                0 4px 6px -4px rgb(0 0 0 / 0.06)
shadow-xl       0 20px 25px -5px rgb(0 0 0 / 0.08),        Modals
                0 8px 10px -6px rgb(0 0 0 / 0.08)
shadow-2xl      0 25px 50px -12px rgb(0 0 0 / 0.15)        Prominent

COLORED SHADOWS:
shadow-brand    0 4px 14px 0 rgb(59 92 233 / 0.25)         Brand buttons
shadow-brand-lg 0 8px 24px 0 rgb(59 92 233 / 0.3)          Emphasis
shadow-accent   0 4px 14px 0 rgb(0 201 162 / 0.3)          Accent buttons

GLOW EFFECTS:
glow-brand      0 0 20px 0 rgb(59 92 233 / 0.15)           Subtle glow
glow-accent     0 0 20px 0 rgb(0 201 162 / 0.2)            Accent glow


================================================================================
7. ANIMATIONS & TRANSITIONS
================================================================================

--------------------------------------------------------------------------------
DURATION
--------------------------------------------------------------------------------

Token           Value       Usage
───────────────────────────────────────────────────────────────────────────────
duration-75     75ms        Micro-interactions (color)
duration-100    100ms       Quick feedback (active states)
duration-150    150ms       Standard transitions (default)
duration-200    200ms       Smooth transitions
duration-250    250ms       Deliberate motion
duration-300    300ms       Modals, panels
duration-400    400ms       Complex animations
duration-500    500ms       Page transitions

--------------------------------------------------------------------------------
EASING
--------------------------------------------------------------------------------

ease-out                    cubic-bezier(0.0, 0.0, 0.2, 1)
                           Use for: Elements entering

ease-in                     cubic-bezier(0.4, 0.0, 1, 1)
                           Use for: Elements exiting

ease-in-out                 cubic-bezier(0.4, 0.0, 0.2, 1)
                           Use for: Elements moving

emphasized                  cubic-bezier(0.2, 0.0, 0, 1.0)
                           Use for: Dramatic motion

emphasized-decelerate       cubic-bezier(0.05, 0.7, 0.1, 1.0)
                           Use for: Natural slowdown

spring                      cubic-bezier(0.34, 1.56, 0.64, 1)
                           Use for: Playful bounce

--------------------------------------------------------------------------------
KEYFRAME ANIMATIONS
--------------------------------------------------------------------------------

fade-in         opacity 0→1, 200ms ease-out
fade-in-up      opacity 0→1 + translateY 12→0, 300ms ease-out
fade-in-down    opacity 0→1 + translateY -12→0, 300ms ease-out
scale-in        opacity 0→1 + scale 0.96→1, 200ms ease-out
slide-in-right  opacity 0→1 + translateX 16→0, 300ms ease-out
slide-in-left   opacity 0→1 + translateX -16→0, 300ms ease-out
skeleton        background-position shimmer, 1.5s infinite


================================================================================
8. COMPONENT SPECIFICATIONS
================================================================================

--------------------------------------------------------------------------------
BUTTONS
--------------------------------------------------------------------------------

Variants:
  primary     - Brand-600 bg, white text, brand hover/active
  secondary   - White bg, neutral-700 text, border
  ghost       - Transparent, neutral-600 text, hover bg
  accent      - Accent-600 bg, white text
  danger      - Error-600 bg, white text

Sizes:
  Size    Height    Padding X    Font Size    Icon Size
  xs      28px      10px         12px         14px
  sm      32px      12px         14px         16px
  md      36px      16px         14px         18px
  lg      40px      20px         16px         18px
  xl      48px      24px         16px         20px

States:
  Default → Hover (darken 5%) → Active (scale 0.98, darken 10%) → Disabled (50%)

Focus: ring-2 ring-brand-500/50 ring-offset-2

--------------------------------------------------------------------------------
INPUTS
--------------------------------------------------------------------------------

Sizes:
  sm      32px height     12px padding     14px font
  md      40px height     12px padding     15px font
  lg      48px height     16px padding     18px font

States:
  Default:  border-neutral-300
  Hover:    border-neutral-400
  Focus:    border-brand-500, ring-2 ring-brand-500/30
  Error:    border-error-500, ring-2 ring-error-500/30
  Disabled: bg-neutral-100, opacity-60

--------------------------------------------------------------------------------
CARDS
--------------------------------------------------------------------------------

Default:
  Background:    neutral-0 (white)
  Border:        1px neutral-200/80
  Radius:        12px (rounded-lg)
  Shadow:        shadow-sm
  Padding:       20px (p-5)

Interactive (hover):
  Border:        neutral-300
  Shadow:        shadow-md
  Transform:     translateY(-1px)

--------------------------------------------------------------------------------
BADGES & TAGS
--------------------------------------------------------------------------------

Badge (small status):
  Padding:       4px 8px
  Font:          12px, medium
  Radius:        6px (rounded-md)

Tag (skills, filters):
  Padding:       4px 10px (sm), 4px 10px (md)
  Font:          12px (sm), 14px (md), medium
  Radius:        6px (rounded-md)

Job Type Badge Colors:
  Remote:        success-50 bg, success-700 text
  Hybrid:        info-50 bg, info-700 text
  On-site:       neutral-100 bg, neutral-700 text
  Full-time:     brand-50 bg, brand-700 text
  Part-time:     warning-50 bg, warning-700 text
  Contract:      neutral-100 bg, neutral-600 text


================================================================================
9. LAYOUT
================================================================================

--------------------------------------------------------------------------------
BREAKPOINTS
--------------------------------------------------------------------------------

Token       Min-Width       Target
───────────────────────────────────────────────────────────────────────────────
(default)   0               Mobile phones
sm          640px           Large phones
md          768px           Tablets
lg          1024px          Small laptops
xl          1280px          Desktops
2xl         1536px          Large monitors

--------------------------------------------------------------------------------
CONTAINER
--------------------------------------------------------------------------------

Max width:      72rem (1152px)
Padding:        16px (mobile), 24px (sm+), 32px (lg+)

CSS: .container-main {
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px)  { padding: 0 1.5rem; }
@media (min-width: 1024px) { padding: 0 2rem; }

--------------------------------------------------------------------------------
Z-INDEX SCALE
--------------------------------------------------------------------------------

Layer           Value       Usage
───────────────────────────────────────────────────────────────────────────────
base            0           Default elements
dropdown        100         Dropdown menus
sticky          200         Sticky headers
overlay         300         Overlay backgrounds
modal           400         Modal dialogs
popover         500         Popovers
tooltip         600         Tooltips
toast           700         Toast notifications
max             9999        Maximum (rare use)


================================================================================
10. ICONS
================================================================================

Library:        Lucide React (https://lucide.dev)
                NO EMOJIS - Use icons only

Default Size:   18px
Stroke Width:   2

Size Scale:
  xs      14px    Inline with small text
  sm      16px    Inline with body
  md      18px    Buttons, inputs (default)
  lg      20px    Standalone, headers
  xl      24px    Feature icons
  2xl     32px    Empty states

Common Icons:
  Navigation:   Menu, X, ChevronDown, ChevronRight, ArrowLeft, ArrowRight
  Actions:      Search, Bookmark, Share2, ExternalLink, Send
  Job:          Briefcase, MapPin, DollarSign, Clock, Building2, Users
  Status:       Check, Star, Sparkles, AlertCircle
  UI:           Moon, Sun, SlidersHorizontal, ArrowUpDown


================================================================================
11. DARK MODE
================================================================================

Background Layers:
  Primary:      neutral-950 (#0D0D0F)
  Secondary:    neutral-900 (#18181B)
  Tertiary:     neutral-850 (#1F1F23)
  Elevated:     neutral-800 (#27272A)

Text Colors:
  Primary:      neutral-50 (#FAFAFA)
  Secondary:    neutral-300 (#D4D4D8)
  Tertiary:     neutral-400 (#A1A1AA)
  Muted:        neutral-500 (#71717A)

Borders:
  Primary:      neutral-800
  Secondary:    neutral-850

Brand (adjusted for dark):
  Default:      brand-500 (#5478F6)
  Hover:        brand-400 (#7A9CFF)

Implementation:
  Add 'dark' class to root element
  Use dark: prefix in Tailwind classes


================================================================================
12. ACCESSIBILITY
================================================================================

Color Contrast (WCAG AA minimum):
  - Normal text:      4.5:1
  - Large text:       3:1
  - UI components:    3:1

Our colors meet AA:
  - neutral-600 on white:  6.07:1 ✓
  - neutral-500 on white:  4.58:1 ✓
  - brand-600 on white:    4.87:1 ✓

Touch Targets:
  - Minimum:          44x44px
  - Recommended:      48x48px
  - Spacing between:  8px minimum

Focus States:
  - Always visible focus ring
  - ring-2 ring-brand-500/50 ring-offset-2
  - Never remove outline without replacement

Keyboard Navigation:
  - All interactive elements focusable
  - Logical tab order
  - Focus trapping in modals

Motion:
  - Respect prefers-reduced-motion
  - @media (prefers-reduced-motion: reduce) { animation: none }


================================================================================
13. FILE REFERENCES
================================================================================

Tailwind Config:    ui-samples/tailwind.config.js
Global CSS:         ui-samples/styles/globals.css
Components:         ui-samples/components/
  - ui/Button.tsx
  - ui/Input.tsx
  - ui/Badge.tsx
  - ui/Card.tsx
  - layout/Header.tsx
  - layout/FilterSidebar.tsx
  - jobs/JobCard.tsx


================================================================================
                              END OF DESIGN SYSTEM
================================================================================
