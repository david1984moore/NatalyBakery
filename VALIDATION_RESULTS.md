# Phase 4: Polish & Validation — Results

**Project:** Nataly's Home Bakery  
**Reference:** PROFESSIONAL_IMAGE_ANIMATION_PROTOCOL.md Section 2.4  
**Date:** Validation run (production build, local)  
**Standard:** Imperceptible quality — "If the user notices the loading, it's not good enough."

---

## 1. Performance Measurements

### 1.1 Lighthouse Audit (Production Build)

**Environment:** Local production server (`next start`), Lighthouse CLI headless (Chrome).  
**Caveat:** Headless runs often report worse LCP than a real browser with real paint; use these as a baseline and re-run in DevTools on a real device for deployment.

#### Mobile (default Lighthouse mobile throttling)

| Metric | Score | Value | Protocol target |
|--------|--------|--------|------------------|
| **Performance** | **67** | — | >95 |
| LCP (Largest Contentful Paint) | 0 | **9.6 s** | <1.5 s mobile |
| FCP (First Contentful Paint) | 0.75 | 2.3 s | — |
| CLS (Cumulative Layout Shift) | **1** | **0** | <0.05 ✅ |
| TBT (Total Blocking Time) | 0.99 | 80 ms | — |
| Max Potential FID | 0.71 | 190 ms | <50 ms |

#### Desktop (form-factor=desktop, no mobile emulation)

| Metric | Score | Value | Protocol target |
|--------|--------|--------|------------------|
| **Performance** | **72** | — | >95 |
| LCP | 0 | **9.1 s** | <1.0 s desktop |
| FCP | 0.89 | 0.95 s | — |
| CLS | **1** | **0** | <0.05 ✅ |
| TBT | 0.95 | 120 ms | — |
| Max Potential FID | 0.70 | 190 ms | <50 ms |

**Artifacts:** `lighthouse-mobile.json`, `lighthouse-desktop.json` (in project root).

**Lighthouse screenshot:** Run in Chrome DevTools (Lighthouse tab) against your deployed or local URL and attach a screenshot here for your records.  
Example: *[ Attach: lighthouse-report-screenshot.png ]*

---

### 1.2 Hero Image Timeline (Blur → Request → Decode → Transition → Visible)

The app emits **performance marks** for the hero image when `markTimeline="hero"` is set (see `Hero.tsx`). Use these to measure the actual timeline.

**How to capture:**

1. Open the site (e.g. `http://localhost:3000` or your deployed URL).
2. Open DevTools → **Console**.
3. Load or hard-refresh the page.
4. Run:
   ```js
   performance.getEntriesByType('mark').filter(m => m.name.startsWith('hero')).forEach(m => console.log(m.name, m.startTime.toFixed(0) + 'ms'))
   ```
5. Optionally, get measures (if you added `performance.measure()` calls):
   ```js
   performance.getEntriesByType('measure').forEach(m => console.log(m.name, m.duration.toFixed(0) + 'ms'))
   ```

**Expected marks:**

- `hero-blur-render` — Blur placeholder is mounted (first paint of blur).
- `hero-request` — Preload/decode image request started.
- `hero-decode-done` — Image decode finished; opacity transition starts.
- `hero-visible` — Transition end; image fully visible (~400 ms after decode-done for priority).

**Document your measured timeline here:**

| Stage | Time (ms from nav start) | Notes |
|-------|--------------------------|--------|
| hero-blur-render | *[ fill after running script ]* | |
| hero-request | *[ fill ]* | |
| hero-decode-done | *[ fill ]* | |
| hero-visible | *[ fill ]* | |

**Gap analysis:**  
- Time from blur-render to decode-done = network + decode.  
- Time from decode-done to visible = 400 ms (transition).  
If blur-render is late (>100 ms), investigate hydration or main-thread work blocking paint.

---

### 1.3 Real Mobile Device (Not DevTools Emulation)

**Action required:** Test on your actual phone (good WiFi).

- **URL:** Your deployed URL or local network URL (e.g. `http://<your-pc-ip>:3000` if testing locally).
- **Steps:** Open site → home page → scroll product grid → open a product (gallery).
- **Document:**  
  - Device: *e.g. iPhone 14, Android …*  
  - Connection: *e.g. WiFi 5*  
  - LCP / feel: *e.g. "Hero sharp in ~1.2s" or "Hero stayed blurry for 3s"*

---

### 1.4 Network Throttling (Fast 3G)

**Option A — DevTools:**  
Chrome DevTools → Network → Throttling: **Fast 3G**. Reload home page. Note whether the blur stays visible long enough that the transition to sharp feels continuous (no gray flash, no “pop”).

