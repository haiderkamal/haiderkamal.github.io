/* ============================================================
   Content source of truth.
   Edit this file to change the site — nothing else needs touching.

   Adding a demo video to a project — `videos` is a list, so a project
   can carry more than one and the case study gets a clip switcher:
     videos: [{ type: 'youtube', id: 'YOUTUBE_ID', label: 'Overview' }]
     videos: [{ type: 'file', src: 'assets/video/demo.mp4', label: 'Demo' }]
   Add `portrait: true` for a vertical clip (a YouTube Short); it is then
   rendered in a phone-shaped frame instead of a 16:9 one.
   Leave `videos: []` and no media block is rendered at all.
   ============================================================ */

const AI_PROJECTS = [
  {
    slug: 'sentry-vision',
    name: 'Sentry Vision',
    tagline: 'AI Surveillance & Loss-Prevention',
    category: 'Computer Vision',
    groups: ['cv'],
    accent: '#22b8f0',
    img: 'assets/img/sentry-vision.webp',
    videos: [
      { type: 'youtube', id: 'NIzQfM4HnCs', label: 'System overview' },
      { type: 'youtube', id: 'GhStNbrziKE', label: 'Retail deployment' }
    ],
    blurb: 'Turns existing CCTV into an always-on analyst — theft, weapons, violence and checkout fraud flagged in real time, with the evidence frame attached.',
    lede: 'Most sites are already covered by cameras. The problem is that nobody can watch fifty feeds at once, and by the time footage is reviewed the goods are gone. Sentry Vision runs continuous inference across every camera and every checkout lane, recognises the events that actually cost money and put people at risk, and raises an alert in the moment.',
    capabilities: [
      { title: 'Theft',            blurb: 'Shoplifting and concealment spotted on camera.' },
      { title: 'Weapons',          blurb: 'Guns, knives and blades flagged instantly.' },
      { title: 'Violence',         blurb: 'Fights and assaults detected live.' },
      { title: 'Suspect Tracking', blurb: 'Follows a flagged person across cameras.' },
      { title: 'Checkout Fraud',   blurb: 'Barcode swaps and ticket-switching caught at the till.' },
      { title: 'Instant Alerts',   blurb: 'Evidence-backed alerts pushed to the response team.' }
    ],
    steps: [
      { n: '01', title: 'Cameras & checkout',      blurb: 'Every feed ingested, all the time — including POS lanes.' },
      { n: '02', title: 'AI vision analyses',      blurb: 'Inference runs on-site. No footage is uploaded.' },
      { n: '03', title: 'Threat / fraud detected', blurb: 'Event classified: theft, weapon, violence or fraud.' },
      { n: '04', title: 'Alert + track suspect',   blurb: 'Alert fires with the evidence frame; tracking continues.' }
    ],
    impact: [
      { title: 'Cuts shrinkage',       blurb: 'Theft and checkout fraud stopped before goods leave.' },
      { title: 'Safety first',         blurb: 'Early warning on weapons and violence protects staff.' },
      { title: 'Faster response',      blurb: 'Guards act on live evidence, not after the fact.' },
      { title: 'Private & on-premise', blurb: 'Video stays on-site — no cloud, no per-camera fees.' }
    ],
    stack: ['Real-time inference', 'Object detection', 'Multi-camera re-ID', 'Pose / action recognition', 'Edge GPU', 'On-premise'],
    scale: 'Designed to run 50+ cameras on a single on-premise deployment.'
  },
  {
    slug: 'cementiq',
    name: 'CementIQ',
    tagline: 'AI Cement Dispatch & Inventory Audit',
    category: 'Computer Vision',
    groups: ['cv'],
    accent: '#f0a020',
    img: 'assets/img/cementiq.webp',
    videos: [{ type: 'youtube', id: '9xdqnXCxKNU', label: 'Dispatch audit walkthrough' }],
    blurb: 'Three cameras per loading bay replace the clipboard: every truck audited on six points and reconciled straight into the ERP, with zero manual tally.',
    lede: 'Cement dispatch is still audited the way it was decades ago — a person at the bay counting bags onto a truck and writing a number on a tally sheet. That handwritten number is the one the ERP trusts, and it is exactly what pilferage, short-loading and honest miscounts quietly erode. CementIQ replaces the clipboard with three AI cameras per bay.',
    capabilities: [
      { title: 'Bag Count',    blurb: 'Every bag counted on the conveyor.' },
      { title: 'Cement Brand', blurb: 'Confirms the correct brand was loaded.' },
      { title: 'FBR Code',     blurb: 'Reads the tax track-and-trace stamp.' },
      { title: 'Number Plate', blurb: 'ANPR recognises each truck automatically.' },
      { title: 'Pilferage',    blurb: 'Flags bags thrown off the truck.' },
      { title: 'ERP Sync',     blurb: 'Reconciled to the tally and pushed to the ERP.' }
    ],
    steps: [
      { n: '01', title: 'Truck arrives',        blurb: 'Plate captured at the barrier; dispatch record opens.' },
      { n: '02', title: '3 AI cameras scan',    blurb: 'Barrier, conveyor and overhead views cover the bay.' },
      { n: '03', title: 'AI counts & verifies', blurb: 'Count, brand, FBR stamp and pilferage in real time.' },
      { n: '04', title: 'Reconciled to ERP',    blurb: 'Audited figures matched to the tally sheet.' }
    ],
    impact: [
      { title: 'Stops pilferage',   blurb: 'Bags thrown off and short-loading caught in real time.' },
      { title: 'Accurate counts',   blurb: 'Every bag matched to the tally sheet — disputes end.' },
      { title: 'Zero manual tally', blurb: 'The whole dispatch audit runs automatically, 24/7.' },
      { title: 'ERP-integrated',    blurb: 'Verified data flows into the ERP already in use.' }
    ],
    stack: ['Object counting', 'ANPR / OCR', 'Multi-view fusion', 'Anomaly detection', 'ERP integration', 'On-premise'],
    scale: 'Six automated checks on every truck that leaves the plant.'
  },
  {
    slug: 'digital-twin-ops',
    name: 'Digital Twin Ops',
    tagline: 'Pipeline Integrity & Asset Monitoring',
    category: 'Industrial AI',
    groups: ['twin'],
    accent: '#2fd6a8',
    img: 'assets/img/digital-twin-ops.webp',
    videos: [{ type: 'youtube', id: '7zzTy9eEslw', label: 'Pipeline integrity demo' }],
    blurb: 'A live 3D twin of a pipeline network — sensors, autonomous drone inspection and predictive integrity, so failures are found before they happen.',
    lede: 'Real-time sensors, autonomous AI drone inspection and predictive integrity modelling, combined into one mirrored 3D model of the whole network. Every pipe carries a health score, every anomaly raises an early warning, and maintenance is scheduled by prediction rather than by breakdown.',
    capabilities: [
      { title: 'Live Sensors',           blurb: 'Pressure, flow, temperature, corrosion and more.' },
      { title: 'Health Scoring',         blurb: 'A condition rating for every pipe segment.' },
      { title: 'Leak & Anomaly Alerts',  blurb: 'Early warning on abnormal readings.' },
      { title: 'AI Drone Inspection',    blurb: 'Autonomous visual checks and diagnosis.' },
      { title: 'Predictive Maintenance', blurb: 'Forecasts remaining life and failure risk.' },
      { title: '3D Digital Twin',        blurb: 'A live 3D model of the whole network.' }
    ],
    steps: [
      { n: '01', title: 'Sensors & drone',      blurb: 'Continuous field data from seven sensor types.' },
      { n: '02', title: 'Live digital twin',    blurb: 'Every asset mirrored in a 3D model.' },
      { n: '03', title: 'AI predicts failures', blurb: 'Degradation modelled before it becomes an incident.' },
      { n: '04', title: 'Work order raised',    blurb: 'Scheduled by prediction, not by breakdown.' }
    ],
    impact: [
      { title: 'Prevent failures',      blurb: 'Leaks and corrosion caught early — avoiding unsafe incidents.' },
      { title: 'Less downtime',         blurb: 'Fix by prediction, not by breakdown. Keep flow running.' },
      { title: 'Lower inspection cost', blurb: 'AI drones replace slow, risky manual field checks.' },
      { title: 'Extend asset life',     blurb: 'Condition-based upkeep gets more years from every pipe.' }
    ],
    stack: ['IoT / SCADA', 'Time-series forecasting', 'Anomaly detection', 'Drone autonomy', '3D visualisation', 'On-premise'],
    scale: 'SCADA-grade, on-premise, across seven live sensor types.'
  },
  {
    slug: 'vision-3d',
    name: 'Vision 3D',
    tagline: '3D Replication & Digital Twin Platform',
    category: '3D Reconstruction',
    groups: ['twin', 'xr'],
    accent: '#55c2ef',
    img: 'assets/img/vision-3d.webp',
    videos: [{ type: 'youtube', id: 'O6FmJEQ3vJc', label: 'Photoreal twin walkthrough' }],
    blurb: 'Photoreal digital twins from an ordinary camera — a walkthrough video, a drone pass, or a single photograph. Then step inside it in VR.',
    lede: 'Vision 3D rebuilds the real world as a photorealistic digital twin — a factory floor, a showroom, a property, a product — captured with an ordinary camera rather than a laser scanner. The differentiator is the one-shot path: where only a single photograph exists, the image-to-3D engine still produces a full model. The result opens in a browser, on a phone, in AR, or at life size in VR.',
    metrics: [
      { v: '1',    u: ' photo', label: 'Minimum input — one image becomes a full 3D model' },
      { v: '60',   u: 'fps',    label: 'Real-time photoreal walkthrough, not a slideshow' },
      { v: '0',    u: '',       label: 'Specialist scanning hardware required' },
      { v: 'Same', u: '-day',   label: 'Capture in the morning, twin delivered the same day' }
    ],
    steps: [
      { n: '01', title: 'Capture',      blurb: 'A walkthrough video, a drone pass — or one still image.' },
      { n: '02', title: 'Reconstruct',  blurb: 'AI resolves shape, depth, colour and real light into a 3D scene.' },
      { n: '03', title: 'Digital Twin', blurb: 'A measurable, versioned replica — revisit any date, any angle.' },
      { n: '04', title: 'Step Inside',  blurb: 'Immerse at life size in VR, or open on web, phone or AR.' }
    ],
    impact: [
      { title: 'Spaces, replicated exactly',     blurb: 'Sites, plants, showrooms and properties become twins with true light and material — accurate enough to inspect and review remotely.' },
      { title: 'One shot, one photo, one model', blurb: 'A single image is enough. Catalogue products and assets that can never be re-shot still become 3D.' },
      { title: 'Step inside it — in full VR',    blurb: 'Walk the twin at life size to inspect a plant, tour a property or train a team. Also runs on any browser, phone or AR device.' }
    ],
    stack: ['Gaussian splatting', 'Photogrammetry', 'Image-to-3D', 'WebGL', 'VR / AR delivery', 'Unity'],
    scale: 'Delivered to web, VR and AR from a single capture.'
  },
  {
    slug: 'immersive-ar',
    name: 'Immersive AR',
    tagline: 'Live Stadium AR Platform',
    category: 'AR / Sports Tech',
    groups: ['cv', 'xr'],
    accent: '#4f9dfb',
    img: 'assets/img/immersive-ar.webp',
    videos: [{ type: 'youtube', id: 'NYGCVvzJuAw', label: 'Live stadium AR' }],
    blurb: 'Fans point a phone at the match and see every player’s name, number, position and speed on the real pitch — 22 players tracked live from stadium cameras.',
    lede: 'A multi-camera vision pipeline detects, tracks and identifies all twenty-two players frame by frame, resolves their stats, and pushes the result onto the fan’s live camera view in about a tenth of a second. No operators, no manual tagging, no delay — and a data-rich matchday layer that unlocks new broadcast overlays and premium sponsorship inventory.',
    metrics: [
      { v: '96–98', u: '%', label: 'Live player-tracking accuracy (dual-camera)' },
      { v: '~0.1',       u: 's', label: 'Near-instant, real-time overlay latency' },
      { v: '22',         u: '',  label: 'Players tracked simultaneously' },
      { v: '60',         u: 'K', label: 'Fans per stadium — scale target' }
    ],
    steps: [
      { n: '01', title: 'Stadium cameras capture',   blurb: 'A multi-camera setup covers the full pitch.' },
      { n: '02', title: 'AI tracks all 22 players',  blurb: 'Frame by frame, simultaneously, at 96–98% accuracy.' },
      { n: '03', title: 'Identities & stats resolved', blurb: 'Name, number, position and speed per player.' },
      { n: '04', title: 'Overlay hits the phone',    blurb: 'Rendered onto the live camera view in ~0.1s.' }
    ],
    impact: [
      { title: 'A new way to watch',       blurb: 'Point a phone at the pitch and see live player names, numbers and stats floating over the real match — turning every seat into the best seat.' },
      { title: 'AI vision, in real time',  blurb: 'Stadium cameras and AI detect, track and identify every player automatically — no operators, no manual tagging, no delay.' },
      { title: 'Value for rights-holders', blurb: 'A data-rich matchday layer unlocking fan engagement, broadcast overlays and premium sponsorship inventory.' }
    ],
    stack: ['Multi-object tracking', 'Player re-identification', 'Homography / pitch calibration', 'Mobile AR', 'Real-time streaming', 'Unity'],
    scale: 'Built for stadium scale — 60K fans, any smartphone.'
  },
  {
    slug: 'avatar-assist',
    name: 'AvatarAssist',
    tagline: 'Conversational AI Avatars',
    category: 'Conversational AI',
    groups: ['genai'],
    accent: '#55c2ef',
    img: 'assets/img/avatar-assist.webp',
    videos: [],
    blurb: 'A real-time virtual agent that listens, understands and answers out loud — with a lifelike, lip-synced face, in a one-line embed, running on your own hardware.',
    lede: 'Chat widgets answer questions. They don’t hold attention, they don’t serve a customer who would rather speak than type, and they never feel like your brand. AvatarAssist gives the interaction a face and a voice: a customer speaks in their own language and a lip-synced avatar answers out loud in about two seconds. Every stage of the loop runs on the client’s own hardware.',
    metrics: [
      { v: '~2',   u: 's',     label: 'Reply speed — a live, natural conversation' },
      { v: '24/7', u: '',      label: 'Always-on agent, no wait times or queues' },
      { v: '1',    u: '-line', label: 'Embeds into any website or app' },
      { v: '100',  u: '%',     label: 'Private, on-premise AI — data never leaves' }
    ],
    steps: [
      { n: '01', title: 'Listens',       blurb: 'The customer speaks or types — in their own language.' },
      { n: '02', title: 'Understands',   blurb: 'The model grasps intent and forms an on-brand reply.' },
      { n: '03', title: 'Speaks',        blurb: 'The answer is voiced in a natural, human-sounding voice.' },
      { n: '04', title: 'Comes to life', blurb: 'A talking avatar replies on screen, lips perfectly in sync.' }
    ],
    impact: [
      { title: 'Enterprise deployment', blurb: 'Running in production as a live customer-facing assistant in a regulated sector.' },
      { title: 'Support & FAQs',        blurb: 'The always-on first line of customer service, at any hour.' },
      { title: 'Your brand’s face',     blurb: 'The avatar’s face and voice are branded, not a generic stock persona.' },
      { title: 'Multilingual',          blurb: 'Customers are answered in the language they speak.' }
    ],
    stack: ['LLM inference', 'Speech-to-text', 'Text-to-speech', 'Lip-sync / viseme mapping', 'Real-time streaming', 'On-premise'],
    scale: 'One-line embed; full round trip in roughly two seconds.'
  },
  {
    slug: 'accelerator',
    name: 'Accelerator',
    tagline: 'AI-Native EdTech Platform',
    category: 'EdTech / VR',
    groups: ['xr', 'genai'],
    accent: '#8b7cf0',
    img: 'assets/img/accelerator.webp',
    videos: [],
    blurb: 'Trains the four things recruiters screen for — coding, aptitude, interviews, communication — with an AI mentor that coaches instead of spoon-feeding, plus VR interview practice on Meta Quest.',
    lede: 'Colleges are measured on placements, but the skills recruiters screen for are trained in four different places, if at all. Accelerator puts all four in one platform, adds an AI mentor built to coach rather than answer, gives students VR interview practice with an avatar that speaks and listens, and reduces the whole picture to a single Placement-Readiness score. Every model runs locally on the institution’s own machines — private, and with no per-student inference bill.',
    metrics: [
      { v: '4',   u: '',  label: 'Core skill areas trained in one hub' },
      { v: '5',   u: '',  label: 'Immersive VR training scenarios' },
      { v: '1',   u: '',  label: 'Unified Placement-Readiness score' },
      { v: '100', u: '%', label: 'Private, zero-cost local AI' }
    ],
    impact: [
      { title: 'Web Training Hub',          blurb: 'Coding, aptitude, interviews and communication in one place, with an AI mentor that guides students to the answer and never hands it over.' },
      { title: 'Immersive VR — Meta Quest', blurb: 'Students practise interviews and real-world scenarios with an AI avatar that speaks and listens — the closest thing to the real moment.' },
      { title: 'AI Avatar Tutor',           blurb: 'Scalable, on-demand video lectures delivered to every headset and screen. Produced once, reaching unlimited students.' }
    ],
    stack: ['Local LLM serving', 'Voice agents', 'Meta Quest / OpenXR', 'Unity', 'Avatar generation', 'Assessment scoring'],
    scale: 'Runs entirely on institution hardware — no per-student cost.'
  }
];

