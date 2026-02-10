# Image Loading Diagnostic Report - Instructions for Cursor

**Objective:** Generate a comprehensive diagnostic report to identify why images are still loading slowly despite optimization attempts.

---

## Step 1: File System Audit

### 1.1 Check Optimized Images Directory
```bash
# List optimized images
ls -lh public/optimized/ 2>/dev/null || echo "Directory does not exist"

# Count files by type
echo "WebP files:" && find public/optimized -name "*.webp" 2>/dev/null | wc -l
echo "AVIF files:" && find public/optimized -name "*.avif" 2>/dev/null | wc -l
echo "Total files:" && find public/optimized -type f 2>/dev/null | wc -l
```

**Document:**
- Does `/public/optimized/` directory exist?
- How many files are in it?
- List first 10 files with sizes

### 1.2 Check Image Manifest
```bash
# Check if manifest exists and show first 20 lines
if [ -f "src/data/image-blur-data.json" ]; then
  echo "✓ Manifest exists"
  head -n 20 src/data/image-blur-data.json
else
  echo "✗ Manifest does not exist at src/data/image-blur-data.json"
fi
```

**Document:**
- Does manifest file exist?
- Show sample of its contents
- How many images are in the manifest?

### 1.3 Check Source Images
```bash
# List all source images with sizes
ls -lh public/Images/*.{jpg,jpeg,png,webp} 2>/dev/null | head -20
```

**Document:**
- How many source images exist?
- What are their file sizes?
- List first 10 with paths

---

## Step 2: Code Implementation Audit

### 2.1 Check Build Script
**File to inspect:** `scripts/optimize-images.js` OR `scripts/optimize-images-enhanced.js`

**Document:**
- Does the script exist?
- Show the complete script contents
- Was it modified from the original instructions?
- Does package.json include it in the build process?

### 2.2 Check Package.json Scripts
```bash
# Show build-related scripts
cat package.json | grep -A 5 '"scripts"'
```

**Document:**
- What is the exact "build" script command?
- Is "optimize-images" included in the build chain?
- What is the "dev" script?

### 2.3 Check OptimizedImage Component
**File to inspect:** `src/components/OptimizedImage.tsx`

**Document:**
- Does this component exist?
- Show the complete component code
- Does it import the manifest: `import imageManifest from '@/data/image-blur-data.json'`?
- How does it handle missing images in the manifest?

### 2.4 Check Hero Component
**File to inspect:** `src/components/Hero.tsx`

**Document:**
- Show the complete Hero component code
- Is it using OptimizedImage component or next/image directly?
- What are the image src paths?
- Does it have error handling (onError)?

### 2.5 Check Next.js Config
**File to inspect:** `next.config.js`

**Document:**
- Show the complete images configuration block
- What are the quality values?
- What are the deviceSizes?
- What is minimumCacheTTL set to?

---

## Step 3: Build Process Analysis

### 3.1 Run Build with Verbose Logging
```bash
# Clean build to see all output
rm -rf .next
npm run optimize-images 2>&1 | tee optimize-output.log

# Show last 50 lines of output
tail -n 50 optimize-output.log
```

**Document:**
- Did optimize-images script run successfully?
- Were any errors reported?
- How many images were processed?
- Did it generate the manifest file?
- Copy ALL output from the script

### 3.2 Check TypeScript Configuration
```bash
# Check if JSON imports are enabled
cat tsconfig.json | grep -A 10 '"compilerOptions"'
```

**Document:**
- Is `resolveJsonModule` set to `true`?
- Show relevant compilerOptions

---

## Step 4: Runtime Behavior Analysis

### 4.1 Browser Console Errors
**Instructions:**
1. Open the site in Chrome
2. Open DevTools (F12)
3. Go to Console tab
4. Hard refresh page (Cmd+Shift+R or Ctrl+Shift+R)
5. Screenshot ALL errors and warnings

**Document:**
- List every error message
- List every warning message
- Are there 404s for images?
- Are there TypeScript/import errors?
- Are there Next.js optimization errors?

