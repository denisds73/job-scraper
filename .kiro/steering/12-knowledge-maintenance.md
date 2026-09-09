# Knowledge Maintenance: Keeping Context Current

This document defines when and how to update the knowledge base and implementation plan to ensure the agent always has current project context.

---

## Implementation Plan Tracking

### CRITICAL RULE

**The source of truth for project status is `docs/IMPLEMENTATION_PLAN.md`.**

- NEVER assume project status - always check the implementation plan
- ALWAYS update the plan when phases or tasks are completed
- ALWAYS reference this file when asked about project status

### When to Update Implementation Plan

After completing any phase, milestone, or significant task:

1. Open `docs/IMPLEMENTATION_PLAN.md`
2. Mark completed items with `[x]` instead of `[ ]`
3. Add completion date if relevant
4. Update the "Current State Analysis" section if status changed
5. Update the knowledge base to reflect changes

### Marking Progress

```markdown
## Before:
- [ ] Initialize Turborepo

## After:
- [x] Initialize Turborepo (Completed: 2024-01-15)
```

### Phase Completion Checklist

When a phase is completed:

1. Mark ALL tasks in that phase as `[x]`
2. Mark ALL deliverables as `[x]`
3. Add a completion note at the top of the phase section:
   ```markdown
   ## Phase 0: Foundation
   **Status: COMPLETE** (Completed: 2024-01-15)
   ```
4. Update knowledge base: `knowledge update for project-docs`
5. Announce completion to user

---

## Knowledge Base Structure

| Name | Path | Contains |
|------|------|----------|
| `ui-components` | `./ui-samples/components` | React components (Button, Card, JobCard, etc.) |
| `ui-pages` | `./ui-samples/pages` | Next.js pages (Home, Search, Job Detail) |
| `project-docs` | `./docs` | Design system, tech stack, API docs |

---

## When to Update Knowledge Base

### ALWAYS Update After:

1. **New Component Created**
   - Added a new component file
   - Created a new component directory

2. **New Page Created**
   - Added a new page route
   - Created new page component

3. **Major Component Changes**
   - Significant refactoring of existing component
   - Changed component props/interface
   - Added/removed major functionality

4. **New Feature Implemented**
   - Feature spanning multiple files
   - New functionality added to existing components

5. **Documentation Updated**
   - Design system changes
   - New documentation files
   - Tech stack updates

6. **File Structure Changes**
   - Renamed files or directories
   - Moved components to new locations
   - Deleted obsolete files

---

## How to Update

### Agent Auto-Update Rule

**After completing any task that modifies code in the knowledge base paths, the agent MUST run:**

```
knowledge update for ui-components: ./ui-samples/components
knowledge update for ui-pages: ./ui-samples/pages  
knowledge update for project-docs: ./docs
```

Only update the knowledge bases affected by the changes:
- Changed components → Update `ui-components`
- Changed pages → Update `ui-pages`
- Changed docs → Update `project-docs`

### Update Command Reference

```typescript
// Update components
{ command: "update", name: "ui-components", path: "./ui-samples/components" }

// Update pages
{ command: "update", name: "ui-pages", path: "./ui-samples/pages" }

// Update docs
{ command: "update", name: "project-docs", path: "./docs" }
```

---

## Adding New Knowledge Bases

When new directories with significant code are created (e.g., `packages/api`, `packages/scraper`), add them to the knowledge base:

```typescript
// Add new knowledge base
{ command: "add", name: "api-code", value: "./packages/api" }
{ command: "add", name: "scraper-code", value: "./packages/scraper" }
```

### Planned Knowledge Bases (Add When Created)

| Name | Path | When to Add |
|------|------|-------------|
| `api-code` | `./packages/api` | When API package is created |
| `scraper-code` | `./packages/scraper` | When scraper package is created |
| `shared-code` | `./packages/shared` | When shared package is created |
| `prisma-schema` | `./prisma` | When database schema is created |

---

## Verification

After updating, verify the knowledge base is current:

```typescript
{ command: "show" }
```

Check that:
- Item counts reflect expected file counts
- No "Failed" status
- Recently modified files are included

---

## Automatic Triggers

The agent should automatically update knowledge base when:

- [ ] Task completion message mentions: "created", "added", "implemented", "built"
- [ ] Files modified in: `./ui-samples/components/**`
- [ ] Files modified in: `./ui-samples/pages/**`
- [ ] Files modified in: `./docs/**`
- [ ] User says: "update knowledge", "refresh context", "sync code"

---

## Summary

**Rule: After any significant code change, update the affected knowledge base.**

This ensures the agent always has accurate, current context about:
- What components exist and how they work
- What pages exist and their structure
- What documentation and standards apply

Never assume knowledge base is current. When in doubt, update.

---

## Project Status Reference

### ALWAYS Check Before Answering

When asked about:
- "What is the project status?"
- "What phase are we on?"
- "What's completed?"
- "What's next?"
- "Where did we leave off?"

**DO NOT ASSUME. Read `docs/IMPLEMENTATION_PLAN.md` first.**

### How to Check Status

```typescript
// Read the implementation plan
{ mode: "Line", path: "./docs/IMPLEMENTATION_PLAN.md" }

// Or search knowledge base
{ command: "search", query: "phase status complete", context_id: "project-docs" }
```

### Status Response Format

When reporting status, always include:
1. Current phase and its status
2. Completed phases (with dates if available)
3. Next immediate task
4. Any blockers

Example:
```
**Current Status:**
- Phase 0 (Foundation): COMPLETE
- Phase 1 (Data Layer): IN PROGRESS (60%)
- Next Task: Create Prisma schema
- Blockers: None
```

---

## Summary

**Three critical rules:**

1. **Implementation Plan is source of truth** - Always check `docs/IMPLEMENTATION_PLAN.md`
2. **Update on completion** - Mark tasks/phases complete immediately
3. **Sync knowledge base** - Update after any significant changes

Never guess project status. Always verify.
