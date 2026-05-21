import { useState, useEffect, useCallback, useRef } from "react";

// ─── FONT IMPORT ──────────────────────────────────────────────────────────────
// Barlow Semi-Condensed loaded via Google Fonts injected into document head
const injectFont = () => {
  if (document.getElementById("bv-font")) return;
  const link = document.createElement("link");
  link.id = "bv-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap";
  document.head.appendChild(link);
};
injectFont();

// ─── THEME SYSTEM ─────────────────────────────────────────────────────────────
// BEAR VIRTUAL brand colors (default theme).
// To skin for a client: update the THEMES object with their hex codes,
// then set clientTheme in localStorage or the Admin Panel.
// Every color in the app is derived from this theme object — nothing is hardcoded.

const THEMES = {
  // ─────────────────────────────────────────────────────────────────────────
  // BEAR VIRTUAL — Official brand palette
  // Contrast rules:
  //   #1E3248 (prussian) bg → only #FFFFFF or #FFED4A text
  //   #2A44B9 (denim)    bg → only #FFFFFF text
  //   #7394BF (faded)    bg → only #1E3248 text (large/bold only)
  //   #FFED4A (yellow)   bg → only #1E3248 text — accent use only
  //   #FFFFFF / #F5F5F5  bg → #1E3248 text (body), #2A44B9 (links/labels)
  // ─────────────────────────────────────────────────────────────────────────
  "Bear Virtual": {
    name: "Bear Virtual",
    font: "'Barlow Semi Condensed', sans-serif",

    // ── Raw palette (from brand guide) ───────────────────────────────────
    // #1E3248  Prussian Blue  — body text, nav links, wordmark
    // #2A44B9  Denim Blue     — CTA buttons, headlines, active states
    // #7394BF  Blue Grey      — subtle borders, faint textures, muted labels
    // #FFED4A  Lemon Yellow   — accent only (used very sparingly)
    // #FFFFFF  White          — dominant background, cards, header
    // #F5F5F5  Cultured       — very light page tint

    // ── Semantic tokens ───────────────────────────────────────────────────
    // SITE FEEL: White dominant. Clean. Airy. Blue is a pop, not a background.
    // The header is white/transparent. Dark navy is used for TEXT, not backgrounds.
    // Denim blue (#2A44B9) is only for: buttons, big headlines, active elements.

    // Backgrounds
    headerBg:    "#2A44B9",   // Header is DENIM BLUE — primary brand color
    pageBg:      "#FAFBFC",   // Near-white page canvas (very subtle cool tint)
    cardBg:      "#FFFFFF",   // Cards are white
    sectionBg:   "#F0F4FA",   // Very faint blue tint for alternating sections
    inputBg:     "#FFFFFF",

    // Text
    textPrimary: "#111111",   // Body text — prussian blue (reads as near-black)
    textOnDark:  "#FFFFFF",   // Text when bg is denim or prussian
    textMuted:   "#4A6080",   // Muted labels — faded blue (large text only)
    textLabel:   "#2A44B9",   // Denim blue labels and section tags on white

    // Borders & dividers — all very subtle, blue-tinted
    border:      "#E2E8F4",   // Card border — barely visible
    borderMid:   "#C8D5E8",   // Stronger border
    divider:     "#E8EEF8",   // Section divider

    // Interactive — denim blue is the ONE colored action color
    primary:     "#2A44B9",   // Button bg (like "LET'S TALK" on site)
    primaryText: "#FFFFFF",   // Button text
    primaryHov:  "#1E3248",   // Hover → prussian

    // Accent yellow — used ONLY for Key Focus badge, nowhere else
    accent:      "#FFED4A",
    accentText:  "#000000",

    // Pillar tags — tinted pills on white, all readable
    p1: { bg:"#EBF0FC", bd:"#2A44B9", tx:"#111111" },  // Tips — denim
    p2: { bg:"#E8EDF5", bd:"#1E3248", tx:"#111111" },  // B&A — prussian
    p3: { bg:"#EDF3FA", bd:"#4a78aa", tx:"#111111" },  // BTS — blue grey
    p4: { bg:"#FFF8DC", bd:"#b89600", tx:"#111111" },  // Social proof — amber
    p5: { bg:"#FCE8E8", bd:"#c0392b", tx:"#111111" },  // Hot takes — red
    p6: { bg:"#EFE8F8", bd:"#6c3483", tx:"#111111" },  // CTAs — purple

    // Calendar day chips — 4 distinct but all on-brand
    d1: { bg:"#1E3248", tx:"#FFFFFF" },  // Mon — prussian + white
    d2: { bg:"#2A44B9", tx:"#FFFFFF" },  // Wed — denim + white
    d3: { bg:"#1E3248", tx:"#FFFFFF" },  // Fri — prussian + white ✓ 13:1
    d4: { bg:"#EBF0FC", tx:"#111111" },  // Sun — light tint + black
  },

  // ── CLIENT THEME TEMPLATE ────────────────────────────────────────────────
  // To add a client: copy this block → fill hex codes → rename the key.
  // The client's theme will appear in Admin Panel → Brand Theme automatically.
  "__CLIENT_TEMPLATE__": {
    name: "Client Name Here",
    font: "'Barlow Semi Condensed', sans-serif",  // swap for client font if needed

    prussian: "#000000",  // Client's darkest color
    denim:    "#333333",  // Client's primary brand color
    faded:    "#888888",  // Client's secondary / muted color
    yellow:   "#FFD700",  // Client's accent color
    offwhite: "#F8F8F8",
    white:    "#FFFFFF",

    // Copy these semantic tokens and adjust to match client palette
    headerBg:    "#000000",
    pageBg:      "#F8F8F8",
    cardBg:      "#FFFFFF",
    sectionBg:   "#F0F0F0",
    inputBg:     "#FFFFFF",
    textPrimary: "#222222",
    textOnDark:  "#FFFFFF",
    textOnDenim: "#FFFFFF",
    textMuted:   "#777777",
    textLabel:   "#333333",
    border:      "#DDDDDD",
    borderMid:   "#BBBBBB",
    divider:     "#EEEEEE",
    primary:     "#333333",
    primaryText: "#FFFFFF",
    primaryHov:  "#000000",
    accent:      "#FFD700",
    accentText:  "#000000",

    // Pillar tag colors — adjust to client palette
    p1: { bg:"#EEF4FF", bd:"#3366CC", tx:"#111111" },
    p2: { bg:"#EEF8EE", bd:"#2d6a4f", tx:"#111111" },
    p3: { bg:"#FFF8EE", bd:"#cc7700", tx:"#111111" },
    p4: { bg:"#FFEEF8", bd:"#9b2277", tx:"#111111" },
    p5: { bg:"#FDE8E8", bd:"#c0392b", tx:"#111111" },
    p6: { bg:"#F0E8F8", bd:"#6c3483", tx:"#111111" },

    // Calendar day chips
    d1: { bg:"#000000", tx:"#FFFFFF" },
    d2: { bg:"#333333", tx:"#FFFFFF" },
    d3: { bg:"#F0F0F0", tx:"#111111" },
    d4: { bg:"#000000", tx:"#FFFFFF" },
  },
};

// Active theme — read from localStorage, default to Bear Virtual
const getTheme = () => {
  try {
    const saved = localStorage.getItem("bv_theme");
    return THEMES[saved] || THEMES["Bear Virtual"];
  } catch(e) { return THEMES["Bear Virtual"]; }
};

// C is a reactive reference — updated when theme changes
// Components call useTheme() to get current theme values
let _theme = getTheme();
const C = new Proxy({}, { get: (_, k) => _theme[k] || _theme.primary });

// Pillar color helper — reads from active theme
const pillarColor = (id) => {
  const t = _theme;
  const map = { 1:t.p1, 2:t.p2, 3:t.p3, 4:t.p4, 5:t.p5, 6:t.p6 };
  return map[id] || { bg:"#f5f5f5", bd:"#ccc", tx:"#111111" };
};

// Day style helper
const getDayStyle = () => ({
  Mon: _theme.d1, Wed: _theme.d2, Fri: _theme.d3, Sun: _theme.d4,
});

// ─── ROLES ────────────────────────────────────────────────────────────────────
const ROLES = {
  admin:    { label:"Admin",          canEditPillars:true,  canEditCalendar:true,  canEditCaptions:true,  canUploadImages:true,  canApprove:true,  canEditHashtags:true,  canEditIdeas:true  },
  full:     { label:"Full Client",    canEditPillars:true,  canEditCalendar:true,  canEditCaptions:true,  canUploadImages:true,  canApprove:false, canEditHashtags:true,  canEditIdeas:true  },
  content:  { label:"Content Client", canEditPillars:false, canEditCalendar:false, canEditCaptions:true,  canUploadImages:true,  canApprove:false, canEditHashtags:false, canEditIdeas:false },
  reviewer: { label:"Reviewer",       canEditPillars:false, canEditCalendar:false, canEditCaptions:false, canUploadImages:true,  canApprove:true,  canEditHashtags:false, canEditIdeas:false },
  readonly: { label:"Read Only",      canEditPillars:false, canEditCalendar:false, canEditCaptions:false, canUploadImages:false, canApprove:false, canEditHashtags:false, canEditIdeas:false },
};

// pillarColor and getDayStyle are defined above in the theme system

