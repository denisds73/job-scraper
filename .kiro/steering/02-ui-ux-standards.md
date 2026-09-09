# UI/UX Standards: Google-Level Design

Design is not decoration. Design is how it works. Every visual choice, every interaction, every pixel serves the user's goal.

---

## Core Design Philosophy

### 1. Clarity Above All

Users should never wonder what something does or where to go next.

- **Clear hierarchy**: The most important thing is the most visible
- **Obvious actions**: Buttons look clickable, links look linked
- **Predictable patterns**: Users shouldn't have to learn your interface
- **Instant feedback**: Every action has an immediate response

### 2. Reduce Cognitive Load

Every element on screen competes for attention. Be ruthless.

- **Show only what's needed**: Progressive disclosure for complexity
- **Group related items**: Proximity creates meaning
- **Consistent patterns**: Same action, same appearance
- **Smart defaults**: Pre-fill when you can predict

### 3. Design for Humans

Real users on real devices with real limitations.

- **Accessibility first**: Not an afterthought
- **Error prevention**: Make it hard to make mistakes
- **Forgiveness**: Easy to undo, hard to destroy
- **Patience**: Account for slow connections, old devices

---

## Visual Design Principles

### Typography

Typography is 90% of design. Get it right.

**Hierarchy Rules:**
```
Display:  48-64px — Hero headlines only
H1:       36-40px — Page titles
H2:       28-32px — Section headers
H3:       20-24px — Subsection headers
Body:     16px    — Primary content (never smaller)
Caption:  14px    — Secondary info, labels
Small:    12px    — Timestamps, metadata only
```

**Guidelines:**
- Line height: 1.5 for body text, 1.2 for headings
- Line length: 60-80 characters maximum for readability
- Negative letter-spacing for large headings (-0.02em to -0.04em)
- Font weight creates hierarchy (400 body, 500 labels, 600 headings)
- Use Inter as the primary typeface (system font fallback)

### Color

Color communicates meaning. Use it intentionally.

