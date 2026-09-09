# Problem Solving: Engineering Approach

This document defines how to approach problems systematically. Great engineers don't just write code—they solve problems. The code is just the implementation.

---

## Core Philosophy

### 1. Understand Before You Build

The worst engineering sin is building the wrong thing efficiently.

**Before writing any code:**
- What problem are we solving?
- Who has this problem?
- How are they solving it today?
- Why is the current solution inadequate?
- What does success look like?

### 2. Simple First, Optimize Later

> "Make it work, make it right, make it fast." — Kent Beck

1. **Make it work**: Simplest solution that solves the problem
2. **Make it right**: Clean up, refactor, test
3. **Make it fast**: Optimize only if measured performance is inadequate

### 3. Reversibility Over Perfection

Prefer decisions that are easy to reverse over decisions that are "perfect."

- **Easy to reverse**: Feature flag, config change, new file
- **Hard to reverse**: Database migration, public API change, architectural shift

For reversible decisions, decide quickly. For irreversible decisions, gather more information.

---

## Problem-Solving Framework

### Step 1: Define the Problem

Before anything else, write down the problem statement.

**Bad problem statement:**
> "The search is slow."

**Good problem statement:**
> "Search queries for common terms (e.g., 'software engineer') take 3-5 seconds to return results. Our target is <500ms. This affects ~40% of searches and is the top user complaint in feedback."

**Template:**
```
PROBLEM: [What's happening]
IMPACT: [Who is affected and how]
MEASUREMENT: [How we know it's a problem - data]
GOAL: [What "solved" looks like]
```

### Step 2: Gather Context

Don't assume you understand the full picture.

**Questions to ask:**
- When did this start?
- Has anything changed recently?
- What have we already tried?
- Are there related issues?
- What are the constraints (time, resources, technical)?

**Information to gather:**
- Logs and metrics
- User feedback
- Related code changes
- Previous attempts to solve
- Similar problems elsewhere

### Step 3: Generate Options

Never implement the first idea. Generate at least 3 options.

**Brainstorming rules:**
- No idea is too simple
- No idea is too complex (yet)
- Quantity over quality initially
- Don't evaluate while generating

**For each option, note:**
- Effort (hours/days)
- Risk
- Reversibility
- Dependencies
- Side effects

### Step 4: Evaluate Trade-offs

Every solution has costs. Make them explicit.

**Trade-off matrix:**
```
| Option | Effort | Risk | Maintainability | Performance |
|--------|--------|------|-----------------|-------------|
| A      | Low    | Med  | High            | Medium      |
| B      | High   | Low  | Medium          | High        |
| C      | Med    | High | Low             | High        |
```

**Common trade-offs:**
- Build time vs. runtime performance
- Simplicity vs. flexibility
- Speed vs. quality
- Now vs. later
- Local optimization vs. global optimization

### Step 5: Decide and Commit

Pick an option based on context, not absolute "best."

**Decision factors:**
- Time pressure: How soon do we need this?
- Reversibility: Can we change our mind?
- Team capability: Do we have the skills?
- Dependencies: Are we blocking others?
- Risk tolerance: What if this fails?

**Decision record:**
```
DECISION: Implement Option B
RATIONALE: Higher effort but significantly lower risk,
           and performance is our primary constraint.
ALTERNATIVES CONSIDERED: A (too risky), C (too complex)
CONSEQUENCES: Will need to refactor X later.
```

### Step 6: Implement Incrementally

Don't try to solve everything at once.

**Incremental approach:**
1. Break the solution into small, testable steps
2. Implement the riskiest/most uncertain part first
3. Verify each step before moving to the next
4. Adjust plan based on what you learn

**Each increment should:**
- Be deployable independently
- Have tests
- Be reviewed before moving on
- Take no more than 1-2 days

### Step 7: Verify and Measure

How do you know the problem is solved?

**Verification checklist:**
- [ ] Does it solve the original problem?
- [ ] Do the tests pass?
- [ ] Does it meet the performance target?
- [ ] Does it introduce new problems?
- [ ] Does it work in production (not just locally)?

**Post-implementation:**
- Monitor metrics
- Gather user feedback
- Document what you learned
- Share with the team

---

## Debugging Approach

### The Scientific Method

Debugging is hypothesis testing.

```
1. OBSERVE: What's happening? (Logs, errors, behavior)
2. HYPOTHESIZE: What could cause this?
3. PREDICT: If hypothesis is true, what else would be true?
4. TEST: Verify the prediction
5. REPEAT: If wrong, form new hypothesis
```

### Common Debugging Tactics

**Binary search:**
- Problem somewhere in the system
- Eliminate half the possibilities with each test
- Works for: Commit bisecting, log searching, code sections

**Change one thing at a time:**
- Isolate variables
- Revert if change doesn't help
- Document each attempt

**Reproduce first:**
- Can't fix what you can't reproduce
- Understand exact conditions
- Create minimal reproduction

**Read the error message:**
- Seriously, read it completely
- Check line numbers
- Google the exact message

**Rubber duck debugging:**
- Explain the problem out loud
- Step through the code verbally
- Often reveals the issue

### When You're Stuck

1. **Take a break**: Walk away for 10 minutes
2. **Explain to someone**: Rubber duck or colleague
3. **Simplify**: Remove complexity until it works
4. **Start fresh**: Delete and rewrite from scratch
5. **Sleep on it**: Your brain processes overnight
6. **Ask for help**: Fresh eyes see different things

---

