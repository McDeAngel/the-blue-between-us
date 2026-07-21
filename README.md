# The Blue Between Us

An interactive love-story game made by Marc Ramon Emmanuel C. De Angel for Shekinah T. Rosete.

It is an entirely frontend experience: no database, accounts, private keys, or backend services. Progress is saved only in the visitor's browser.

## The journey

- Align two timelines from December 28, 2025
- Match the "twin frequencies"
- Restore the signal through healthier choices
- Bloom a garden of six white lilies
- Open future letters for Bogart and Jelly Bean
- Unlock Marc's final poem for Shekinah

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Import this GitHub repository in Vercel.
2. Keep the detected framework as **Next.js**.
3. Leave all environment variables empty—none are needed.
4. Click **Deploy**.

The production build is statically exported, so every part of the game runs in the browser.

## Build and test

```bash
pnpm build
node --test tests/rendered-html.test.mjs
```