**Semantic Colors:**
- `brand-600` (#3B5CE9): Primary actions, brand identity
- `accent-600` (#00A485): Success, positive states, CTAs
- `red-500`: Errors, destructive actions, warnings
- `amber-500`: Caution, pending states
- `neutral-*`: Content, backgrounds, borders

**Color Rules:**
- Never rely on color alone (use icons, text, patterns)
- Contrast ratio: 4.5:1 minimum for text (WCAG AA)
- Contrast ratio: 3:1 minimum for large text and UI components
- Dark mode is required, not optional
- Test with color blindness simulators

### Spacing

Consistent spacing creates rhythm and predictability.

**Spacing Scale (4px base):**
```
4px   — Tight: icon-to-label, related elements
8px   — Compact: within components
12px  — Default: between related items
16px  — Comfortable: between groups
24px  — Spacious: between sections
32px  — Generous: major divisions
48px  — Dramatic: page sections
64px  — Hero: top-level spacing
```

**Rules:**
- Use the scale—no arbitrary values
- More space = more importance/separation
- Consistent internal padding (16px for cards, 12px for inputs)
- Touch targets: 44x44px minimum

### Shadows & Elevation

Shadows create depth and focus.

**Elevation Levels:**
```
Level 0: Flat (no shadow) — Background elements
Level 1: shadow-sm        — Cards, subtle lift
Level 2: shadow-md        — Dropdowns, floating UI
Level 3: shadow-lg        — Modals, dialogs
Level 4: shadow-xl        — Popovers, high emphasis
```

**Rules:**
- Use layered shadows for realism (multiple shadows at different sizes)
- Interactive elements lift on hover (Level 1 → Level 2)
- Shadows go down-right (light source top-left)
- Dark mode: reduce shadow opacity, increase blur

### Border Radius

Rounded corners feel modern and friendly.

**Scale:**
```
rounded-sm:  4px  — Small elements (badges, tags)
rounded-md:  8px  — Inputs, buttons
rounded-lg:  12px — Cards, containers
rounded-xl:  16px — Large cards, modals
rounded-2xl: 24px — Hero elements, featured content
```

**Rules:**
- Nested elements: inner radius = outer radius - padding
- Consistent radius within component families
- Full round (rounded-full) only for avatars and circular icons

---

## Interaction Design

### States

Every interactive element needs all states:

1. **Default**: Resting state
2. **Hover**: Mouse over (desktop only)
3. **Focus**: Keyboard navigation (required for accessibility)
4. **Active/Pressed**: During interaction
5. **Disabled**: Not available
6. **Loading**: Action in progress

**Implementation:**
```css
/* Focus must be visible */
focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2

/* Hover is enhancement, not requirement */
hover:bg-neutral-50 dark:hover:bg-neutral-800

/* Transitions for smoothness */
transition-colors duration-150 ease-out
```

### Feedback

Users need to know their actions registered.

**Immediate Feedback:**
- Button press: Visual depression or color change
- Form submission: Loading state + disabled
- Toggle: Immediate visual change
- Error: Instant validation message

**Progress Feedback:**
- Operations > 1s: Show progress indicator
- Operations > 4s: Show progress bar with percentage
- Background operations: Toast notification on completion

**Confirmation Feedback:**
- Success: Green checkmark + brief message
- Error: Red alert + actionable message
- Warning: Amber alert + explanation

### Animation & Motion

Motion should be purposeful, not decorative.

**Principles:**
- **Functional**: Guides attention, shows relationships
- **Fast**: 150-300ms for UI, 300-500ms for page transitions
- **Subtle**: Users shouldn't notice it consciously
- **Optional**: Respect prefers-reduced-motion

**Timing Functions:**
```css
ease-out:     UI interactions (buttons, hovers)
ease-in-out:  State changes (expanding, collapsing)
spring:       Playful interactions (toggles, switches)
```

**What to Animate:**
- State changes (hover, focus, active)
- Content appearing/disappearing
- Page transitions
- Loading states

**What NOT to Animate:**
- Static content
- Text (no bouncing logos)
- Critical information
- Anything that could cause motion sickness

---

## Layout Patterns

### Grid System

Use a 12-column grid for flexibility.

**Breakpoints:**
```
sm:   640px   — Mobile landscape
md:   768px   — Tablet
lg:   1024px  — Desktop
xl:   1280px  — Large desktop
2xl:  1536px  — Extra large
```

**Content Width:**
- Max width: 1280px (centered with auto margins)
- Reading content: 65ch maximum
- Full-bleed: Edge to edge for heroes, images

### Common Layouts

**List Page (Search Results):**
```
+------------------+------------------------+
|     Header       |                        |
+--------+---------+------------------------+
| Filters|         Job List                 |
| Sidebar|         - Job Card               |
| 280px  |         - Job Card               |
|        |         - Job Card               |
|        |         - Pagination             |
+--------+---------+------------------------+
|     Footer                                |
+-------------------------------------------+
```

**Detail Page:**
```
+-------------------------------------------+
|     Header                                |
+-------------------------------------------+
|     Breadcrumb                            |
+-------------------------------------------+
|     Title + Metadata                      |
|     Apply Button (sticky on mobile)       |
+-------------------------------------------+
|  Main Content     |  Sidebar              |
|  (Description)    |  (Company Info)       |
|                   |  (Similar Jobs)       |
+-------------------------------------------+
|     Footer                                |
+-------------------------------------------+
```

### Responsive Behavior

Mobile is not a smaller desktop. Design for mobile first.

**Mobile Priorities:**
1. Core content visible without scrolling
2. Touch-friendly targets (44px minimum)
3. Single column layout
4. Bottom navigation for primary actions
5. Swipe gestures for common actions

**Adaptation Strategies:**
- Stack horizontal layouts vertically
- Hide secondary info behind accordions
- Use bottom sheets instead of modals
- Sticky CTAs at bottom of viewport

---

## Component Standards

### Buttons

**Hierarchy:**
1. **Primary**: Main CTA, one per view (brand-600)
2. **Secondary**: Supporting actions (outlined or ghost)
3. **Tertiary**: Low-emphasis actions (text only)
4. **Destructive**: Delete, remove (red)

**Sizing:**
```
sm:   32px height, 12px padding, 14px text
md:   40px height, 16px padding, 14px text (default)
lg:   48px height, 24px padding, 16px text
```

**Rules:**
- Action verbs: "Apply Now", "Save Job", "Clear Filters"
- No generic labels: Avoid "Submit", "Click Here", "OK"
- Icons enhance, not replace text (except icon-only buttons)
- Loading state replaces text with spinner

### Forms

**Input Fields:**
- Labels always visible (no placeholder-only labels)
- Helper text below field for instructions
- Error text replaces helper text on validation failure
- Required indicator: asterisk or "(required)" text

**Validation:**
- Validate on blur (first interaction)
- Validate on change (after first error shown)
- Show success state for valid fields
- Group related errors at field level

**Layout:**
- Single column for forms (easier to scan)
- Logical grouping with fieldsets
- Primary action at bottom left
- Cancel/secondary action as text button

### Cards

**Anatomy:**
```
+----------------------------------+
|  [Optional: Image/Media]         |
+----------------------------------+
|  [Badge/Tag] (optional)          |
|  Title                           |
|  Subtitle/Metadata               |
|  Description (2-3 lines max)     |
|  [Actions] (optional)            |
+----------------------------------+
```

**Rules:**
- Consistent padding (16px default)
- Single click target for navigation cards
- Hover state indicates interactivity
- Don't nest cards within cards

### Navigation

**Header:**
- Logo: top left, links to home
- Primary nav: horizontal on desktop, hamburger on mobile
- Search: prominent placement
- User actions: top right (saved jobs, account)

**Filters:**
- Sidebar on desktop (sticky)
- Bottom sheet or modal on mobile
- Clear all option visible
- Active filter count shown

---

## Accessibility Requirements

Accessibility is not optional. It's a quality requirement.

### WCAG AA Compliance

**Perceivable:**
- All images have alt text (or aria-hidden if decorative)
- Color is not the only indicator of state
- Contrast ratios meet minimums
- Content is readable at 200% zoom

**Operable:**
- All functionality via keyboard
- No keyboard traps
- Focus order is logical
- Skip links for repetitive content

**Understandable:**
- Language is declared in HTML
- Navigation is consistent
- Error messages are helpful
- Labels describe inputs clearly

**Robust:**
- Valid HTML
- ARIA used correctly
- Works with assistive technology
- Progressive enhancement

### Implementation Checklist

- [ ] Tab through entire page — logical order?
- [ ] Screen reader test — makes sense audibly?
- [ ] Keyboard only — all features accessible?
- [ ] High contrast mode — still readable?
- [ ] Zoom 200% — content reflows properly?
- [ ] Reduced motion — animations respect preference?

---

## Empty, Loading, and Error States

### Empty States

When there's no content to show:

- Clear explanation of why it's empty
- Illustration or icon (not required, but helpful)
- Action to resolve (if applicable)
- No dead ends—always a next step

**Example:**
```
[Search icon illustration]
No jobs match your filters
Try adjusting your search or [clear all filters]
```

### Loading States

Show progress, not emptiness:

- **Skeleton screens**: For known content structure
- **Spinners**: For unknown duration operations
- **Progress bars**: For multi-step processes
- Never show blank screens during load

**Rules:**
- Show skeleton immediately (no delay)
- Animate skeleton with subtle pulse
- Match skeleton to actual content layout
- Transition smoothly to real content

### Error States

Errors happen. Handle them gracefully:

- **What happened**: Clear, non-technical explanation
- **Why**: If known, explain the cause
- **What to do**: Actionable next step
- **Tone**: Apologetic but not groveling

**Example:**
```
[Warning icon]
We couldn't load your saved jobs
This might be a temporary issue. Please try again.
[Retry button]
```

---

## Design Tokens Reference

This project uses locked design tokens. See `docs/DESIGN_SYSTEM_v1.md` for the complete reference.

**Key Tokens:**
- Primary: brand-600 (#3B5CE9)
- Accent: accent-600 (#00A485)
- Neutrals: 0-950 warm gray scale
- Font: Inter
- Border radius: 12px for cards
- Icons: Lucide React exclusively

---

## Summary

Google-level design means:

1. **Clarity**: Users never guess what to do
2. **Consistency**: Same problem, same solution
3. **Accessibility**: Works for everyone
4. **Performance**: Fast is a feature
5. **Delight**: Small touches that feel good
6. **Restraint**: Every element earns its place

Design serves the user. Every pixel has a purpose.
