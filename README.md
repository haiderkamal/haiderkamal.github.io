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

Every project and game has a `videos:` list, so one project can carry several
clips — the case study then gets a switcher between them.

```js
videos: []                                                    // no clip: no media block is rendered

videos: [{ type: 'youtube', id: 'NIzQfM4HnCs', label: 'System overview' }]

videos: [                                                     // two clips -> switcher appears
  { type: 'youtube', id: 'NIzQfM4HnCs', label: 'System overview' },
  { type: 'youtube', id: 'GhStNbrziKE', label: 'Retail deployment' }
]

videos: [{ type: 'file', src: 'assets/video/demo.mp4', label: 'Demo' }]
```

The `id` is the part after `watch?v=` or `youtu.be/`.

**Vertical clips (YouTube Shorts)** take `portrait: true` and render in a
phone-shaped 9:16 frame instead of being pillarboxed into 16:9:

```js
{ type: 'youtube', id: 'ze9Z9zH86p0', label: 'PvP gameplay',
  portrait: true, poster: 'assets/img/brawldinos-1.webp' }
```

**Nothing loads from YouTube until someone presses play.** Each clip shows a
local poster with a play button, and the real player only replaces it on click
— so embeds cost nothing on page load. Landscape clips fall back to the
project's slide image as the poster; for portrait ones, give an explicit
`poster`. To grab a Short's real vertical thumbnail:

```bash
curl -o /tmp/s.jpg "https://i.ytimg.com/vi/<ID>/oardefault.jpg"
ffmpeg -i /tmp/s.jpg -vf "scale=540:-2:flags=lanczos" -q:v 78 assets/img/<name>.webp
```

**Self-hosted files** work too, but keep them under ~20 MB (GitHub hard-caps
files at 100 MB and Pages is not a video host). To compress:

```bash
ffmpeg -i raw-capture.mp4 -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 26        -preset slow -movflags +faststart -c:a aac -b:a 96k assets/video/clip.mp4
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
