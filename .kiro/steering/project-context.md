# JobScout Steering Files Index

This directory contains comprehensive guidance for building JobScout with Google-level engineering standards.

## File Index

| File | Purpose |
|------|---------|
| `01-core-identity.md` | Google engineering mindset and principles |
| `02-ui-ux-standards.md` | UI/UX design principles and patterns |
| `03-frontend-implementation.md` | React/Next.js architecture and best practices |
| `04-tech-stack-context.md` | Technology decisions and constraints |
| `05-coding-standards.md` | Code quality and conventions |
| `06-product-context.md` | Complete product specification |
| `07-project-structure.md` | Codebase organization |
| `08-problem-solving.md` | Engineering problem-solving approach |
| `09-communication.md` | Technical communication standards |
| `10-anti-patterns.md` | What NOT to do |
| `11-review-checklist.md` | Quality gates and checklists |
| `12-knowledge-maintenance.md` | When/how to update knowledge base |

## Quick Reference

### Core Constraints
- **Zero cost**: All services must fit in free tiers
- **No emojis**: Use Lucide icons exclusively
- **Design tokens LOCKED**: See `docs/DESIGN_SYSTEM_v1.md`

### Tech Stack
- Frontend: Next.js 14 + TypeScript + Tailwind (Vercel)
- API: Fastify + Prisma (Railway)
- Database: Neon PostgreSQL
- Cache: Upstash Redis
- Storage: Cloudflare R2
- Cron: GitHub Actions

### Design Tokens
- Primary: `brand-600` (#3B5CE9)
- Accent: `accent-600` (#00A485)
- Font: Inter
- Card radius: 12px
- Icons: Lucide React only

## How to Use These Files

1. **Starting a new feature**: Read `06-product-context.md` for requirements
2. **Writing code**: Follow `05-coding-standards.md` and `03-frontend-implementation.md`
3. **Designing UI**: Reference `02-ui-ux-standards.md`
4. **Stuck on a problem**: Use `08-problem-solving.md` framework
5. **Before committing**: Run through `11-review-checklist.md`
6. **What to avoid**: Check `10-anti-patterns.md`

Every file in this directory is loaded automatically by Kiro CLI at the start of each session.