// ─── DEFAULT DATA ─────────────────────────────────────────────────────────────
const DEFAULT_PILLARS = [
  { id:1, emoji:"💡", name:"Tips & Education", job:"Build Trust", jobColor:"#2d6a4f", freq:"2x/week", formats:"Carousel · Single graphic · Reel",
    desc:"Web design tips. Content strategy. Social media mistakes. GBP basics. AI tools for small businesses. Your authority-building pillar — the reason someone follows you before they're ready to hire you.",
    postIdeas:["5 things your website homepage must have (or you're losing leads)","Why your Google Business Profile matters more than your Instagram","The one page small businesses always forget to build","3 AI tools under $30/month that save service businesses hours every week","What 'above the fold' means and why it matters","Why your site looks fine on desktop but broken on mobile","How to batch a month of content in one afternoon"],
    storyIdeas:["Screenshot of a strong vs weak Instagram bio side by side","Quick tip on brand color background: 'Always put your phone number in your bio'","Screen recording: how to check if your GBP is complete in 60 seconds","'Did you know?' fact about local SEO or website behavior"],
    hookFormulas:["[Number] things every [business type] website needs — and most are missing at least [number].","Why your [platform] matters more than your [other platform]. Here's why.","The one [thing] small businesses always [miss/forget/get wrong]."] },
  { id:2, emoji:"✨", name:"Before & After / Results", job:"Build Trust + Drive Action", jobColor:_theme.primary, freq:"1x/week", formats:"Carousel · Side-by-side · Reel",
    desc:"Website transformations. Content makeovers. Profile optimizations. Your most powerful trust-building content — it shows the work, not just the promise.",
    postIdeas:["Website homepage before/after: cluttered → clean","Instagram profile before/after: weak bio → optimized","Content calendar before/after: random posting → strategic pillars","GBP before/after: bare → complete","Caption makeover: generic → brand voice"],
    storyIdeas:["Before/after of something mid-process — doesn't have to be finished","'Currently working on...' peek at a client project","Share a client win in real time"],
    hookFormulas:["This [thing] was [costing/losing] [them/her/him] [result]. Here's what we changed.","[Business type] before/after: [old state] → [new state]."] },
  { id:3, emoji:"🐻", name:"Behind the Scenes", job:"Show Personality", jobColor:_theme.primary, freq:"1x/week", formats:"Reel · Story series · Casual photo",
    desc:"Show how the work gets done. The AI-assisted process. Building a Canva template. This pillar humanizes Bear Virtual and makes AI-assistance feel transparent rather than suspicious.",
    postIdeas:["How I build a month of client content in one afternoon (Reel)","The tools on my desktop right now","What it actually looks like when I use AI to draft content","Building a Canva template from scratch for a wellness client","What a Content Clarity Session actually looks like"],
    storyIdeas:["Photo of your workspace or current project","Your Monday morning setup: coffee + laptop + agenda","Something relatable: 'Spent 20 min deciding on a font. This is my life.'","Share a tool you're using today and why"],
    hookFormulas:["I [do thing] for a client in [time]. Here's exactly how.","This is why I started Bear Virtual.","What [my job/this process] actually looks like behind the scenes."] },
  { id:4, emoji:"⭐", name:"Client Stories & Social Proof", job:"Build Trust + Drive Action", jobColor:_theme.primary, freq:"1–2x/month", formats:"Quote graphic · Testimonial carousel",
    desc:"Direct client quotes. Results with context. The closest thing to a referral that social media can generate.",
    postIdeas:["\"Bear Virtual was vital to getting my website built.\" — Melissa F.","\"Having them work on admin tasks freed up a lot of time.\" — Chris C.","Screenshot positive DMs with permission","After every project: 3-question Google Form for a testimonial"],
    storyIdeas:["Reshare a client's post: 'So proud of what [business] has built 🐻'","Celebrate a client milestone — booked out, grand opening, anniversary","Share a DM or text (with permission) in real time"],
    hookFormulas:["\"[Client quote].\" — [First name].","This is what [result] looks like in real life."] },
  { id:5, emoji:"🔥", name:"Hot Takes & Myth Busting", job:"Show Personality", jobColor:"#9b2226", freq:"1–2x/month", formats:"Bold graphic · Short Reel · Text-only",
    desc:"The stuff everyone says that's wrong. Strong opinions backed by real experience. This pillar generates shares, saves, and debates.",
    postIdeas:["'You need to post every day' — no you don't. Here's what actually works.","Your website doesn't need to be fancy. It needs to do these 4 things.","Stop waiting until your Instagram is perfect to launch your website","AI content isn't the problem. Unreviewed AI content is.","The reason your social media isn't working isn't your content. It's your website."],
    storyIdeas:["Poll: 'True or false: You need to post every day to grow on Instagram' → Answer: False","Share a common myth you keep hearing and your quick take","'Hot take incoming 🔥' tease for a feed post"],
    hookFormulas:["'[Common advice]' — [short rebuttal]. Here's what actually works.","Your [thing] doesn't need to be [expectation]. It needs to do these [number] things.","The reason your [problem] isn't [cause they think]. It's [real cause]."] },
  { id:6, emoji:"📣", name:"Offers & CTAs", job:"Drive Action", jobColor:"#6a2c9b", freq:"1x/week (never two in a row)", formats:"Single graphic · Story with link",
    desc:"Direct promotion of your services. Not pushy — framed around what the client gets. One clear CTA per post. Never apologize for selling.",
    postIdeas:["Open spots this month for Content Co-Pilot — here's what's included","The Honey Pot Content Kit: a full month of templates for [industry]","Free discovery call — 30 minutes, no pitch.","Website build: Cub Site package — everything you need to get online","New: AI & Automation Audit — find out where you're losing time"],
    storyIdeas:["'Discovery calls are open this week — link below 👇' + link sticker","After a before/after post: 'Curious what your site could look like? Free call — tap below'","Countdown sticker to a limited-time offer"],
    hookFormulas:["[Service name]. [Price]. [One-sentence outcome].","[Number] spots open this month for [service]. Here's what's included.","Free [offer]. [What they get]. [Why it's worth their time]."] },
];

const DEFAULT_WEEKS = [
  { week:1, label:"You're Invisible Online", tc:"#1E3248",
    obj:"Make them feel the problem Bear Virtual solves — before offering any solution.",
    theme:"The whole week is one conversation: small businesses lose customers to worse competitors with better websites.",
    posts:[
      { day:"Mon", pillarId:1, fmt:"Carousel (5 slides)", kf:true, angle:"The problem, made specific and actionable",
        hook:"5 things every small business website needs — and most are missing at least 3.",
        cap:"Walk through the 5 essentials: visible contact info, clear service list, GBP connection, trust signals, mobile-friendly. Each slide = one item with a self-audit question. Last slide: 'Missing any of these? That's exactly what we fix.' CTA to discovery call.",
        gfx:"Branded carousel. Slide 1: bold headline on dark brown. Slides 2–6: one item per slide. Final: CTA.",
        image:null, imageStatus:"none" },
      { day:"Wed", pillarId:5, fmt:"Bold single graphic", kf:false, angle:"Make it personal and urgent",
        hook:"Your referrals are Googling you before they call. What are they finding?",
        cap:"Short and punchy. Word-of-mouth still gets Googled first. End: 'This week I've been posting about what your website actually needs. Monday's post is a good place to start.'",
        gfx:"Bold statement typography. Dark brown background, sand text.",
        image:null, imageStatus:"none" },
      { day:"Fri", pillarId:3, fmt:"Personal photo + caption", kf:false, angle:"Founder story",
        hook:"This is why I started Bear Virtual.",
        cap:"Real, warm, direct. I watched good businesses lose customers to worse ones with better websites. End: 'If any of this week's posts hit close to home — I built this for you.'",
        gfx:"Your headshot — candid. Warm sand overlay. 'Meet the bear behind the brand.'",
        image:null, imageStatus:"none" },
      { day:"Sun", pillarId:6, fmt:"Clean single graphic", kf:false, angle:"The ask lands because the week earned it",
        hook:"If you read this week's posts and recognized your website — this is the next step.",
        cap:"'Free 30-minute discovery call. No pitch. No pressure. Link in bio.' Keep it short — the week did the selling.",
        gfx:"Minimal. Soft sand background. 'Let's look at your website together.' CTA button.",
        image:null, imageStatus:"none" },
    ]},
  { week:2, label:"The Website Transformation", tc:_theme.primary,
    obj:"Show the solution visually — same problem from Week 1, now with a before/after answer.",
    theme:"Week 1 made them feel the problem. Week 2 shows the fix.",
    posts:[
      { day:"Mon", pillarId:2, fmt:"Carousel (before → after)", kf:true, angle:"The visual proof",
        hook:"This website was losing leads every day. Here's what we changed — and why.",
        cap:"Walk through transformation slide by slide. What was missing. What we changed. What each change does. Last slide: outcome — more calls, more trust.",
        gfx:"Side-by-side carousel. 'Before' muted left, 'After' bright right. Each slide labels the change.",
        image:null, imageStatus:"none" },
      { day:"Wed", pillarId:1, fmt:"Carousel or single graphic", kf:false, angle:"The craft behind the transformation",
        hook:"Every change we made to that website had a reason. Here's the thinking behind it.",
        cap:"Pick 3 changes from Monday and explain the logic. Example: 'We moved the phone number to the top right because that's where eyes go on mobile.' Specific and educational.",
        gfx:"Clean educational carousel. Annotated screenshot style if possible.",
        image:null, imageStatus:"none" },
      { day:"Fri", pillarId:4, fmt:"Quote graphic", kf:false, angle:"The human result behind the visual",
        hook:"\"Bear Virtual was vital to getting my website built.\" — Melissa F.",
        cap:"Share the testimonial with context. What Melissa was dealing with. What changed. End: 'This is the part I love most — when the website starts working.'",
        gfx:"Quote card. Dark background. White quote text. Subtle bear logo.",
        image:null, imageStatus:"none" },
      { day:"Sun", pillarId:6, fmt:"Single graphic", kf:false, angle:"The offer with full context",
        hook:"The Cub Site. $450. This is the thing that changes what people find when they Google you.",
        cap:"What's included: 3-page site, hosting, GBP setup, branded email. Timeline: 2–3 weeks. 'Book a free call — link in bio.'",
        gfx:"Clean pricing card. Package name, bullet inclusions, price. Tan accent. CTA at bottom.",
        image:null, imageStatus:"none" },
    ]},
  { week:3, label:"Content Is the Other Half", tc:"#2d6a4f",
    obj:"Shift from websites to content services — same audience, new problem angle.",
    theme:"Website is the foundation. Content is what keeps you visible after launch.",
    posts:[
      { day:"Mon", pillarId:3, fmt:"Reel (30–45 sec)", kf:true, angle:"Show the process — introduce Co-Pilot without naming it",
        hook:"I make a full month of social media content for a client in one afternoon. Here's exactly how.",
        cap:"Voiceover Reel. Walk through: intake brief → pillar planning → Canva templates → AI drafts → client review folder. Honest about AI. End: 'There's a name for this. I'll share it later this week.'",
        gfx:"Screen recording + voiceover. Show Canva, Drive folder, caption doc. Keep it real.",
        image:null, imageStatus:"none" },
      { day:"Wed", pillarId:1, fmt:"Carousel", kf:false, angle:"The framework for what good content looks like",
        hook:"4 types of posts every small business should be making. Most are only doing one.",
        cap:"Education, Social Proof, BTS, Offers. One example each. Last slide: 'If you're only posting offers — that's why it's not working.'",
        gfx:"Clean carousel. One type per slide. Final slide: the content mix ratio.",
        image:null, imageStatus:"none" },
      { day:"Fri", pillarId:5, fmt:"Bold text graphic", kf:false, angle:"Bridge weeks 2 and 3",
        hook:"A good website with no content is a store with the lights off. Posting without a website is a great sign pointing nowhere.",
        cap:"Short and punchy. Both matter. Neither works without the other. End: 'Next week — what they look like working together.'",
        gfx:"Two-panel graphic: storefront dark / storefront lit. Dark background.",
        image:null, imageStatus:"none" },
      { day:"Sun", pillarId:6, fmt:"Single graphic", kf:false, angle:"Name the service — the week built the context",
        hook:"Content Co-Pilot. $297/month. Your content, handled.",
        cap:"Name it now. 12–16 Canva graphics, AI-drafted captions reviewed for your voice, calendar, shared folder, one revision round. 'You review. You approve. It goes live.'",
        gfx:"Clean service card. 'Content Co-Pilot' headline. Bullet inclusions. Price. CTA.",
        image:null, imageStatus:"none" },
    ]},
  { week:4, label:"Make It Easy to Say Yes", tc:"#6a2c9b",
    obj:"Remove the last objections. Close the month with a warm, no-pressure ask.",
    theme:"Four weeks of trust-building. Now remove the last thing stopping them from booking.",
    posts:[
      { day:"Mon", pillarId:1, fmt:"Carousel", kf:true, angle:"High-value saves-bait with a DIY frame",
        hook:"Why your website isn't showing up on Google — and 3 things you can fix this week.",
        cap:"Fixable issues: incomplete GBP, service area not on site, not mobile-friendly, no meta description. Each slide: problem, why, fix. Last slide: 'Can't fix all of this yourself? That's what we do.'",
        gfx:"Problem → solution carousel. Warning icon, green check for fix. Strong saves candidate.",
        image:null, imageStatus:"none" },
      { day:"Wed", pillarId:4, fmt:"Quote graphic", kf:false, angle:"Warm trust signal before the final ask",
        hook:"\"Having them work on admin tasks freed up a lot of time to focus on the creative part of my job.\" — Chris C.",
        cap:"Context: admin overload, couldn't focus on actual work. What Bear Virtual took off his plate. End: 'When clients get time back — that's the whole point.'",
        gfx:"Quote card. Warm tone — sand or cream background. Different feel from Week 2.",
        image:null, imageStatus:"none" },
      { day:"Fri", pillarId:5, fmt:"Bold graphic", kf:false, angle:"Remove the cost/complexity objection",
        hook:"You don't need a big marketing budget to show up professionally online.",
        cap:"Professional doesn't mean expensive. A $450 site done right beats a $5k one that's confusing. 'The barrier is lower than you think. The cost of doing nothing is higher.'",
        gfx:"Bold statement. Minimal design. High contrast. Shareable.",
        image:null, imageStatus:"none" },
      { day:"Sun", pillarId:6, fmt:"Warm personal graphic", kf:false, angle:"Lowest-friction ask after four weeks",
        hook:"Free 30-minute discovery call. No pitch. No pressure. Just a real conversation about your business.",
        cap:"'We've spent four weeks talking about what small businesses need online. If any of it resonated, this is the step that costs nothing.' One CTA, link in bio.",
        gfx:"Warm. Your photo if possible. Soft brand colors. 'Let's talk.' Minimal. Human.",
        image:null, imageStatus:"none" },
    ]},
];

