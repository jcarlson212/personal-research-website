# jasoncarlson.org

Personal research website for Jason Carlson — ML Research Engineer.
Built with React + TypeScript + Vite, deployed to GitHub Pages on the
custom domain **jasoncarlson.org** (registered through Cloudflare).

## Stack

- **React 18** + **TypeScript** (strict)
- **Vite 5** build
- No UI framework — a hand-rolled, tokenized design system
  (`src/styles/index.css` tokens, `src/styles/components.css` components)
- All copy/links live in one file: **`src/data/content.ts`**

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build
```

## Editing content

Everything you'd normally want to change — bio, research items, the
GarryChess sub-papers and their status, publications, experience,
education, projects, and links — is in `src/data/content.ts`. Update a
paper's `status` (`published` | `in-submission` | `in-preparation`) and the
timeline and pills update automatically.

The CV PDF served by the "Curriculum vitae" button is `public/cv.pdf`.

## Deployment (GitHub Pages + GitHub Actions)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
site and publishes `dist/` to GitHub Pages. `public/CNAME` pins the custom
domain.

One-time setup:

1. Create a GitHub repo and push this code to `main`.
2. In the repo: **Settings → Pages → Build and deployment → Source =
   GitHub Actions**.
3. After the first successful deploy, set **Settings → Pages → Custom
   domain = `jasoncarlson.org`** and enable **Enforce HTTPS**.

## Cloudflare DNS (apex domain → GitHub Pages)

In the Cloudflare dashboard for `jasoncarlson.org`, add these records.
Set them to **DNS only (grey cloud, not proxied)** so GitHub can provision
its TLS certificate:

| Type | Name | Value |
| ---- | ---- | ----- |
| A    | @    | 185.199.108.153 |
| A    | @    | 185.199.109.153 |
| A    | @    | 185.199.110.153 |
| A    | @    | 185.199.111.153 |
| AAAA | @    | 2606:50c0:8000::153 |
| AAAA | @    | 2606:50c0:8001::153 |
| AAAA | @    | 2606:50c0:8002::153 |
| AAAA | @    | 2606:50c0:8003::153 |
| CNAME | www | `<your-github-username>.github.io` |

Notes:
- The four A / four AAAA records are GitHub Pages' published apex IPs.
- Keep records **unproxied** (grey cloud) until GitHub shows the
  certificate as issued; you can re-enable the proxy afterward if you set
  Cloudflare SSL/TLS mode to **Full**.
- DNS can take a few minutes to an hour to propagate.

---

Built with React. Generated with [Claude Code](https://claude.com/claude-code).
