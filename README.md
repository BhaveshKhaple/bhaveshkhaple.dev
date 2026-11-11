# Bhavesh Khaple

Personal site for Bhavesh Khaple, a final-year B.Tech student in AI & Data Science at MIT Chhatrapati Sambhajinagar. It is a static Vite + React app, ready to host later on GitHub Pages or Vercel. Nothing here is deployed.

## Run it

```bash
npm install
npm run dev
```

The dev server listens on port 4731. Open [http://127.0.0.1:4731](http://127.0.0.1:4731).

```bash
npm run build
npm run preview
```

`npm run build` typechecks and writes `dist/`.

## Domain

`CNAME` at the repo root and `public/CNAME` both contain `YOUR-DOMAIN.example`. The public file is copied into `dist/` on build. Replace that placeholder with the real hostname before pointing DNS at the host. No domain was found for this site.

## Hosting later

- **Vercel:** import the repo. Vite is detected. The build command is `npm run build` and the output is `dist`.
- **GitHub Pages:** build, then publish the `dist` folder (or set the Pages source to a workflow that uploads `dist`). Custom-domain deploys and user sites both use the site root, so the Vite `base` stays `/`.

## Photo

The portrait is `src/assets/speaking-podium.jpg` when that file is present. It is the only photo the page will request.