const DEFAULT_STORIES = [
  { id:"s1", emoji:"♻️", name:"Repurposed Feed Content", freq:"Every time you post to your feed",
    what:"Share your new feed post to Stories immediately after publishing. Add a sticker or short context.",
    why:"Not everyone scrolls their feed. Story shares dramatically increase how many followers see a new post.",
    ideas:["Share the post → add text sticker: 'New post — this one's worth saving 👆'","Share the post → add a poll: 'Does your business have all 5 of these? ✅ Yes / 🙈 Missing some'","Share the post → question box: 'What's the biggest thing you'd change about your website?'","After a before/after: 'Swipe through the full transformation in my feed 👆'"] },
  { id:"s2", emoji:"💡", name:"Quick Tips & Micro-Education", freq:"2–3x per week",
    what:"One-slide tips too small for a full feed post. Text on a brand color background or a 60-second screen recording.",
    why:"Keeps you visible as the expert between feed posts. Takes 2 minutes, not 20.",
    ideas:["Screenshot of a strong vs weak Instagram bio side by side","Quick tip: 'Always put your phone number in your bio, not just in a post'","Screen recording: how to check if your GBP is complete in 60 seconds","Share a quick client win: 'Just launched a site — first inquiry within 48 hours'","Tool of the day: what you're using and why in one sentence"] },
  { id:"s3", emoji:"🗳️", name:"Polls & Question Boxes", freq:"2x per week",
    what:"Low-effort, high-engagement. One question, two options, done.",
    why:"Every poll tap = engagement signal to the algorithm. You also get free audience research that informs your next week's content.",
    ideas:["Poll: 'Does your business have a website?' Yes, it's live / Still working on it","Poll: 'How often do you post on social?' Consistently / Whenever I remember","Poll: 'What's harder?' Making the content / Staying consistent","Question box: 'What's your biggest struggle with marketing your business right now?'","Quiz: 'True or false: You need to post every day to grow' → Answer: False"] },
  { id:"s4", emoji:"🐻", name:"Behind the Scenes Moments", freq:"1–2x per week",
    what:"Casual, unpolished glimpses into your work day. Not staged — quick captures of real moments.",
    why:"Polished feed content shows expertise. Casual Stories show personality. This is how people decide if they trust you.",
    ideas:["Photo of your workspace or current project with a quick caption","'Currently working on...' peek at a client project","Your Monday morning setup: coffee + laptop + what's on the agenda","Something relatable: 'Spent 20 min deciding on a font. This is my life.'"] },
  { id:"s5", emoji:"📣", name:"CTA & Booking Stories", freq:"1x per week",
    what:"Direct, low-pressure booking prompts. Link sticker = one tap to act. Works best right after a strong feed post.",
    why:"Feed posts build intent. Stories close the loop. Someone who liked Monday's post needs one more nudge.",
    ideas:["'Discovery calls are open this week — link below 👇' + link sticker","After a before/after: 'Curious what your site could look like? Free call — tap below'","End-of-week wrap: 'Covered a lot this week. Here's how to work together'","Countdown sticker to a limited-time offer"] },
  { id:"s6", emoji:"🤝", name:"Reshares & Community", freq:"As it comes up",
    what:"Share content from clients, followers, or people in your target markets.",
    why:"Generosity builds community. Shows you're embedded in their world, not just broadcasting at it.",
    ideas:["Reshare a client's post: 'So proud of what [business] has built 🐻'","Reshare a follower's question you get often: 'Great question — here's the short answer'","Celebrate a client milestone — booked out, grand opening, anniversary"] },
];

const DEFAULT_HASHTAGS = [
  { id:"h1", tag:"#WebDesignForSmallBiz", tier:"micro", note:"Estimated 10k–30k posts — verify in app", copyable:true },
  { id:"h2", tag:"#HVACMarketing", tier:"micro", note:"Estimated 10k–20k posts — verify in app", copyable:true },
  { id:"h3", tag:"#LashTechBusiness", tier:"micro", note:"Estimated 20k–40k posts — verify in app", copyable:true },
  { id:"h4", tag:"#MassageTherapistTips", tier:"micro", note:"Estimated 15k–30k posts — verify in app", copyable:true },
  { id:"h5", tag:"#SmallBizWebsite", tier:"micro", note:"Estimated 30k–60k posts — verify in app", copyable:true },
  { id:"h6", tag:"#ContentForServiceBusiness", tier:"micro", note:"Estimated 5k–15k posts — verify in app", copyable:true },
  { id:"h7", tag:"#WellnessBusinessOwner", tier:"micro", note:"Estimated 30k–60k posts — verify in app", copyable:true },
  { id:"h8", tag:"#HomeServiceMarketing", tier:"micro", note:"Estimated 8k–20k posts — verify in app", copyable:true },
  { id:"h9", tag:"#SmallBusinessWebDesign", tier:"niche", note:"Estimated 60k–120k posts — verify in app", copyable:true },
  { id:"h10", tag:"#ContentStrategyTips", tier:"niche", note:"Estimated 80k–150k posts — verify in app", copyable:true },
  { id:"h11", tag:"#BeautyBusinessOwner", tier:"niche", note:"Estimated 100k–200k posts — verify in app", copyable:true },
  { id:"h12", tag:"#SalonMarketing", tier:"niche", note:"Estimated 50k–100k posts — verify in app", copyable:true },
  { id:"h13", tag:"#SmallBusinessOwner", tier:"avoid", note:"2.5M+ posts — too saturated for new accounts", copyable:false },
  { id:"h14", tag:"#Entrepreneur", tier:"avoid", note:"50M+ posts — pure noise", copyable:false },
  { id:"h15", tag:"#BusinessTips", tier:"avoid", note:"5M+ posts — too broad", copyable:false },
  { id:"h16", tag:"#BearVirtual", tier:"brand", note:"Use on every post — you're building this tag", copyable:true },
];

const TIER_META = {
  micro: { label:"MICRO-NICHE", sub:"3–4 per post. Most specific — highest precision signal to Instagram's algorithm.", color:"#111111", bg:"#eef8f2" },
  niche: { label:"NICHE", sub:"1–2 per post. Mix with micro-niche. Good for broader topic classification.", color:"#111111", bg:"#eef2f8" },
  brand: { label:"BRAND TAG", sub:"Use on every post. Building your searchable archive.", color:"#111111", bg:"#fdf5ee" },
  avoid: { label:"AVOID — TOO BROAD", sub:"500k+ posts. Too vague to classify your content. Come back at 1k+ followers.", color:"#111111", bg:"#fde8e8" },
};

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const STORE_KEY = "bv_den_v1";
const save = (data) => { try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch(e) {} };
const load = () => { try { const d = localStorage.getItem(STORE_KEY); return d ? JSON.parse(d) : null; } catch(e) { return null; } };

const initData = () => {
  const saved = load();
  return saved || {
    role: "admin",
    pillars: DEFAULT_PILLARS,
    weeks: DEFAULT_WEEKS,
    stories: DEFAULT_STORIES,
    hashtags: DEFAULT_HASHTAGS,
  };
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2,8);
const sp = (t,b=0) => ({marginTop:t,marginBottom:b});
const card = (extra={}) => ({background:_theme.cardBg,borderRadius:12,padding:16,border:"1px solid #e0d4c8",...extra});
const pill = (color,bg) => ({display:"inline-flex",alignItems:"center",padding:"3px 9px",borderRadius:20,fontSize:12,fontWeight:700,color,background:bg,border:`1px solid ${color}30`,fontFamily:"monospace"});
const btn = (primary=true,small=false,danger=false) => ({
  padding:small?"5px 11px":"8px 16px", borderRadius:7, border:"none", cursor:"pointer",
  fontSize:small?11:13, fontFamily:_theme.font, fontWeight:600,
  background:danger?"#fde8e8":primary?_theme.primary:_theme.cardBg,
  color:danger?"#9b2226":primary?_theme.primaryText:_theme.textPrimary,
  border:primary||danger?"none":`1px solid ${_theme.border}`,
  transition:"all 0.15s",
});