## Handling Uncertainty

### When Requirements Are Unclear

Don't guess. Clarify.

**Ask:**
- What's the user trying to accomplish?
- What's the priority?
- What are the constraints?
- What's the deadline?
- Who decides if this is done?

**If you can't get clarity:**
- State your assumptions explicitly
- Build the simplest version
- Get feedback quickly
- Iterate based on response

### When the Technical Path Is Unclear

Prototype before committing.

**Spike approach:**
1. Time-box exploration (e.g., 4 hours)
2. Build throwaway code to learn
3. Document findings
4. Make informed decision
5. Build production version from scratch

**Questions to answer:**
- Is this technically feasible?
- What are the unknown unknowns?
- What will be hard?
- What tools/libraries exist?

### When You Don't Know How to Do Something

Learning is part of the job.

**Efficient learning:**
1. Read official docs first (not blog posts)
2. Find a minimal working example
3. Modify it to understand behavior
4. Apply to your specific problem
5. Document what you learned

**Red flags you're learning wrong:**
- Copy-pasting without understanding
- Stack Overflow answers you can't explain
- Giving up after first failure
- Not reading error messages

---

## Working with Complexity

### Breaking Down Large Problems

**Decomposition strategies:**
- **By feature**: Separate user-facing capabilities
- **By layer**: UI, API, data, infrastructure
- **By dependency**: What needs to exist first?
- **By risk**: Tackle uncertain parts early
- **By user**: Different user paths/personas

**Good decomposition:**
- Each part can be worked on independently
- Each part can be tested independently
- Each part has clear boundaries
- Dependencies flow in one direction

### Managing Technical Debt

Technical debt is real. Manage it, don't ignore it.

**When to incur debt:**
- Clear deadline pressure
- Throwaway prototype
- Learning/exploration
- Business need outweighs technical cost

**When to pay it down:**
- Before it spreads (early)
- When you're in the area anyway
- When it's blocking new features
- When you have slack time

**Document debt:**
```
// TODO: This is O(n²) because we loop through all jobs
// for each filter. Fine for <1000 jobs, need to optimize
// if we grow beyond that. Estimated: 2 hours.
// Issue: #123
```

---

## Collaboration

### Asking for Help

Asking for help is a skill, not a weakness.

**Before asking:**
- [ ] I've tried to solve it myself
- [ ] I've read the error messages
- [ ] I've checked the documentation
- [ ] I can explain what I've tried
- [ ] I have a specific question

**Good help request:**
```
I'm trying to: [goal]
I expected: [expected behavior]
What happens: [actual behavior]
I've tried: [list of attempts]
I think the problem might be: [hypothesis]
Here's the relevant code: [link or snippet]
```

**Bad help request:**
```
The search doesn't work. Can you fix it?
```

### Code Reviews

Every review is a learning opportunity.

**As the author:**
- Self-review before requesting
- Provide context in the PR description
- Respond to every comment
- Don't take feedback personally

**As the reviewer:**
- Be kind, be specific
- Ask questions rather than demand
- Acknowledge what's done well
- Focus on substance, not style

### Pair Programming

Two heads are better than one.

**When to pair:**
- Complex or high-risk changes
- Knowledge transfer needed
- Stuck after trying solo
- Critical production issues

**How to pair effectively:**
- Rotate driver/navigator roles
- Think out loud
- Take breaks
- Share the keyboard (literally or virtually)

---

## Decision Making

### Reversible vs. Irreversible

**Reversible (decide fast):**
- Feature implementation approach
- Variable naming
- File organization
- Local refactoring
- Trying a new library

**Irreversible (decide carefully):**
- Database schema changes
- Public API contracts
- Architectural patterns
- Technology choices
- Team structure

### When to Stop Iterating

**Ship when:**
- Core use case works
- No known critical bugs
- Performance is acceptable
- Code is tested
- Documentation exists

**Don't ship when:**
- You're embarrassed by the code
- You know of critical bugs
- Performance is unusable
- No tests exist
- No documentation exists

**Keep iterating if:**
- Clear improvement with reasonable effort
- User feedback requires changes
- Discovered issues during testing

---

## Learning from Failure

### Post-Mortems

Every significant failure deserves a post-mortem.

**Post-mortem template:**
```
INCIDENT: [Brief description]
IMPACT: [Who was affected, how long]
TIMELINE: [What happened, when]
ROOT CAUSE: [Why it happened]
CONTRIBUTING FACTORS: [What made it worse]
RESOLUTION: [How it was fixed]
PREVENTION: [How to avoid in future]
ACTION ITEMS: [Specific tasks, owners, deadlines]
```

**Post-mortem rules:**
- Blameless (focus on systems, not people)
- Timely (within a week of incident)
- Thorough (understand root cause)
- Actionable (specific improvements)
- Shared (entire team learns)

### Continuous Improvement

**Weekly reflection:**
- What went well?
- What could be better?
- What did I learn?
- What will I try differently?

**Per-project reflection:**
- Did we solve the right problem?
- Was our approach effective?
- What would we do differently?
- What should we share with others?

---

## Summary

Great problem solving means:

1. **Understand first**: Don't build until you know what and why
2. **Generate options**: First idea is rarely best
3. **Explicit trade-offs**: Every choice has costs
4. **Incremental delivery**: Small steps, frequent validation
5. **Measure success**: Data over intuition
6. **Learn continuously**: Every problem teaches something

The goal isn't to never fail—it's to fail fast, learn, and improve.
