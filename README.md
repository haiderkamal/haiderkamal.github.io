# haiderkamal.github.io

Personal portfolio — **[haiderkamal.github.io](https://haiderkamal.github.io)**

AI, computer vision and immersive-systems engineering, plus nine years of Unity game development.
Hand-built: no framework, no build step, no dependencies. Edit a file, push, it's live.

---

## How to change things

**All content lives in one file: [`assets/js/data.js`](assets/js/data.js).**
Projects, games, skills, the timeline, the marquee and the rotating job titles are plain
JavaScript arrays there. You almost never need to touch `index.html`.

```
index.html            structure + SEO meta only
assets/js/data.js     ← every piece of content
assets/js/main.js     rendering + interactions
assets/css/style.css  all styling
assets/img/           project imagery (WebP)
assets/video/         demo videos (drop files here)
assets/Haider-Kamal-Resume.pdf
```

### Adding a demo video

Every project and game has a `video:` field. Three options:

```js
// 1. No video yet — renders a "drop your file here" placeholder
video: null

// 2. A file in this repo (keep it under ~20 MB; GitHub hard-caps files at 100 MB)
video: { type: 'file', src: 'assets/video/brawldinos.mp4' }

// 3. YouTube — best for anything long or large. Unlisted videos work fine.
video: { type: 'youtube', id: 'dQw4w9WgXcQ' }   // the id from the watch?v= URL
```

Each placeholder on the live site prints the exact filename it's expecting, so you can
match names without reading the code.

**Compressing a clip before committing** (needs ffmpeg):

```bash
ffmpeg -i raw-capture.mp4 -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 26 \
       -preset slow -movflags +faststart -c:a aac -b:a 96k assets/video/brawldinos.mp4
```

### Adding a project

Copy any object in `AI_PROJECTS` and edit it. The shape:

| Field | Notes |
|---|---|
| `slug` | unique, used by the modal |
| `groups` | any of `cv`, `twin`, `xr`, `genai` — drives the filter chips |
| `accent` | hex colour; themes the whole card and modal |
| `img` | 16:9 WebP in `assets/img/` |
| `metrics` *or* `capabilities` | KPI tiles or feature cards |
| `steps` | numbered "how it works" flow (optional) |
| `impact` | outcome cards (optional) |
| `stack` | first 3 show on the card, all show in the modal |

The filter chip counts update themselves.

---

## Running it locally

No build step — but open it through a server, not `file://`, or the browser will block
the module-less scripts on some setups:

```bash
python -m http.server 8000
# → http://localhost:8000
```

## Deploying

Push to `main`. GitHub Pages rebuilds in under a minute.

```bash
git add -A && git commit -m "Update content" && git push
```

`.nojekyll` is present so Pages serves the files as-is without running Jekyll over them.

---

## Notes on the content

The seven AI products are work done at **Ideofuzion**, described here at the level of
detail that appears in the public product decks. Client names and deployment specifics are
deliberately left out.
