# GCI – AI Marketing

A mobile app prototype for nail salon owners to create SMS/Email marketing campaigns in minutes — powered by AI.

## Overview

Salon owners often don't have time to plan marketing. This tool lets them go from idea to approved campaign in 3 steps, with AI handling the copy, timing, and audience targeting.

**3-step flow:**
1. **Start** — Pick a quick-start template or describe your goal
2. **Campaign** — AI generates a full campaign draft with estimated income
3. **Approve** — Review details and launch

## Features

- AI-generated campaign drafts with one tap
- Estimated income projection (based on salon's historical data)
- SMS + Email message preview with regenerate
- Inline AI editing via chat — type to refine the campaign
- Save to Draft and resume later
- AI Revise chat for deeper edits

## Tech

Vanilla HTML, CSS, JavaScript — no framework, no build step.

```
index.html      # App shell
css/style.css   # All styles
js/script.js    # Navigation + mock interactions
```

## Run locally

Just open `index.html` in a browser — no server needed.

```bash
open index.html
```

## Deploy

Hosted on GitHub Pages. Push to `main` and it goes live automatically.

**Setup (first time):**
1. Go to repo Settings → Pages
2. Source: `main` branch, root `/`
3. Save — live at `https://<username>.github.io/<repo>/`
