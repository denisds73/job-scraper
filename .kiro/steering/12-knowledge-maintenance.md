# Knowledge Maintenance: Keeping Context Current

This document defines when and how to update the knowledge base to ensure the agent always has current code context.

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
