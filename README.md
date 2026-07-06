# jasoncarlson.org

My personal research site. Built with React + TypeScript + Vite and deployed
to GitHub Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build
```

## Editing content

All copy and links live in **`src/data/content.ts`** — bio, research items,
the GarryChess sub-papers and their status, publications, experience,
education, projects, and profile links. Update a paper's `status`
(`published` | `in-submission` | `in-preparation`) and the timeline and pills
update automatically.

- Design tokens: `src/styles/index.css`
- Component styles: `src/styles/components.css`
- CV PDF served by the site: `public/cv.pdf`

Blog posts live in `public/blog_posts/<slug>/post.md` (markdown with KaTeX
math; figures in a `figures/` subfolder) and are registered in
**`src/data/blog.ts`** — one entry with slug, title, date, and summary.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to GitHub Pages. `public/CNAME` pins the custom domain.

## License

The source code of this site is licensed under Apache 2.0 (see `LICENSE`).
Site **content** is not: everything under `public/blog_posts/` (post text,
figures, and animations), `public/cv.pdf`, and the copy in
`src/data/content.ts` is © Jason Carlson, all rights reserved. Please don't
republish it without permission.