const GAMES_FEATURED = {
  slug: 'brawldinos',
  name: 'Brawl Dinos',
  tagline: 'Real-time multiplayer arena brawler — Android',
  accent: '#f0a020',
  videos: [
    { type: 'youtube', id: 'ze9Z9zH86p0', label: 'PvP gameplay', portrait: true, poster: 'assets/img/brawldinos-1.webp' },
    { type: 'youtube', id: 'WgxMhPJlNC0', label: 'Arena match',  portrait: true, poster: 'assets/img/brawldinos-2.webp' }
  ],
  store: 'https://play.google.com/store/apps/details?id=com.ByteCoder.BrawlDinos',
  blurb: 'My latest shipped title: a live multiplayer dino brawler on the Play Store, built in Unity with authoritative server-side matches, real-time state sync and cross-device matchmaking.',
  stack: ['Unity', 'C#', 'Real-time multiplayer', 'Authoritative server', 'Matchmaking', 'Android']
};

const GAMES = [
  {
    name: 'O-Laser Run',
    tagline: 'Cross-platform obstacle runner — Android & iOS',
    accent: '#22b8f0',
    where: 'Ideofuzion',
    blurb: 'An obstacle-running game inspired by UIPM Laser Run and Wipeout. Unity state machines drive responsive player control; a custom socket server powers real-time multiplayer, with Facebook friend challenges and leaderboards layered on top.',
    stack: ['Unity', 'Socket server', 'State machines', 'Facebook SDK', 'Leaderboards', 'iOS + Android'],
    videos: []
  },
  {
    name: 'Games-fi',
    tagline: 'Play-to-Earn blockchain platform',
    accent: '#2fd6a8',
    where: 'Ideofuzion',
    blurb: 'Core gameplay loops built around Tron and multiple cryptocurrencies for in-game earnings and withdrawals, plus NFT minting and trading and a secure raffles hub — with the blockchain plumbing kept invisible enough to stay frictionless.',
    stack: ['Unity', 'Tron', 'Web3', 'NFT minting', 'Smart contracts', 'Wallet integration'],
    videos: []
  },
  {
    name: 'Stunt-Z',
    tagline: 'Off-road jeep racing — 150+ tracks',
    accent: '#f0a020',
    where: 'Ideofuzion',
    blurb: 'A realistic jeep-racing game with advanced vehicle physics, particle effects and NOS boosts across 150+ tracks. Assets delivered through Google Play Asset Delivery, with dynamic biomes synchronised server-side to keep world state consistent.',
    stack: ['Unity', 'Vehicle physics', 'Play Asset Delivery', 'VFX', 'Server sync'],
    videos: []
  },
  {
    name: 'Project Zambeel',
    tagline: 'PC open-world AAA — third-person story',
    accent: '#8b7cf0',
    where: 'Alam Digital HQ',
    blurb: 'Led design and development of a GTA-inspired, third-person story-driven open-world game set on a tropical mafia-boss island. Built the dynamic mission and narrative system driving branching story paths, and integrated high-fidelity asset pipelines for AAA-quality visuals.',
    stack: ['Unity', 'Open world', 'Mission system', 'Narrative branching', 'HDRP', 'Blender'],
    videos: []
  },
  {
    name: 'Operation Basalat',
    tagline: 'Team-based multiplayer shooter — Android',
    accent: '#4f9dfb',
    where: 'Coding Cannon',
    blurb: 'A team-based Android shooter where players, as army operatives, coordinate to force militants from a school and rescue children. Real-time client–server networking, objective-driven gameplay loops and AI pathfinding for dynamic combat.',
    stack: ['Unity', 'Client–server', 'AI pathfinding', 'Objective systems', 'Multiplayer'],
    videos: []
  },
  {
    name: 'Valet Parking',
    tagline: 'HD vehicle parking simulator — Android',
    accent: '#55c2ef',
    where: 'Alam Digital HQ',
    blurb: 'An HD parking simulator with realistic physics and intuitive touch controls, a level-based grading system that scores performance and unlocks challenges, and optimised 3D asset streaming for stable framerates across a wide device range.',
    stack: ['Unity', 'Vehicle physics', 'Asset streaming', 'Memory optimisation', 'Android'],
    videos: []
  }
];