// ─── AI REGENERATION ─────────────────────────────────────────────────────────
async function regeneratePillarContent(pillars) {
  const prompt = `You are a social media strategist for Bear Virtual, a web design and content agency serving B2C small businesses (home services, wellness, beauty). 

Given these updated content pillars, generate fresh content suggestions for each pillar. Return ONLY valid JSON with no markdown, no preamble, no explanation.

Pillars: ${JSON.stringify(pillars.map(p => ({id:p.id, name:p.name, desc:p.desc, job:p.job})))}

Return this exact structure:
{
  "pillars": [
    {
      "id": 1,
      "postIdeas": ["idea 1", "idea 2", "idea 3", "idea 4", "idea 5", "idea 6"],
      "storyIdeas": ["idea 1", "idea 2", "idea 3", "idea 4"],
      "hookFormulas": ["formula 1", "formula 2", "formula 3"]
    }
  ]
}

Brand voice: direct, warm, no jargon, small-business-owner to small-business-owner. Post ideas should be specific, actionable, and tied to the pillar's job (Build Trust / Drive Action / Show Personality). Hook formulas should use [brackets] for the parts the user fills in.`;

  // Calls /api/claude → redirected to netlify/functions/claude.js by netlify.toml
  // The function adds the Anthropic API key server-side — key never touches the browser
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API error ${res.status}`);
  }

  const data = await res.json();
  const text = data.content?.find(b => b.type === "text")?.text || "";
  const clean = text.replace(/```json|```/g,"").trim();
  return JSON.parse(clean);
}

// ─── INLINE EDIT ──────────────────────────────────────────────────────────────
function InlineEdit({ value, onChange, multiline=false, placeholder="", style={}, disabled=false }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef();
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);
  if (disabled || !editing) return (
    <span onClick={()=>!disabled&&setEditing(true)}
      style={{cursor:disabled?"default":"text",borderBottom:disabled?"none":`1px dashed ${_theme.border}`,
        minHeight:20,display:"inline-block",lineHeight:1.5,...style}}
      title={disabled?"Read only":"Click to edit"}>
      {value || <em style={{color:"#111111"}}>{placeholder}</em>}
    </span>
  );
  const props = { ref, value:draft, onChange:e=>setDraft(e.target.value), style:{...style,width:"100%",border:`1px solid ${_theme.primary}`,borderRadius:5,padding:"3px 6px",fontFamily:_theme.font,fontSize:"inherit",background:_theme.pageBg},
    onBlur:()=>{onChange(draft);setEditing(false);},
    onKeyDown:e=>{if(!multiline&&e.key==="Enter"){onChange(draft);setEditing(false);}if(e.key==="Escape"){setDraft(value);setEditing(false);}} };
  return multiline ? <textarea rows={3} {...props}/> : <input {...props}/>;
}

// ─── IMAGE UPLOAD ─────────────────────────────────────────────────────────────
function ImageUpload({ post, onUpdate, canUpload, canApprove }) {
  const [showPanel, setShowPanel] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef();

  const statusColors = { none:{bg:"#f5f5f5",tx:"#111111",label:"No Image"}, uploaded:{bg:"#fdf3e3",tx:"#111111",label:"Uploaded"}, approved:{bg:"#eef8f2",tx:"#111111",label:"✓ Approved"}, rejected:{bg:"#fde8e8",tx:"#111111",label:"✗ Needs Revision"} };
  const st = statusColors[post.imageStatus] || statusColors.none;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpdate({ image: ev.target.result, imageStatus:"uploaded" });
    reader.readAsDataURL(file);
  };

  return (
    <div style={{marginTop:10}}>
      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
        <span style={{...pill(st.tx,st.bg),cursor:"pointer"}} onClick={()=>setShowPanel(!showPanel)}>{st.label}</span>
        {canApprove && post.imageStatus==="uploaded" && (
          <>
            <button style={{...btn(false,true)}} onClick={()=>onUpdate({imageStatus:"approved"})}>✓ Approve</button>
            <button style={{...btn(false,true,true)}} onClick={()=>onUpdate({imageStatus:"rejected"})}>✗ Reject</button>
          </>
        )}
        {canUpload && <button style={{...btn(false,true)}} onClick={()=>setShowPanel(!showPanel)}>📎 {post.image?"Replace Image":"Add Image"}</button>}
      </div>
      {post.image && (
        <div style={{marginTop:8,borderRadius:8,overflow:"hidden",border:"1px solid #e0d4c8",maxWidth:280}}>
          <img src={post.image} alt="Post visual" style={{width:"100%",display:"block",maxHeight:160,objectFit:"cover"}}/>
        </div>
      )}
      {showPanel && canUpload && (
        <div style={{marginTop:8,background:_theme.sectionBg,borderRadius:8,padding:12,border:`1px solid ${_theme.primary}`}}>
          <div style={{fontSize:12,fontWeight:700,color:"#111111",marginBottom:8}}>ADD IMAGE</div>
          <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
            <input style={{flex:1,border:`1px solid ${_theme.border}`,borderRadius:6,padding:"5px 9px",fontSize:12,fontFamily:_theme.font,minWidth:160}}
              placeholder="Paste image URL..." value={urlInput} onChange={e=>setUrlInput(e.target.value)}/>
            <button style={btn(true,true)} onClick={()=>{if(urlInput){onUpdate({image:urlInput,imageStatus:"uploaded"});setUrlInput("");setShowPanel(false);}}}>Add URL</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button style={btn(false,true)} onClick={()=>fileRef.current.click()}>Upload File</button>
            {post.image && <button style={btn(false,true,true)} onClick={()=>onUpdate({image:null,imageStatus:"none"})}>Remove</button>}
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
          </div>
          <p style={{fontSize:12,color:"#111111",fontStyle:"italic",margin:"8px 0 0"}}>Batch upload coming soon. For now, add one image per post.</p>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(initData);
  const [tab, setTab] = useState("pillars");
  const [pillarId, setPillarId] = useState(null);
  const [weekIdx, setWeekIdx] = useState(0);
  const [postKey, setPostKey] = useState(null);
  const [storyId, setStoryId] = useState(null);
  const [copied, setCopied] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [draftPillars, setDraftPillars] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [showRegenModal, setShowRegenModal] = useState(false);

  const role = ROLES[data.role] || ROLES.admin;

  // Theme state — re-render when theme changes
  const [themeName, setThemeName] = useState(() => {
    try { return localStorage.getItem("bv_theme") || "Bear Virtual"; } catch(e) { return "Bear Virtual"; }
  });
  const applyTheme = (name) => {
    _theme = THEMES[name] || THEMES["Bear Virtual"];
    try { localStorage.setItem("bv_theme", name); } catch(e) {}
    setThemeName(name);
  };

  // Inject theme CSS variables into document root on every theme change
  useEffect(() => {
    const t = _theme;
    const root = document.documentElement;
    root.style.setProperty("--bv-header",  t.headerBg);
    root.style.setProperty("--bv-primary", t.primary);
    root.style.setProperty("--bv-accent",  t.accent);
    root.style.setProperty("--bv-bg",      t.pageBg);
    root.style.setProperty("--bv-card",    t.cardBg);
    root.style.setProperty("--bv-text",    t.textPrimary);
    root.style.setProperty("--bv-muted",   t.textMuted);
    root.style.setProperty("--bv-border",  t.border);
    root.style.setProperty("--bv-font",    t.font);
    document.body.style.fontFamily = t.font;
    document.body.style.background = t.pageBg;
  }, [themeName]);

  // persist data on change
  useEffect(() => { save(data); }, [data]);

  const upd = useCallback((patch) => setData(d => ({...d,...patch})), []);

  // pillar helpers
  const getPillar = (id) => data.pillars.find(p=>p.id===id) || {name:"Unknown",emoji:"?",id};
  const updatePillar = (id, patch) => upd({pillars: data.pillars.map(p=>p.id===id?{...p,...patch}:p)});
  const updatePost = (wIdx, pIdx, patch) => upd({weeks: data.weeks.map((w,wi)=>wi!==wIdx?w:{...w,posts:w.posts.map((p,pi)=>pi!==pIdx?p:{...p,...patch})})});

  const copy = (tag) => { navigator.clipboard.writeText(tag).catch(()=>{}); setCopied(tag); setTimeout(()=>setCopied(null),1500); };

  // enter edit mode — snapshot pillars
  const enterEditMode = () => { setDraftPillars(JSON.parse(JSON.stringify(data.pillars))); setEditMode(true); };
  const cancelEditMode = () => { setDraftPillars(null); setEditMode(false); };

  const saveEditMode = () => {
    // check if pillars actually changed
    const changed = JSON.stringify(draftPillars) !== JSON.stringify(data.pillars);
    if (changed) setShowRegenModal(true);
    else { upd({pillars:draftPillars}); setEditMode(false); setDraftPillars(null); }
  };

  const confirmRegen = async () => {
    setShowRegenModal(false);
    // Capture pillars in local var BEFORE clearing state — state clears are async
    const pillarsToSave = draftPillars;
    // Save edits and close edit mode immediately so UI feels responsive
    upd({pillars: pillarsToSave});
    setEditMode(false);
    setDraftPillars(null);
    setAiLoading(true);
    setAiError(null);
    try {
      // Use local var — draftPillars state is null by now
      const result = await regeneratePillarContent(pillarsToSave);
      if (!result?.pillars) throw new Error("No pillars returned from API");
      // Merge regenerated ideas back into the already-saved pillars
      upd(prev => ({
        pillars: prev.pillars.map(p => {
          const regen = result.pillars.find(r => r.id === p.id);
          return regen ? {
            ...p,
            postIdeas:    regen.postIdeas    || p.postIdeas,
            storyIdeas:   regen.storyIdeas   || p.storyIdeas,
            hookFormulas: regen.hookFormulas  || p.hookFormulas,
          } : p;
        })
      }));
    } catch(e) {
      console.error("Regeneration error:", e);
      setAiError(`Regeneration failed: ${e.message}. Check that your Netlify function is deployed and ANTHROPIC_API_KEY is set.`);
    }
    setAiLoading(false);
  };

  const tabs = [
    {id:"pillars",label:"Content Pillars"},{id:"calendar",label:"30-Day Calendar"},
    {id:"stories",label:"Stories"},{id:"hashtags",label:"Hashtags"},
    {id:"repurpose",label:"Repurposing"},{id:"setup",label:"Setup"},{id:"kpis",label:"KPIs"},
  ];

  return (
    <div style={{fontFamily:_theme.font,background:_theme.pageBg,minHeight:"100vh",color:_theme.text,fontFamily:_theme.font}}>
      {/* ADMIN PANEL */}
      {showAdmin && (
        <div style={{position:"fixed",inset:0,background:"rgba(30,50,72,0.4)",zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"flex-end"}}>
          <div style={{background:_theme.cardBg,width:320,minHeight:"100vh",padding:24,boxShadow:"-4px 0 24px rgba(0,0,0,0.2)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <span style={{fontWeight:700,fontSize:16,color:"#111111"}}>⚙️ Admin Panel</span>
              <button style={btn(false,true)} onClick={()=>setShowAdmin(false)}>✕ Close</button>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontWeight:700,fontSize:12,color:"#111111",letterSpacing:"1px",marginBottom:6}}>BRAND THEME</div>
              <p style={{fontSize:12,color:"#111111",marginBottom:10,fontStyle:"italic",margin:"0 0 10px"}}>Switch to a client's brand colors. Add themes in the THEMES object in App.jsx.</p>
              {Object.keys(THEMES).filter(k=>k!=="__CLIENT_TEMPLATE__").map(name=>(
                <div key={name} onClick={()=>applyTheme(name)} style={{
                  display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"9px 12px",borderRadius:8,cursor:"pointer",marginBottom:6,
                  background:themeName===name?_theme.primary:_theme.pageBg,
                  border:`1px solid ${themeName===name?_theme.primary:_theme.border}`,
                  color:themeName===name?_theme.primaryText:_theme.textPrimary,transition:"all 0.15s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{display:"flex",gap:3}}>
                      {["dark","mid","accent"].map(k=>(
                        <div key={k} style={{width:13,height:13,borderRadius:3,background:THEMES[name][k],border:"1px solid rgba(0,0,0,0.2)"}}/>
                      ))}
                    </div>
                    <span style={{fontWeight:700,fontSize:13}}>{THEMES[name].name}</span>
                  </div>
                  {themeName===name && <span style={{fontSize:11}}>✓ Active</span>}
                </div>
              ))}
              <div style={{marginTop:8,padding:"10px 12px",background:_theme.sectionBg,borderRadius:8,border:`1px solid ${_theme.border}`}}>
                <div style={{fontWeight:700,fontSize:12,color:"#111111",marginBottom:4}}>ADD A CLIENT THEME</div>
                <p style={{fontSize:12,color:"#111111",margin:0,lineHeight:1.5}}>Copy the __CLIENT_TEMPLATE__ block in App.jsx, fill in the client's hex codes and font, give it their name, and it'll appear here automatically.</p>
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontWeight:700,fontSize:12,color:"#111111",letterSpacing:"1px",marginBottom:10}}>CLIENT ROLE</div>
              {Object.entries(ROLES).map(([key,r])=>(
                <div key={key} onClick={()=>upd({role:key})} style={{
                  display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"10px 13px",borderRadius:8,cursor:"pointer",marginBottom:6,
                  background:data.role===key?_theme.primary:_theme.pageBg,
                  border:`1px solid ${data.role===key?_theme.primary:_theme.border}`,
                  color:data.role===key?_theme.primaryText:_theme.textPrimary,transition:"all 0.15s"}}>
                  <span style={{fontWeight:700,fontSize:13}}>{r.label}</span>
                  {data.role===key && <span style={{fontSize:11}}>✓ Active</span>}
                </div>
              ))}
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontWeight:700,fontSize:12,color:"#111111",letterSpacing:"1px",marginBottom:10}}>PERMISSIONS (current role)</div>
              {Object.entries(role).filter(([k])=>k!=="label").map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #f0e8e0",fontSize:12}}>
                  <span style={{color:"#111111"}}>{k.replace(/([A-Z])/g," $1").toLowerCase()}</span>
                  <span style={{color:"#111111",fontWeight:700}}>{v?"✓ yes":"✗ no"}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:12,color:"#111111",letterSpacing:"1px",marginBottom:10}}>DATA</div>
              <button style={{...btn(false),width:"100%",marginBottom:8}} onClick={()=>{
                const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
                const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
                a.download = "den-system-export.json"; a.click();
              }}>⬇ Export JSON</button>
              <button style={{...btn(false,false,true),width:"100%"}} onClick={()=>{if(confirm("Reset all data to defaults?"))setData(initData());}}>↺ Reset to Defaults</button>
            </div>
          </div>
        </div>
      )}

      {/* REGEN MODAL */}
      {showRegenModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(30,50,72,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:_theme.cardBg,borderRadius:16,padding:28,maxWidth:440,width:"100%",boxShadow:"0 8px 40px rgba(0,0,0,0.2)"}}>
            <div style={{fontSize:22,marginBottom:10}}>🤖</div>
            <div style={{fontWeight:700,fontSize:17,color:"#111111",marginBottom:8}}>Regenerate AI suggestions?</div>
            <p style={{fontSize:13,color:"#111111",lineHeight:1.7,marginBottom:20}}>Your pillar edits will be saved. Would you also like Claude to regenerate post ideas, story ideas, and hook formulas based on the updated pillars? This uses the Anthropic API and takes about 10 seconds.</p>
            <div style={{display:"flex",gap:10}}>
              <button style={{...btn(true),flex:1}} onClick={confirmRegen}>Yes, regenerate suggestions</button>
              <button style={{...btn(false),flex:1}} onClick={()=>{upd({pillars:draftPillars});setEditMode(false);setDraftPillars(null);setShowRegenModal(false);}}>Save without regenerating</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{background:_theme.headerBg,padding:"20px 20px 0",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(42,68,185,0.3)"}}>
        <div style={{maxWidth:960,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:2}}>
                <span style={{fontSize:18,fontWeight:700,color:"#FFFFFF"}}>🐻 Bear Virtual</span>
                <span style={{fontSize:12,color:"#FFFFFF",fontFamily:"monospace",letterSpacing:"2px"}}>INSTAGRAM STRATEGY</span>
              </div>
              <p style={{margin:"0 0 12px",color:"#FFFFFF",fontSize:12,fontStyle:"italic"}}>Den System · {(data.kpis?.rhythm || "4 posts/week + 3–5 stories")} · Role: <strong style={{color:"#FFFFFF"}}>{role.label}</strong></p>
            </div>
            <div style={{display:"flex",gap:7,alignItems:"center",paddingBottom:12}}>
              {aiLoading && <span style={{fontSize:12,color:"#111111",fontStyle:"italic"}}>🤖 Regenerating...</span>}
              {aiError && <span style={{fontSize:12,color:"#FFFFFF",maxWidth:200,fontStyle:"italic"}}>{aiError}</span>}
              {role.canEditPillars && !editMode && (
                <button style={{padding:"6px 12px",borderRadius:6,border:"1px solid rgba(255,255,255,0.5)",cursor:"pointer",fontSize:12,fontFamily:_theme.font,fontWeight:600,background:"rgba(255,255,255,0.15)",color:"#FFFFFF",transition:"all 0.15s"}} onClick={enterEditMode}>✏️ Edit Mode</button>
              )}
              {editMode && (
                <>
                  <button style={{padding:"6px 12px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontFamily:_theme.font,fontWeight:600,background:"#FFED4A",color:"#111111",transition:"all 0.15s"}} onClick={saveEditMode}>💾 Save Changes</button>
                  <button style={{padding:"6px 12px",borderRadius:6,border:"1px solid rgba(255,255,255,0.4)",cursor:"pointer",fontSize:12,fontFamily:_theme.font,fontWeight:600,background:"transparent",color:"rgba(255,255,255,0.8)",transition:"all 0.15s"}} onClick={cancelEditMode}>Cancel</button>
                </>
              )}
              <button style={{padding:"6px 12px",borderRadius:6,border:"1px solid rgba(255,255,255,0.5)",cursor:"pointer",fontSize:12,fontFamily:_theme.font,fontWeight:600,background:"rgba(255,255,255,0.15)",color:"#FFFFFF",transition:"all 0.15s"}} onClick={()=>setShowAdmin(!showAdmin)}>⚙️ Admin</button>
            </div>
          </div>
          {editMode && (
            <div style={{background:"rgba(255,255,255,0.15)",border:"none",borderBottom:"1px solid rgba(255,255,255,0.2)",borderRadius:0,padding:"7px 14px",marginBottom:0,fontSize:12,color:"#FFFFFF"}}>
              ✏️ <strong>Global Edit Mode</strong> — Edit pillar names, descriptions, formats. Hit Save Changes when done. All suggestions will regenerate via AI.
            </div>
          )}
          <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
            {tabs.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                padding:"8px 13px",border:"none",cursor:"pointer",fontFamily:_theme.font,
                fontSize:tab===t.id?12:13,
                fontWeight:tab===t.id?700:500,
                letterSpacing:tab===t.id?"0.08em":"normal",
                textTransform:tab===t.id?"uppercase":"none",
                textDecoration:tab===t.id?`underline ${_theme.accent}`:"none",
                textDecorationThickness:tab===t.id?"2.5px":"none",
                textUnderlineOffset:tab===t.id?"4px":"none",
                background:"transparent",
                color:"#FFFFFF",
                borderRadius:"6px 6px 0 0",
                borderBottom:"3px solid transparent",
                transition:"all 0.15s",
                whiteSpace:"nowrap",
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"24px 18px 80px"}}>

        {/* ══ PILLARS ══ */}
        {tab==="pillars" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:16}}>
              <div>
                <h2 style={{fontSize:18,fontWeight:700,color:"#111111",margin:0}}>Content Pillars</h2>
                <p style={{color:"#111111",fontSize:13,margin:"4px 0 0",fontStyle:"italic"}}>Click any card to expand ideas. {editMode&&"Edit mode active — modify pillar details below."}</p>
              </div>
            </div>

            {/* Edit mode: full pillar editors */}
            {editMode && draftPillars && (
              <div style={{marginBottom:24}}>
                <div style={{fontWeight:700,fontSize:12,color:"#111111",letterSpacing:"1px",marginBottom:10}}>EDIT PILLARS — changes save together</div>
                {draftPillars.map((p,i)=>{
                  const pc = pillarColor(p.id);
                  return (
                    <div key={p.id} style={{...card({border:`2px solid ${pc.bd}30`,marginBottom:10}),padding:16}}>
                      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
                        <span style={{fontSize:22}}>{p.emoji}</span>
                        <div style={{flex:1}}>
                          <input value={p.name} onChange={e=>setDraftPillars(draft=>draft.map((d,di)=>di===i?{...d,name:e.target.value}:d))}
                            style={{width:"100%",border:`1px solid ${_theme.primary}`,borderRadius:6,padding:"5px 9px",fontFamily:_theme.font,fontSize:15,fontWeight:700,color:"#111111",background:_theme.pageBg}}/>
                        </div>
                        <select value={p.job} onChange={e=>setDraftPillars(draft=>draft.map((d,di)=>di===i?{...d,job:e.target.value}:d))}
                          style={{border:`1px solid ${_theme.border}`,borderRadius:6,padding:"5px 8px",fontFamily:_theme.font,fontSize:12,background:_theme.pageBg}}>
                          <option>Build Trust</option>
                          <option>Drive Action</option>
                          <option>Show Personality</option>
                          <option>Build Trust + Drive Action</option>
                        </select>
                      </div>
                      <div style={{marginBottom:8}}>
                        <div style={{fontSize:12,color:"#111111",fontWeight:700,marginBottom:4}}>DESCRIPTION</div>
                        <textarea value={p.desc} onChange={e=>setDraftPillars(draft=>draft.map((d,di)=>di===i?{...d,desc:e.target.value}:d))}
                          rows={2} style={{width:"100%",border:`1px solid ${_theme.border}`,borderRadius:6,padding:"6px 9px",fontFamily:_theme.font,fontSize:13,background:_theme.pageBg,resize:"vertical"}}/>
                      </div>
                      <div>
                        <div style={{fontSize:12,color:"#111111",fontWeight:700,marginBottom:4}}>FORMATS</div>
                        <input value={p.formats} onChange={e=>setDraftPillars(draft=>draft.map((d,di)=>di===i?{...d,formats:e.target.value}:d))}
                          style={{width:"100%",border:`1px solid ${_theme.border}`,borderRadius:6,padding:"5px 9px",fontFamily:_theme.font,fontSize:13,background:_theme.pageBg}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pillar cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:10}}>
              {data.pillars.map(p=>{
                const pc = pillarColor(p.id);
                return (
                  <div key={p.id} onClick={()=>setPillarId(pillarId===p.id?null:p.id)}
                    style={{background:_theme.cardBg,border:`2px solid ${pillarId===p.id?_theme.primary:_theme.border}`,borderRadius:12,padding:16,cursor:"pointer",
                      transition:"all 0.18s",boxShadow:pillarId===p.id?`0 4px 16px ${_theme.primary}18`:"0 1px 3px rgba(30,50,72,0.06)",
                      transform:pillarId===p.id?"translateY(-2px)":"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <span style={{fontSize:24}}>{p.emoji}</span>
                      <span style={{...pill("#111111",pc.bg)}}>{p.job}</span>
                    </div>
                    <div style={{fontWeight:700,fontSize:14,color:"#111111",marginBottom:2}}>{p.name}</div>
                    <div style={{fontSize:12,color:"#111111",marginBottom:3}}>{p.freq}</div>
                    <div style={{fontSize:12,color:"#111111",fontStyle:"italic",marginBottom:8}}>{p.formats}</div>
                    <div style={{fontSize:12,color:"#111111",fontWeight:700}}>{pillarId===p.id?"▲ collapse":"▼ see ideas"}</div>
                  </div>
                );
              })}
            </div>

            {/* Expanded pillar */}
            {pillarId!==null && (()=>{
              const p = data.pillars.find(x=>x.id===pillarId);
              if(!p) return null;
              const pc = pillarColor(p.id);
              return (
                <div style={{marginTop:16,background:_theme.cardBg,border:`2px solid ${_theme.primary}`,borderRadius:14,padding:22}}>
                  <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:12}}>
                    <span style={{fontSize:28}}>{p.emoji}</span>
                    <div><div style={{fontWeight:700,fontSize:16,color:"#111111"}}>{p.name}</div>
                      <div style={{fontSize:12,color:"#111111",fontStyle:"italic"}}>{p.freq} · {p.formats}</div></div>
                  </div>
                  <p style={{fontSize:13,color:"#111111",lineHeight:1.7,marginBottom:16,padding:"11px 14px",background:_theme.sectionBg,borderRadius:8,borderLeft:`3px solid ${_theme.primary}`}}>{p.desc}</p>
                  {/* Post ideas */}
                  <div style={{marginBottom:16}}>
                    <div style={{fontWeight:700,fontSize:12,color:"#111111",letterSpacing:"1px",marginBottom:8}}>POST IDEA BANK</div>
                    {p.postIdeas.map((idea,i)=>(
                      <div key={i} style={{display:"flex",gap:8,justifyContent:"space-between",alignItems:"flex-start",padding:"8px 11px",background:_theme.sectionBg,borderRadius:7,fontSize:13,color:"#111111",marginBottom:5}}>
                        <div style={{display:"flex",gap:8}}>
                          <span style={{color:"#111111",fontWeight:700,minWidth:16}}>{i+1}.</span>
                          <InlineEdit value={idea} disabled={!role.canEditIdeas}
                            onChange={v=>updatePillar(p.id,{postIdeas:p.postIdeas.map((x,xi)=>xi===i?v:x)})}
                            style={{fontSize:13,color:"#111111"}}/>
                        </div>
                        {role.canEditIdeas && <button style={{...btn(false,true,true),padding:"2px 7px",flexShrink:0}} onClick={()=>updatePillar(p.id,{postIdeas:p.postIdeas.filter((_,xi)=>xi!==i)})}>✕</button>}
                      </div>
                    ))}
                    {role.canEditIdeas && (
                      <button style={{...btn(false,true),marginTop:4}} onClick={()=>updatePillar(p.id,{postIdeas:[...p.postIdeas,"New post idea — click to edit"]})}>+ Add Idea</button>
                    )}
                  </div>
                  {/* Hook formulas */}
                  <div>
                    <div style={{fontWeight:700,fontSize:12,color:"#111111",letterSpacing:"1px",marginBottom:8}}>HOOK FORMULAS</div>
                    {p.hookFormulas.map((h,i)=>(
                      <div key={i} style={{display:"flex",gap:8,justifyContent:"space-between",alignItems:"flex-start",padding:"7px 11px",background:_theme.sectionBg,borderRadius:7,fontSize:12,color:"#111111",marginBottom:5,fontStyle:"italic"}}>
                        <InlineEdit value={h} disabled={!role.canEditIdeas}
                          onChange={v=>updatePillar(p.id,{hookFormulas:p.hookFormulas.map((x,xi)=>xi===i?v:x)})}
                          style={{fontSize:12,color:"#111111"}}/>
                        {role.canEditIdeas && <button style={{...btn(false,true,true),padding:"2px 7px",flexShrink:0}} onClick={()=>updatePillar(p.id,{hookFormulas:p.hookFormulas.filter((_,xi)=>xi!==i)})}>✕</button>}
                      </div>
                    ))}
                    {role.canEditIdeas && (
                      <button style={{...btn(false,true),marginTop:4}} onClick={()=>updatePillar(p.id,{hookFormulas:[...p.hookFormulas,"[Hook formula] — click to edit"]})}>+ Add Formula</button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ══ CALENDAR ══ */}
        {tab==="calendar" && (
          <div>
            <h2 style={{fontSize:18,fontWeight:700,color:"#111111",margin:"0 0 4px"}}>30-Day Starter Calendar</h2>
            <p style={{color:"#111111",fontSize:13,marginBottom:18,fontStyle:"italic"}}>One Key Focus per week. Every other post supports it from a different angle. Click a post to expand.</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:16}}>
              {data.weeks.map((w,i)=>(
                <button key={i} onClick={()=>{setWeekIdx(i);setPostKey(null);}} style={{
                  padding:"10px 7px",borderRadius:10,cursor:"pointer",fontFamily:_theme.font,
                  border:`2px solid ${weekIdx===i?_theme.primary:_theme.border}`,background:weekIdx===i?_theme.primary:_theme.cardBg,
                  color:weekIdx===i?_theme.primaryText:_theme.textPrimary,transition:"all 0.15s"}}>
                  <div style={{fontWeight:700,fontSize:13}}>Week {w.week}</div>
                  <div style={{fontWeight:400,fontSize:12,marginTop:2,opacity:0.85,lineHeight:1.3}}>{w.label}</div>
                </button>
              ))}
            </div>
            <div style={{background:data.weeks[weekIdx].tc,color:"#FFFFFF",padding:"13px 16px",borderRadius:10,marginBottom:12}}>
              <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                <span style={{fontSize:16,marginTop:1}}>🎯</span>
                <div>
                  <div style={{fontSize:12,color:"#FFFFFF",fontWeight:700,letterSpacing:"1px",marginBottom:3}}>WEEK {data.weeks[weekIdx].week} OBJECTIVE</div>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{data.weeks[weekIdx].obj}</div>
                  <div style={{fontSize:12,color:"#FFFFFF",lineHeight:1.6,fontStyle:"italic"}}>{data.weeks[weekIdx].theme}</div>
                </div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {data.weeks[weekIdx].posts.map((p,i)=>{
                const pillar = getPillar(p.pillarId);
                const pc = pillarColor(p.pillarId);
                const dayStyle = getDayStyle(); const dc = dayStyle[p.day] || {bg:_theme.primary,tx:"#fff"};
                const key = `${weekIdx}-${i}`;
                const open = postKey===key;
                return (
                  <div key={i} style={{background:_theme.cardBg,border:`2px solid ${open?_theme.primary:_theme.border}`,borderRadius:12,overflow:"hidden",transition:"all 0.18s",boxShadow:open?`0 4px 16px ${_theme.primary}18`:"0 1px 3px rgba(30,50,72,0.06)"}}>
                    <div style={{display:"flex",alignItems:"stretch",minHeight:64}} onClick={()=>setPostKey(open?null:key)}>
                      <div style={{background:dc.bg,color:dc.tx,padding:"0 12px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,minWidth:54,textAlign:"center",cursor:"pointer"}}>{p.day}</div>
                      <div style={{padding:"10px 12px",flex:1,cursor:"pointer"}}>
                        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap",marginBottom:4}}>
                          {p.kf && <span style={{fontSize:12,fontWeight:700,background:_theme.accent,padding:"2px 8px",borderRadius:20,color:_theme.accentText}}>🎯 KEY FOCUS</span>}
                          <span style={{...pill("#111111",pc.bg)}}>{pillar.emoji} {pillar.name}</span>
                          <span style={{fontSize:12,color:"#111111",fontStyle:"italic"}}>{p.fmt}</span>
                          {p.imageStatus==="approved" && <span style={{...pill("#111111","#eef8f2")}}>✓ Image Approved</span>}
                          {p.imageStatus==="uploaded" && <span style={{...pill("#111111","#EBF0FC")}}>📎 Image Pending</span>}
                          {p.imageStatus==="rejected" && <span style={{...pill("#111111","#fde8e8")}}>✗ Revision Needed</span>}
                        </div>
                        <div style={{fontSize:12,color:"#111111",fontStyle:"italic",marginBottom:3}}>Angle: {p.angle}</div>
                        <div style={{fontSize:13,fontWeight:600,color:"#111111",lineHeight:1.4}}>"{p.hook}"</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",padding:"0 11px",color:"#111111",fontSize:13,cursor:"pointer"}}>{open?"▲":"▼"}</div>
                    </div>
                    {open && (
                      <div style={{borderTop:"1px solid #f0e8e0",padding:"14px 16px"}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                          <div style={{background:_theme.sectionBg,borderRadius:8,padding:12}}>
                            <div style={{fontSize:12,fontWeight:700,color:"#111111",letterSpacing:"1px",marginBottom:6}}>HOOK</div>
                            <InlineEdit value={p.hook} disabled={!role.canEditCaptions}
                              onChange={v=>updatePost(weekIdx,i,{hook:v})} multiline
                              style={{fontSize:13,color:"#111111",lineHeight:1.6}}/>
                          </div>
                          <div style={{background:_theme.sectionBg,borderRadius:8,padding:12}}>
                            <div style={{fontSize:12,fontWeight:700,color:"#111111",letterSpacing:"1px",marginBottom:6}}>GRAPHIC BRIEF</div>
                            <InlineEdit value={p.gfx} disabled={!role.canEditCaptions}
                              onChange={v=>updatePost(weekIdx,i,{gfx:v})} multiline
                              style={{fontSize:13,color:"#111111",lineHeight:1.65}}/>
                          </div>
                        </div>
                        <div style={{background:_theme.sectionBg,borderRadius:8,padding:12,marginBottom:12}}>
                          <div style={{fontSize:12,fontWeight:700,color:"#111111",letterSpacing:"1px",marginBottom:6}}>CAPTION DIRECTION</div>
                          <InlineEdit value={p.cap} disabled={!role.canEditCaptions}
                            onChange={v=>updatePost(weekIdx,i,{cap:v})} multiline
                            style={{fontSize:13,color:"#111111",lineHeight:1.65,width:"100%"}}/>
                        </div>
                        <ImageUpload post={p} canUpload={role.canUploadImages} canApprove={role.canApprove}
                          onUpdate={patch=>updatePost(weekIdx,i,patch)}/>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:14,...card()}}>
              <div style={{fontWeight:700,fontSize:12,color:"#111111",letterSpacing:"1px",marginBottom:9}}>📅 6-WEEK ROTATION</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {data.pillars.map((p,i)=>(
                  <div key={i} style={{background:_theme.pageBg,border:`1px solid ${_theme.border}`,borderRadius:7,padding:"5px 10px",fontSize:12}}>
                    <span style={{color:"#111111",fontWeight:700}}>Wk {i+1}</span>
                    <span style={{color:"#111111",marginLeft:5}}>{p.emoji} {p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ STORIES ══ */}
        {tab==="stories" && (
          <div>
            <h2 style={{fontSize:18,fontWeight:700,color:"#111111",margin:"0 0 4px"}}>Stories Strategy</h2>
            <p style={{color:"#111111",fontSize:13,marginBottom:14,fontStyle:"italic"}}>3–5 Stories per week. Click any category to expand and edit ideas.</p>
            <div style={{background:_theme.headerBg,color:_theme.textOnDark,borderRadius:12,padding:"13px 16px",marginBottom:14}}>
              <div style={{fontSize:12,color:"#FFFFFF",fontWeight:700,letterSpacing:"1px",marginBottom:5}}>POSTS VS STORIES</div>
              <p style={{fontSize:13,lineHeight:1.7,margin:0}}><strong style={{color:"#FFFFFF"}}>Posts are billboards. Stories are text messages.</strong> Posts build your audience and searchable archive. Stories maintain your relationship with the audience you already have. Don't try to grow from Stories — use them for depth.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:14}}>
              {[{t:"Stories disappear in 24 hours",d:"Lower stakes, more casual, don't need to be polished. A quick BTS photo works fine in a Story — it would look out of place in your feed."},
                {t:"Stories are for existing followers",d:"Only people who already follow you see them. Focus on deepening the relationship, not growing."},
                {t:"Stories should invite interaction",d:"Polls, question boxes, sliders. Every interaction signals to the algorithm your followers are engaged."},
                {t:"3–5 per week minimum",d:"Going dark for a week makes people forget you exist. Aim for at least 3 days with one Story each."}
              ].map((item,i)=>(<div key={i} style={{...card({padding:13})}}>
                <div style={{fontWeight:700,fontSize:13,color:"#111111",marginBottom:4}}>{item.t}</div>
                <p style={{fontSize:12,color:"#111111",lineHeight:1.6,margin:0}}>{item.d}</p>
              </div>))}
            </div>
            <div style={{fontWeight:700,fontSize:12,color:"#111111",letterSpacing:"1px",marginBottom:9}}>STORY CATEGORIES</div>
            {data.stories.map((cat,ci)=>{
              const open = storyId===cat.id;
              return (
                <div key={cat.id} style={{background:_theme.cardBg,border:`2px solid ${open?_theme.primary:_theme.border}`,borderRadius:12,overflow:"hidden",marginBottom:8,transition:"all 0.18s"}}>
                  <div onClick={()=>setStoryId(open?null:cat.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"13px 14px",cursor:"pointer"}}>
                    <span style={{fontSize:20}}>{cat.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13,color:"#111111",marginBottom:1}}>{cat.name}</div>
                      <div style={{fontSize:12,color:"#111111",fontStyle:"italic"}}>{cat.freq}</div>
                    </div>
                    <div style={{color:"#111111",fontSize:13}}>{open?"▲":"▼"}</div>
                  </div>
                  {open && (
                    <div style={{borderTop:"1px solid #f0e8e0",padding:"13px 14px"}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:12}}>
                        <div style={{background:_theme.sectionBg,borderRadius:8,padding:11}}>
                          <div style={{fontSize:12,fontWeight:700,color:"#111111",letterSpacing:"1px",marginBottom:5}}>WHAT IT IS</div>
                          <p style={{fontSize:13,color:"#111111",lineHeight:1.6,margin:0}}>{cat.what}</p>
                        </div>
                        <div style={{background:"#f0f8f2",borderRadius:8,padding:11}}>
                          <div style={{fontSize:12,fontWeight:700,color:"#111111",letterSpacing:"1px",marginBottom:5}}>WHY IT WORKS</div>
                          <p style={{fontSize:13,color:"#111111",lineHeight:1.6,margin:0}}>{cat.why}</p>
                        </div>
                      </div>
                      <div style={{fontSize:12,fontWeight:700,color:"#111111",letterSpacing:"1px",marginBottom:7}}>STORY IDEAS</div>
                      {cat.ideas.map((idea,ii)=>(
                        <div key={ii} style={{display:"flex",gap:8,justifyContent:"space-between",alignItems:"flex-start",padding:"7px 10px",background:_theme.sectionBg,borderRadius:7,marginBottom:5}}>
                          <div style={{display:"flex",gap:7,flex:1}}>
                            <span style={{color:"#111111",fontWeight:700,minWidth:15,fontSize:13}}>{ii+1}.</span>
                            <InlineEdit value={idea} disabled={!role.canEditIdeas}
                              onChange={v=>upd({stories:data.stories.map((s,si)=>si!==ci?s:{...s,ideas:s.ideas.map((x,xi)=>xi===ii?v:x)})})}
                              style={{fontSize:13,color:"#111111"}}/>
                          </div>
                          {role.canEditIdeas && <button style={{...btn(false,true,true),padding:"2px 6px",flexShrink:0}} onClick={()=>upd({stories:data.stories.map((s,si)=>si!==ci?s:{...s,ideas:s.ideas.filter((_,xi)=>xi!==ii)})})}>✕</button>}
                        </div>
                      ))}
                      {role.canEditIdeas && (
                        <button style={{...btn(false,true),marginTop:4}} onClick={()=>upd({stories:data.stories.map((s,si)=>si!==ci?s:{...s,ideas:[...s.ideas,"New story idea — click to edit"]})})}>+ Add Idea</button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ══ HASHTAGS ══ */}
        {tab==="hashtags" && (
          <div>
            <h2 style={{fontSize:18,fontWeight:700,color:"#111111",margin:"0 0 4px"}}>Hashtag Strategy</h2>
            <p style={{color:"#111111",fontSize:13,marginBottom:14,fontStyle:"italic"}}>Instagram enforces a 5-hashtag limit as of December 2025. Make every slot count.</p>
            <div style={{background:_theme.headerBg,color:_theme.textOnDark,borderRadius:12,padding:"13px 16px",marginBottom:14}}>
              <div style={{fontSize:12,color:"#FFFFFF",fontWeight:700,letterSpacing:"1px",marginBottom:5}}>THE 2026 RULE</div>
              <p style={{fontSize:13,lineHeight:1.7,margin:"0 0 6px",color:"#FFFFFF"}}><strong>5 hashtags max — platform enforced.</strong> Hashtags are now classification signals, not traffic sources. Instagram reads them to understand who should see your content. Choose the 5 most precise tags for each specific post.</p>
              <p style={{fontSize:12,color:"#FFFFFF",fontStyle:"italic",margin:0}}>Post count threshold still matters: for new accounts, smaller hashtags give you a better signal-to-noise ratio. But precision beats volume — a well-matched 500k tag beats a vague 5k tag.</p>
              <p style={{fontSize:12,color:"#FFFFFF",fontStyle:"italic",margin:"8px 0 0"}}>⚠️ Note: post counts below are estimates. Always verify in the Instagram app: Search → Tags → type the hashtag to see the current count.</p>
            </div>
            {["brand","micro","niche","avoid"].map(tier=>{
              const meta = TIER_META[tier];
              const tags = data.hashtags.filter(h=>h.tier===tier);
              return (
                <div key={tier} style={{...card({border:`2px solid ${meta.color}30`,marginBottom:12})}}>
                  <div style={{fontWeight:700,fontSize:12,color:meta.color,letterSpacing:"1px",marginBottom:3}}>{meta.label}</div>
                  <p style={{fontSize:12,color:"#111111",marginBottom:12,fontStyle:"italic"}}>{meta.sub}</p>
                  {tags.map((ht,ti)=>(
                    <div key={ht.id} style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}>
                      <button disabled={!ht.copyable} onClick={()=>ht.copyable&&copy(ht.tag)} style={{
                        padding:"5px 12px",borderRadius:20,border:`1px solid ${meta.color}50`,
                        cursor:ht.copyable?"pointer":"default",opacity:tier==="avoid"?0.5:1,
                        background:copied===ht.tag?meta.color:meta.bg,
                        color:copied===ht.tag?"#fff":meta.color,
                        fontSize:12,fontFamily:"monospace",fontWeight:600,transition:"all 0.15s",
                        textDecoration:tier==="avoid"?"line-through":"none",
                      }}>{copied===ht.tag?"✓ copied!":ht.tag}</button>
                      <InlineEdit value={ht.note} disabled={!role.canEditHashtags}
                        onChange={v=>upd({hashtags:data.hashtags.map(h=>h.id===ht.id?{...h,note:v}:h)})}
                        style={{fontSize:12,color:"#111111",fontStyle:"italic"}}/>
                      {role.canEditHashtags && tier!=="avoid" && (
                        <button style={{...btn(false,true,true),padding:"2px 6px",flexShrink:0}} onClick={()=>upd({hashtags:data.hashtags.filter(h=>h.id!==ht.id)})}>✕</button>
                      )}
                    </div>
                  ))}
                  {role.canEditHashtags && tier!=="avoid" && (
                    <button style={{...btn(false,true),marginTop:6}} onClick={()=>upd({hashtags:[...data.hashtags,{id:uid(),tag:"#NewTag",tier,note:"Add post count — verify in app",copyable:true}]})}>+ Add Tag</button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ══ REPURPOSING ══ */}
        {tab==="repurpose" && (
          <div>
            <h2 style={{fontSize:18,fontWeight:700,color:"#111111",margin:"0 0 4px"}}>Content Repurposing Map</h2>
            <p style={{color:"#111111",fontSize:13,marginBottom:18,fontStyle:"italic"}}>Build once on Instagram. Let it travel. One post becomes five.</p>
            {[
              {from:"Instagram Carousel",to:"Blog Post",icon:"📝",how:"A 5-slide carousel = a 400-word blog post outline. Expand each slide into a paragraph. Add intro and conclusion. Publish to /blog."},
              {from:"Tips Post",to:"Email Newsletter",icon:"📧",how:"Take the top 3 tips. Add one sentence of intro, one of context per tip, and a CTA at the end. 200-word newsletter in 10 minutes."},
              {from:"Client Story Post",to:"FAQ Answer",icon:"❓",how:"Every client story answers 'does this work for businesses like mine?' Add it to the FAQ page under the relevant industry section."},
              {from:"Feed Post",to:"Facebook",icon:"👥",how:"Auto-repost via Meta Business Suite. Same image, same caption. Add 1–2 sentences of context or a question at the end."},
              {from:"Reel",to:"YouTube Short",icon:"▶️",how:"Download the Reel, upload to YouTube Shorts. Same content, second platform, zero extra work."},
              {from:"Hot Take Post",to:"Threads / Text Post",icon:"💬",how:"Strip the graphic. Post the hook line and 2–3 sentences as plain text. Text-first content travels differently."},
            ].map((r,i)=>(
              <div key={i} style={{background:_theme.cardBg,border:"1px solid #e0d4c8",borderRadius:12,overflow:"hidden",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"stretch"}}>
                  <div style={{background:_theme.primary,color:_theme.primaryText,padding:"12px 14px",display:"flex",flexDirection:"column",justifyContent:"center",minWidth:110,textAlign:"center",flexShrink:0}}>
                    <div style={{fontSize:16,marginBottom:2}}>{r.icon}</div>
                    <div style={{fontSize:12,color:"#FFFFFF",fontWeight:700,letterSpacing:"1px",marginBottom:2}}>FROM</div>
                    <div style={{fontSize:12,fontWeight:700}}>{r.from}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",padding:"0 9px",color:"#111111",fontSize:16,flexShrink:0}}>→</div>
                  <div style={{background:"#f0f8f2",padding:"12px 14px",display:"flex",flexDirection:"column",justifyContent:"center",minWidth:100,textAlign:"center",flexShrink:0}}>
                    <div style={{fontSize:12,color:"#FFFFFF",fontWeight:700,letterSpacing:"1px",marginBottom:2}}>TO</div>
                    <div style={{fontSize:12,fontWeight:700,color:"#111111"}}>{r.to}</div>
                  </div>
                  <div style={{padding:"12px 14px",flex:1,display:"flex",alignItems:"center"}}>
                    <p style={{fontSize:13,color:"#111111",lineHeight:1.6,margin:0}}>{r.how}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ SETUP ══ */}
        {tab==="setup" && (
          <SetupTab data={data} upd={upd} role={role} theme={_theme} />
        )}

        {/* ══ KPIs ══ */}
        {tab==="kpis" && (
          <KPITab data={data} upd={upd} role={role} theme={_theme} />
        )}
      </div>
    </div>
  );
}

// ─── SETUP TAB ────────────────────────────────────────────────────────────────
function SetupTab({ data, upd, role, theme }) {
  const [newTask, setNewTask]   = useState("");
  const [newForm, setNewForm]   = useState({label:"", url:""});
  const [showAdd, setShowAdd]   = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const tasks = data.setupTasks || [
    {id:"t1", label:"Switch to Business Account",    detail:"Settings > Account > Switch to Professional Account",       done:false},
    {id:"t2", label:"Profile photo: your headshot",  detail:"Same as the website. Not the logo. People hire people.",    done:false},
    {id:"t3", label:"Display name",                  detail:"Bear Virtual  —or—  Bear Virtual | Web & Content for Small Biz", done:false},
    {id:"t4", label:"Bio (150 chars max)",            detail:"Websites + content for small businesses 🐻 | Home services · wellness · beauty | Book a free discovery call 👇", done:false},
    {id:"t5", label:"Link in bio",                   detail:"Linktree with 3 links: Free Discovery Call · Services · FAQ", done:false},
    {id:"t6", label:"Story Highlights (day 1)",      detail:"Our Work · Services · How It Works · Client Wins",          done:false},
    {id:"t7", label:"Connect to Facebook Page",      detail:"Settings > Linked Accounts > Facebook. Enables auto-repost.", done:false},
    {id:"t8", label:"Set up Meta Business Suite",    detail:"business.facebook.com — scheduling, insights, cross-posting", done:false},
  ];

  const forms = data.clientForms || [];

  const toggleTask = (id) => upd({setupTasks: tasks.map(t => t.id===id ? {...t, done:!t.done} : t)});
  const deleteTask = (id) => upd({setupTasks: tasks.filter(t => t.id!==id)});
  const addTask = () => {
    if (!newTask.trim()) return;
    upd({setupTasks: [...tasks, {id:"t"+Date.now(), label:newTask.trim(), detail:"", done:false}]});
    setNewTask(""); setShowAdd(false);
  };
  const addForm = () => {
    if (!newForm.label.trim()) return;
    upd({clientForms: [...forms, {id:"f"+Date.now(), ...newForm}]});
    setNewForm({label:"",url:""}); setShowAddForm(false);
  };
  const deleteForm = (id) => upd({clientForms: forms.filter(f => f.id!==id)});

  const btn = (primary) => ({
    padding:"6px 14px", borderRadius:6, border:"none", cursor:"pointer",
    fontSize:12, fontFamily:theme.font, fontWeight:600,
    background:primary?theme.primary:theme.sectionBg,
    color:primary?"#FFFFFF":"#111111", transition:"all 0.15s",
  });

  const completedCount = tasks.filter(t=>t.done).length;

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
        <h2 style={{fontSize:18,fontWeight:700,color:"#111111",margin:0}}>Account Setup</h2>
        <span style={{fontSize:13,color:"#111111"}}>{completedCount}/{tasks.length} complete</span>
      </div>
      <p style={{color:"#111111",fontSize:13,marginBottom:18,fontStyle:"italic"}}>
        One-time setup tasks. Check off as you go. Add tasks specific to your client.
      </p>

      {/* Progress bar */}
      <div style={{background:theme.sectionBg,borderRadius:20,height:6,marginBottom:20,overflow:"hidden"}}>
        <div style={{background:theme.primary,height:"100%",borderRadius:20,
          width:`${tasks.length ? (completedCount/tasks.length)*100 : 0}%`,transition:"width 0.3s"}}/>
      </div>

      {/* Tasks */}
      {tasks.map(task => (
        <div key={task.id} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"12px 14px",
          background:task.done?"#EBF0FC":"#FFFFFF",
          border:`2px solid ${task.done?theme.primary:theme.border}`,
          borderRadius:10,marginBottom:7,transition:"all 0.18s"}}>
          <div onClick={()=>toggleTask(task.id)}
            style={{width:20,height:20,borderRadius:5,flexShrink:0,marginTop:1,cursor:"pointer",
              border:`2px solid ${task.done?theme.primary:theme.border}`,
              background:task.done?theme.primary:"transparent",
              display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.18s"}}>
            {task.done && <span style={{color:"#FFFFFF",fontSize:11,fontWeight:700}}>✓</span>}
          </div>
          <div style={{flex:1}} onClick={()=>toggleTask(task.id)}>
            <div style={{fontWeight:700,fontSize:13,color:"#111111",
              textDecoration:task.done?"line-through":"none",marginBottom:2,cursor:"pointer"}}>{task.label}</div>
            {task.detail && <div style={{fontSize:12,color:"#111111",fontStyle:"italic",lineHeight:1.5}}>{task.detail}</div>}
          </div>
          {role.canEditIdeas && (
            <button onClick={()=>deleteTask(task.id)}
              style={{background:"transparent",border:"none",cursor:"pointer",color:"#111111",fontSize:16,padding:"0 4px",lineHeight:1,flexShrink:0}}>×</button>
          )}
        </div>
      ))}

      {/* Add task */}
      {role.canEditIdeas && (
        <div style={{marginBottom:24}}>
          {showAdd ? (
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <input value={newTask} onChange={e=>setNewTask(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addTask()}
                placeholder="New task..."
                style={{flex:1,border:`1px solid ${theme.border}`,borderRadius:7,padding:"8px 12px",
                  fontSize:13,fontFamily:theme.font,color:"#111111",background:"#FFFFFF"}}/>
              <button style={btn(true)} onClick={addTask}>Add</button>
              <button style={btn(false)} onClick={()=>{setShowAdd(false);setNewTask("");}}>Cancel</button>
            </div>
          ) : (
            <button style={{...btn(false),marginTop:8}} onClick={()=>setShowAdd(true)}>+ Add Task</button>
          )}
        </div>
      )}

      {/* Client Forms & Resources */}
      <div style={{borderTop:`2px solid ${theme.border}`,paddingTop:20,marginTop:4}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <div style={{fontWeight:700,fontSize:15,color:"#111111",marginBottom:2}}>Client Forms & Resources</div>
            <div style={{fontSize:12,color:"#111111",fontStyle:"italic"}}>Drop intake forms, monthly update links, or any client reference docs here.</div>
          </div>
          {role.canEditIdeas && (
            <button style={btn(true)} onClick={()=>setShowAddForm(!showAddForm)}>+ Add Link</button>
          )}
        </div>

        {forms.length === 0 && !showAddForm && (
          <div style={{padding:"20px 16px",background:theme.sectionBg,borderRadius:10,textAlign:"center",
            border:`1px dashed ${theme.border}`}}>
            <div style={{fontSize:13,color:"#111111",marginBottom:4}}>No forms added yet.</div>
            <div style={{fontSize:12,color:"#111111",fontStyle:"italic"}}>Add links to your intake form, monthly update form, or any Google Docs your client needs.</div>
          </div>
        )}

        {forms.map(form => (
          <div key={form.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",
            background:"#FFFFFF",border:`1px solid ${theme.border}`,borderRadius:10,marginBottom:7}}>
            <span style={{fontSize:18}}>📋</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13,color:"#111111"}}>{form.label}</div>
              {form.url && (
                <a href={form.url} target="_blank" rel="noreferrer"
                  style={{fontSize:12,color:theme.primary,textDecoration:"none",fontStyle:"italic"}}>
                  {form.url.length>50 ? form.url.slice(0,50)+"..." : form.url}
                </a>
              )}
            </div>
            {form.url && (
              <a href={form.url} target="_blank" rel="noreferrer"
                style={{...btn(true),textDecoration:"none",fontSize:11}}>Open →</a>
            )}
            {role.canEditIdeas && (
              <button onClick={()=>deleteForm(form.id)}
                style={{background:"transparent",border:"none",cursor:"pointer",color:"#111111",fontSize:16,padding:"0 4px"}}>×</button>
            )}
          </div>
        ))}

        {showAddForm && role.canEditIdeas && (
          <div style={{background:theme.sectionBg,borderRadius:10,padding:14,marginTop:8,border:`1px solid ${theme.border}`}}>
            <div style={{fontSize:12,fontWeight:700,color:"#111111",marginBottom:10}}>ADD FORM OR RESOURCE</div>
            <input value={newForm.label} onChange={e=>setNewForm(f=>({...f,label:e.target.value}))}
              placeholder="Label (e.g. Monthly Update Form)"
              style={{width:"100%",border:`1px solid ${theme.border}`,borderRadius:7,padding:"8px 12px",
                fontSize:13,fontFamily:theme.font,color:"#111111",background:"#FFFFFF",marginBottom:8,boxSizing:"border-box"}}/>
            <input value={newForm.url} onChange={e=>setNewForm(f=>({...f,url:e.target.value}))}
              placeholder="URL (e.g. https://forms.google.com/...)"
              style={{width:"100%",border:`1px solid ${theme.border}`,borderRadius:7,padding:"8px 12px",
                fontSize:13,fontFamily:theme.font,color:"#111111",background:"#FFFFFF",marginBottom:10,boxSizing:"border-box"}}/>
            <div style={{display:"flex",gap:8}}>
              <button style={btn(true)} onClick={addForm}>Save</button>
              <button style={btn(false)} onClick={()=>{setShowAddForm(false);setNewForm({label:"",url:""});}}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── KPI TAB ──────────────────────────────────────────────────────────────────
function KPITab({ data, upd, role, theme }) {
  // KPI values stored in data.kpis — editable, crosslinked to header subtitle
  const kpis = data.kpis || {
    goal:    "1 discovery call booked",
    signal:  "Post Saves",
    rhythm:  "4 posts + 3–5 stories/week",
    watch:   "Link-in-bio clicks",
  };
  const setKpi = (k, v) => upd({kpis:{...kpis,[k]:v}});

  const KPICard = ({k, label, note, bg}) => (
    <div style={{background:bg,border:`1px solid ${theme.border}`,borderRadius:12,padding:14}}>
      <div style={{fontSize:11,fontWeight:700,color:"#111111",letterSpacing:"1px",marginBottom:6}}>{label.toUpperCase()}</div>
      <InlineEdit value={kpis[k]} disabled={!role.canEditCalendar}
        onChange={v=>setKpi(k,v)}
        style={{fontSize:14,fontWeight:700,color:"#111111",display:"block",marginBottom:6}}/>
      <p style={{fontSize:12,color:"#111111",margin:0,lineHeight:1.5}}>{note}</p>
    </div>
  );

  return (
    <div>
      <h2 style={{fontSize:18,fontWeight:700,color:"#111111",margin:"0 0 4px"}}>KPIs & Success Metrics</h2>
      <p style={{color:"#111111",fontSize:13,marginBottom:6,fontStyle:"italic"}}>
        Click any value to edit. Posting Rhythm updates the header subtitle automatically.
      </p>
      <div style={{fontSize:12,color:"#111111",fontStyle:"italic",marginBottom:18,
        padding:"8px 12px",background:theme.sectionBg,borderRadius:7,border:`1px solid ${theme.border}`}}>
        💡 Tip: The Posting Rhythm value appears in the header bar. Editing it here keeps everything in sync.
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <KPICard k="goal"   label="Month 1 Goal"    note="Set a sustainable baseline. Build from there."           bg="#EBF0FC"/>
        <KPICard k="signal" label="Best Signal"      note="Saves = 'I'm coming back to this.' Far better than likes." bg="#F0F4FA"/>
        <KPICard k="rhythm" label="Posting Rhythm"   note="This value also appears in the header bar."              bg="#F0F4FA"/>
        <KPICard k="watch"  label="Watch This"       note="Profile visits = vanity. Link clicks = moving toward booking." bg="#EBF0FC"/>
      </div>

      {[{title:"CHECK WEEKLY",  items:["Saves per post — target 5+ on Tips posts","Profile visits from posts","Link in bio clicks","Story poll responses and DM replies"]},
        {title:"CHECK MONTHLY", items:["Follower growth — niche-relevant only","Reach on Reels — broadest discovery surface","New profile visits from non-followers","Discovery calls booked — the primary goal"]},
      ].map((s,i)=>(
        <div key={i} style={{background:"#FFFFFF",borderRadius:12,padding:16,border:`1px solid ${theme.border}`,marginBottom:9}}>
          <div style={{fontWeight:700,fontSize:12,color:"#111111",letterSpacing:"1px",marginBottom:10}}>{s.title}</div>
          {s.items.map((m,j)=>(
            <div key={j} style={{display:"flex",gap:8,padding:"7px 0",
              borderBottom:j<s.items.length-1?`1px solid ${theme.divider}`:"none"}}>
              <span style={{color:"#111111",fontWeight:700,fontSize:13}}>→</span>
              <span style={{fontSize:13,color:"#111111"}}>{m}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
