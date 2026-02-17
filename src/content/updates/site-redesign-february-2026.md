---
title: "Site Redesign: Built with Agentic Coding"
published: 2026-02-17T11:00:00Z
type: post
tags: ["website", "ai", "community"]
---

We're excited to share that the Bière & Code website has received a comprehensive redesign! But what's more interesting than the new look is *how* it was built.

## Agentic Coding in Action

This entire redesign ([PR #25](https://github.com/bierecode/bierecode/pull/25)) was created using **agentic coding** - a collaborative approach where AI agents handle the heavy lifting of software development while humans provide direction and make key decisions.

### What is Agentic Coding?

Unlike traditional AI coding assistants that simply autocomplete your code, agentic coding tools can:
- Autonomously explore codebases to understand existing patterns
- Plan and execute multi-step implementations
- Iterate on designs based on feedback
- Handle everything from design exploration to testing and deployment

Think of it as having a skilled developer who can work through complex tasks independently, but always checks in with you on important decisions.

## Built with SAM & Claude Code

The redesign was built using **Claude Code** (Anthropic's agentic coding tool) through [SAM (Simple Agent Manager)](https://github.com/raphaeltm/simple-agent-manager), a project by Raph (founder of Bière & Code).

SAM provides a clean web interface for Claude Code, making it easy to:
- Give high-level direction ("redesign the site with a warmer aesthetic")
- Review and approve proposed changes
- Iterate quickly without getting bogged down in implementation details
- Maintain full control while letting the AI handle the tedious work

### The Process

Here's how the redesign unfolded:

1. **Initial Direction**: "Redesign the site inspired by beingnbecoming.org"
2. **Exploration**: Claude Code analyzed the existing site structure and the inspiration source
3. **Planning**: Proposed a comprehensive plan covering colors, typography, layout, and content
4. **Implementation**: Autonomously implemented changes across 12 files (1,300+ line changes)
5. **Iteration**: Refined based on feedback across 4 commits
6. **This Post**: Even this announcement was written by Claude Code!

All while maintaining git history, running tests, and following best practices.

## Why This Matters

Agentic coding isn't about replacing developers - it's about amplifying what they can accomplish. With tools like SAM and Claude Code:
- Solo developers can execute ambitious projects
- Design iterations that would take hours happen in minutes
- More time for creative decisions, less time on repetitive implementation
- The codebase stays clean because the AI follows your project's conventions

## What's Next?

The new design is live! But more importantly, we're excited to explore how agentic coding can help us build more features faster while maintaining quality.

Interested in learning more about agentic coding, SAM, or Claude Code? Come chat about it at our next meetup over a beer!

---

*Interested in how we built this? Ask us at the next meetup about SAM and Claude Code, or check out the [pull request](https://github.com/bierecode/bierecode/pull/25) for all the details!*