const ALSO_SHIPPED = ['Rush Hour Run', 'Pakdam Pakdai', 'Space Shooter', "Hold'em Poker", 'Paper Boy'];

const TIMELINE = [
  {
    when: 'May 2023 — Present',
    role: 'Senior Engineer — AI, Vision & Immersive Systems',
    where: 'Ideofuzion · Islamabad, Pakistan',
    blurb: 'Joined as Sr. Game Developer and moved into AI. Now build and ship production computer-vision, digital-twin and conversational-AI products — Sentry Vision, CementIQ, Digital Twin Ops, Vision 3D, Immersive AR, AvatarAssist and Accelerator — most of them deployed on-premise, where the video and the data never leave the client site.',
    tags: ['Computer Vision', 'Digital Twins', 'LLM / Voice agents', 'AR / VR', 'On-premise AI', 'Unity']
  },
  {
    when: 'Sep 2021 — Mar 2023',
    role: 'Game Developer',
    where: 'Alam Digital HQ · Rawalpindi, Pakistan',
    blurb: 'Led design and development of Project Zambeel, a PC open-world AAA title, and shipped Valet Parking plus a run of Android games. Owned mission and narrative systems, asset pipelines and performance optimisation.',
    tags: ['Unity', 'Open world', 'Narrative systems', 'Optimisation', 'Blender']
  },
  {
    when: 'Jan 2017 — Sep 2021',
    role: 'Game Developer',
    where: 'Coding Cannon',
    blurb: 'Engineered Operation Basalat, a team-based Android multiplayer shooter, with real-time client–server networking, objective-driven gameplay and AI pathfinding — alongside a long tail of independent Android titles.',
    tags: ['Unity', 'Multiplayer', 'Networking', 'Game AI', 'C#']
  },
  {
    when: 'Sep 2020 — Mar 2022',
    role: 'MS, Computer Software Engineering',
    where: 'National University of Sciences and Technology (NUST) · Gold Medalist',
    blurb: 'Master of Science in Computer Software Engineering. Graduated as a Gold Medalist.',
    tags: ['Gold Medalist', 'Software Engineering']
  }
];