**Option B — Lighthouse:**  
Run Lighthouse with simulated throttling (e.g. mobile preset already applies throttling). For explicit Fast 3G, use a custom config or run from DevTools with “Simulate fast 3G” in Performance settings.

**Result to document:**

- Hero on Fast 3G: *[ Blur shows for Xs, then smooth transition / or blur too short / or felt sluggish ]*
- Hero on fiber / good WiFi: *[ Feels instant / or transition noticeable / or too slow ]*

---

## 2. Subjective Quality Check

**Do this on your actual phone with good WiFi.**

| Question | Your answer (be honest) |
|----------|-------------------------|
| Navigate to home. Can you **perceive** the blur-to-sharp transition, or does it feel **instant**? | *[ Instant / Subtle / Clearly visible ]* |
| Scroll through the product grid. Do cards feel **smooth** or is there **jank**? | *[ Smooth / Occasional jank / Noticeable jank ]* |
| Open a product detail. Does the gallery feel **fluid** (tap, swipe, dots)? | *[ Fluid / Acceptable / Sluggish or laggy ]* |
| **Overall:** Does this feel **"Apple.com quality"** or **"startup MVP quality"**? | *[ Closer to Apple / In between / MVP ]* |

---

## 3. Edge Case Testing

| Scenario | Expected | Your result |
|----------|----------|-------------|
| **Hero on slow 3G** | Blur visible long enough; no gray flash; then smooth blur→sharp | *[ ]* |
| **Hero on fiber** | Transition either imperceptible or subtly smooth; not slow or “loading” feel | *[ ]* |
| **ProductCard hover (trackpad)** | Smooth scale/shadow, not mechanical or snappy | *[ ]* |
| **Gallery swipe on phone** | Follows finger; no lag or disconnect | *[ ]* |

---

## 4. Subjective Rating (1–10)

**“Would you show this to a designer from Linear (or Apple/Stripe) without embarrassment?”**

- **1–3:** Obvious loading, jank, or unpolished transitions.  
- **4–6:** Usable; some moments feel good, others clearly not “premium.”  
- **7–8:** Good; minor nits only.  
- **9–10:** Feels imperceptible / professional; you’d be proud to ship it.

**Your rating:** _____ / 10  

**One-line reason:** *[ e.g. "Blur→sharp is smooth and CLS is 0, but LCP in Lighthouse is still high" ]*

---

## 5. Real Device Video

**Required:** 15-second clip of home page load on a real device (phone preferred).

- **Content:** Cold load (or refresh) → hero appears (blur then sharp) → optional short scroll.
- **Attach:** Save as `validation-home-load.mp4` (or similar) and reference here.  
  *[ Attach: validation-home-load.mp4 ]*

---

## 6. Honest Summary: What Still Feels “Not Quite Right”

**From automated run:**

- **LCP (9+ s in Lighthouse):** Headless/local run is not representative of real users; it often overstates LCP. **Action:** Re-run Lighthouse in DevTools on a real device and on deployed production. If LCP stays >2.5 s on mobile on real 4G/WiFi, treat as a real problem (e.g. hero image size, priority, or server latency).
- **CLS 0:** Layout stability is excellent; no change needed for CLS.
- **FID ~190 ms:** Max potential FID is above the 50 ms target. May be acceptable depending on actual INP; monitor with real-user data if available.

**From your subjective and edge-case testing, list anything that still feels off:**

- *[ e.g. "Hero transition feels a bit slow on fiber" ]*
- *[ e.g. "Product cards feel a bit snappy on trackpad" ]*
- *[ etc. ]*

---

## 7. Recommended Next Steps (If Anything Still Feels Amateur)

**If LCP remains high in real-world testing:**

- Confirm hero image uses `priority` and appropriate `sizes`; verify the LCP element in DevTools (Performance or Lighthouse).
- Consider preloading the LCP image: `<link rel="preload" as="image" href="…" />` for the hero URL.
- Check server/CDN TTFB; ensure hero asset is cached and served close to the user.

**If blur→sharp feels noticeable or slow:**

- Shorten hero transition from 400 ms to 250–300 ms and re-test.
- Ensure decode-before-transition is in place (already implemented) so the transition never competes with decode jank.

**If ProductCard hover feels mechanical:**

- Slightly reduce scale (e.g. 1.05 → 1.03) or adjust easing (e.g. more deceleration at the end).

**If gallery swipe lags:**

- Consider a gesture library (e.g. Framer Motion) for pointer-following and momentum, or verify touch handlers are not blocking the main thread.

**If you wouldn’t yet show it to a Linear designer:**

- Re-run this validation after each change; keep the bar at “imperceptible” and iterate until the subjective rating is 8+ and you’re comfortable shipping.

---

**End of validation document.**  
Fill in the bracketed sections and attach the screenshot + video for a complete Phase 4 record.
