# Mandatory Verification: Zero Tolerance for Broken Code

This document defines mandatory verification steps that MUST be performed after every code change. No exceptions.

---

## Core Principle

**Code that doesn't compile, lint, or pass tests is NOT acceptable.**

Every code change must be verified before presenting to the user. This is not optional.

---

## Mandatory Verification After Every Change

### After EVERY File Creation or Modification

The agent MUST run these checks:

```
1. TypeScript Compile Check
2. Lint Check  
3. Build Check (if applicable)
4. Test Check (if tests exist)
```

### Verification Commands

**For packages/web (Next.js):**
```bash
cd packages/web && npm run typecheck   # TypeScript
cd packages/web && npm run lint        # ESLint
cd packages/web && npm run build       # Next.js build
cd packages/web && npm run test        # Tests (if exist)
```

**For packages/api (Fastify):**
```bash
cd packages/api && npm run typecheck   # TypeScript
cd packages/api && npm run lint        # ESLint
cd packages/api && npm run build       # Compile
cd packages/api && npm run test        # Tests
```

**For packages/scraper:**
```bash
cd packages/scraper && npm run typecheck
cd packages/scraper && npm run lint
cd packages/scraper && npm run build
cd packages/scraper && npm run test
```

**For current ui-samples (until migration):**
```bash
cd ui-samples && npx next build 2>&1 | tail -30   # Build check
cd ui-samples && npx tsc --noEmit                  # Type check
```

---

## When to Verify

### ALWAYS Verify After:

| Action | Verification Required |
|--------|----------------------|
| Creating a new file | TypeScript + Lint + Build |
| Modifying existing code | TypeScript + Lint + Build |
| Adding a dependency | Build + Test |
| Changing configuration | Build + Test |
| Refactoring | TypeScript + Lint + Build + Test |
| Fixing a bug | Build + Test (including new test for bug) |
| Completing a feature | Full verification suite |

### Verification Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERIFICATION SEQUENCE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. TYPECHECK                                                   │
│     └─ Does TypeScript compile without errors?                  │
│        ├─ YES → Continue                                        │
│        └─ NO  → FIX BEFORE PROCEEDING                          │
│                                                                 │
│  2. LINT                                                        │
│     └─ Does ESLint pass?                                        │
│        ├─ YES → Continue                                        │
│        └─ NO  → FIX BEFORE PROCEEDING                          │
│                                                                 │
│  3. BUILD                                                       │
│     └─ Does the project build successfully?                     │
│        ├─ YES → Continue                                        │
│        └─ NO  → FIX BEFORE PROCEEDING                          │
│                                                                 │
│  4. TEST                                                        │
│     └─ Do all tests pass?                                       │
│        ├─ YES → Continue                                        │
│        └─ NO  → FIX BEFORE PROCEEDING                          │
│                                                                 │
│  5. PRESENT TO USER                                             │
│     └─ Only after ALL checks pass                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Handling Protocol

### When Verification Fails

1. **DO NOT** present broken code to the user
2. **DO NOT** move on to the next task
3. **DO** fix the error immediately
4. **DO** re-run verification after fix
5. **DO** repeat until all checks pass

### Common Error Categories

**TypeScript Errors:**
```
- Type mismatch: Fix the type
- Missing import: Add the import
- Unknown property: Check spelling or add to interface
- Cannot find module: Install dependency or fix path
```

**Build Errors:**
```
- Module not found: Check import paths
- Syntax error: Fix the syntax
- Missing dependency: npm install
- Configuration error: Check config files
```

**Lint Errors:**
```
- Unused variable: Remove or use it
- Missing semicolon: Add it (or configure rule)
- Incorrect formatting: Run prettier
```

---

## Verification Report Format

After verification, report to user:

### On Success:
```
✓ TypeScript: No errors
✓ Lint: No warnings
✓ Build: Successful
✓ Tests: 15 passed

[Present the completed work]
```

### On Failure (Before Fixing):
```
✗ Build failed with error:
  [error message]

Fixing now...
```

### On Failure (After Fixing):
```
✗ Initial build failed: [brief error]
✓ Fixed: [what was fixed]
✓ Verification passed

[Present the completed work]
```

---

## Pre-Commit Checklist

Before ANY commit:

- [ ] `npm run typecheck` passes (0 errors)
- [ ] `npm run lint` passes (0 errors)
- [ ] `npm run build` succeeds
- [ ] `npm run test` passes (if tests exist)
- [ ] Manual smoke test (if UI change)
- [ ] No `console.log` statements
- [ ] No commented-out code
- [ ] No `any` types (unless justified)
- [ ] No hardcoded secrets

---

## Production Readiness

### Definition of "Production Ready"

Code is production ready when:

1. **Zero TypeScript errors** - Strict mode enabled
2. **Zero lint errors** - ESLint rules enforced
3. **Build succeeds** - No compilation failures
4. **Tests pass** - All existing tests green
5. **No runtime errors** - Tested in browser/runtime
6. **Error handling exists** - Try/catch, error boundaries
7. **Loading states exist** - No blank screens
8. **Edge cases handled** - Null, empty, error states

### Before Marking Phase Complete

Run full verification:

```bash
# Full monorepo check
npm run typecheck      # All packages
npm run lint           # All packages  
npm run build          # All packages
npm run test           # All packages
npm run e2e            # If E2E tests exist
```

---

## Quick Verification Commands

### Single Command Verification

Add to root `package.json`:

```json
{
  "scripts": {
    "verify": "npm run typecheck && npm run lint && npm run build && npm run test",
    "verify:quick": "npm run typecheck && npm run lint",
    "verify:full": "npm run verify && npm run e2e"
  }
}
```

### Usage

```bash
npm run verify:quick   # After small changes
npm run verify         # After feature complete
npm run verify:full    # Before release/phase complete
```

---

## Summary

**Three absolute rules:**

1. **NEVER present broken code** - Always verify first
2. **FIX before proceeding** - Don't accumulate errors
3. **VERIFY before committing** - Gate all commits

**The sequence:**

```
Code → TypeCheck → Lint → Build → Test → Present
         ↑___________FIX______________|
```

Broken code is not "almost done." It's not done.