const SKILLS = [
  {
    title: 'AI & Computer Vision',
    accent: '#22b8f0',
    icon: 'eye',
    items: ['Object detection', 'Multi-object tracking', 'Re-identification', 'OCR / ANPR', 'Action recognition', 'Anomaly detection', 'Pose estimation', 'Real-time inference']
  },
  {
    title: 'Generative & Conversational AI',
    accent: '#8b7cf0',
    icon: 'chat',
    items: ['LLM serving', 'Local / on-prem models', 'RAG', 'Voice agents', 'Speech-to-text', 'Text-to-speech', 'Lip-sync avatars', 'Prompt engineering']
  },
  {
    title: '3D, XR & Digital Twins',
    accent: '#2fd6a8',
    icon: 'cube',
    items: ['Gaussian splatting', 'Photogrammetry', 'Image-to-3D', 'Meta Quest / OpenXR', 'Mobile AR', 'WebGL', 'Blender', 'Digital twin modelling']
  },
  {
    title: 'Game Engineering',
    accent: '#f0a020',
    icon: 'gamepad',
    items: ['Unity3D', 'C#', 'Real-time multiplayer', 'Mirror', 'Authoritative servers', 'PlayFab', 'Vehicle physics', 'State machines', 'Game AI / pathfinding']
  },
  {
    title: 'Platform & Delivery',
    accent: '#4f9dfb',
    icon: 'server',
    items: ['Edge GPU deployment', 'Socket servers', 'ERP / SCADA integration', 'IoT pipelines', 'Play Asset Delivery', 'Android', 'iOS', 'Git'],
  },
  {
    title: 'Blockchain & Web3',
    accent: '#f0605c',
    icon: 'link',
    items: ['Tron', 'Smart contracts', 'NFT minting & trading', 'Wallet integration', 'P2E economies']
  }
];

const MARQUEE = [
  'Computer Vision', 'Unity3D', 'C#', 'Python', 'PyTorch', 'YOLO', 'LLMs', 'RAG',
  'Digital Twins', 'Gaussian Splatting', 'Meta Quest', 'OpenXR', 'Mobile AR',
  'Real-time Multiplayer', 'Mirror', 'PlayFab', 'Blender', 'Edge GPU', 'On-premise AI',
  'Voice Agents', 'Photogrammetry', 'Tron / Web3'
];

const ROLES = [
  'AI & Computer Vision Engineer',
  'Digital Twin & 3D Reconstruction',
  'AR / VR Developer',
  'Unity & Multiplayer Game Developer'
];