### 4.2 Network Tab Analysis
**Instructions:**
1. In DevTools, go to Network tab
2. Filter by "Img"
3. Hard refresh page
4. Sort by "Time" column (longest first)
5. Screenshot the waterfall

**Document:**
- Which images are loading?
- What are their URLs (full path)?
- What are their load times?
- What are their file sizes?
- Are they loading from `/optimized/` or `/Images/`?
- Are they WebP/AVIF or original JPEGs?
- Which image takes longest to load?
- Are there any failed requests (red)?

### 4.3 Check Specific Image Request
**Instructions:**
1. In Network tab, click on the hero image request
2. Go to "Headers" tab
3. Screenshot Request URL, Response Headers, and Request Headers

**Document:**
- Full request URL
- Response status code
- Content-Type header
- Cache-Control header
- Is it going through `/_next/image` or directly to file?

---

## Step 5: Component Usage Audit

### 5.1 Find All Image Usage
```bash
# Search for all Image component usage
grep -r "from 'next/image'" src/ --include="*.tsx" --include="*.ts"
grep -r "<Image" src/ --include="*.tsx" -A 2 | head -50

# Search for OptimizedImage usage
grep -r "OptimizedImage" src/ --include="*.tsx" -A 2 | head -50
```

**Document:**
- Which components still use next/image directly?
- Which components use OptimizedImage?
- Are there mixed approaches?

### 5.2 Check All Image-Related Components
**Files to inspect:**
- `src/components/ProductCard.tsx`
- `src/components/ProductImage.tsx`
- `src/components/ProductImageGallery.tsx`
- `src/components/FeaturedProducts.tsx`
- `src/app/menu/page.tsx`

**Document for each:**
- Which Image component is used (next/image or OptimizedImage)?
- What are the src values?
- Are blurDataURL props passed?
- Are priority props set correctly?

---

## Step 6: Deployment & Hosting Check

### 6.1 Hosting Platform
**Document:**
- Where is the site hosted? (Vercel, Netlify, custom server?)
- Is it a production build or development server?
- What is the deployment URL?

### 6.2 Build Artifacts
```bash
# Check if .next directory has optimized images cached
ls -lh .next/cache/images/ 2>/dev/null | head -20
```

**Document:**
- Does .next/cache/images/ exist?
- How many cached images?
- Are they recent?

---

## Step 7: Performance Measurements

### 7.1 Lighthouse Audit
```bash
# Run Lighthouse (if installed)
lighthouse https://your-site-url.com --output=json --output-path=./lighthouse.json --only-categories=performance

# Show key metrics
cat lighthouse.json | grep -E '"largestContentfulPaint"|"firstContentfulPaint"|"speedIndex"' -A 1
```

**Document:**
- Performance score
- LCP time
- FCP time
- Speed Index
- Any specific image-related issues flagged

---

## Step 8: Create Comprehensive Report

**Compile all findings into a single markdown file: `IMAGE_DIAGNOSTIC_REPORT.md`**

Include these sections:
1. **File System Status** - What files exist where
2. **Build Process Status** - Did optimization run? Any errors?
3. **Code Implementation Status** - What was actually implemented
4. **Runtime Errors** - Console and network errors
5. **Performance Metrics** - How slow are images actually loading?
6. **Root Cause Hypothesis** - Based on evidence, what's causing the slowness?
7. **Recommended Fix** - Specific next steps to resolve

**Critical: Include actual file contents and error messages, not summaries.**

---

## Output Format

Create a file called `IMAGE_DIAGNOSTIC_REPORT.md` with all findings. Structure it clearly with:

- ✓ for things that are working correctly
- ✗ for things that are broken or missing
- ⚠️  for things that exist but are misconfigured
- Actual code snippets (not descriptions)
- Actual error messages (verbatim)
- Actual file paths and URLs
- Actual file sizes and counts

**This report will be given to Claude to diagnose the exact problem and provide a targeted fix.**
