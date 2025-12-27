# 🚀 Quick Deploy Checklist

## Pre-Deploy (5 minutes)

```bash
cd /mnt/d/Code/Hugo/post

# 1. Validate configuration
hugo check

# 2. Build with verbose output
hugo -v

# 3. Test locally
hugo server -D
# Visit: http://localhost:1313
```

**Check locally:**
- [ ] All pages load correctly
- [ ] Images display with proper layout
- [ ] No console errors (F12 Developer Tools)

## Deploy (5 minutes)

```bash
# Production build with minification
hugo --minify

# Deploy to your hosting platform
# (GitHub Pages, Netlify, Vercel, etc.)
```

## Post-Deploy Validation (10 minutes)

### 1. Basic Checks
- [ ] Site loads at https://mileswallace.com
- [ ] All pages accessible
- [ ] HTTPS working (no mixed content warnings)

### 2. View Page Source (Ctrl+U)
Check homepage for:
- [ ] `<meta name="viewport"...`
- [ ] `<link rel="canonical"...`
- [ ] `<meta property="og:title"...`
- [ ] `<meta name="twitter:card"...`
- [ ] `<script type="application/ld+json">` (breadcrumb)
- [ ] `<script type="application/ld+json">` (person)

### 3. Quick Online Tests

**Google Rich Results Test:**
https://search.google.com/test/rich-results?url=https://mileswallace.com

**PageSpeed Insights:**
https://pagespeed.web.dev/?url=https://mileswallace.com

**Mobile-Friendly Test:**
https://search.google.com/test/mobile-friendly?url=https://mileswallace.com

**Security Headers:**
https://securityheaders.com/?q=https://mileswallace.com

## Search Console Setup (15 minutes)

### Google Search Console
1. Visit: https://search.google.com/search-console
2. Add property: mileswallace.com
3. Verify ownership (DNS or HTML file)
4. Submit sitemap: https://mileswallace.com/sitemap.xml

### Bing Webmaster Tools
1. Visit: https://www.bing.com/webmasters
2. Add site: mileswallace.com
3. Verify ownership
4. Submit sitemap: https://mileswallace.com/sitemap.xml

## Week 1 Monitoring

- [ ] Day 1: Check Search Console Coverage
- [ ] Day 3: Verify pages being indexed
- [ ] Day 7: Review Performance report
- [ ] Monitor Core Web Vitals
- [ ] Check for any crawl errors

## Success Metrics (Track Weekly)

| Metric | Baseline | Target (Month 1) | Target (Month 6) |
|--------|----------|------------------|------------------|
| Indexed pages | TBD | 100% important pages | 100% |
| Avg. position | TBD | Improve by 10-15 | Improve by 20-30 |
| CTR | TBD | +15-30% | +40-60% |
| Impressions | TBD | +20-40% | +60-100% |
| Clicks | TBD | +30-50% | +80-120% |

## Quick Fixes if Issues

### Issue: Pages not indexed
**Check:** Search Console > Coverage report
**Fix:** Submit sitemap, check robots.txt

### Issue: Poor mobile score
**Check:** Mobile-Friendly Test
**Fix:** Verify viewport tag, test responsive layout

### Issue: Missing schema markup
**Check:** Rich Results Test
**Fix:** Rebuild site, verify partial files exist

### Issue: Security headers not showing
**Check:** securityheaders.com
**Fix:** Verify `_headers` file deployed, check hosting config

---

## 📞 Support

**Documentation:**
- `SEO_IMPROVEMENTS_COMPLETE.md` - Full details
- `IMAGE_OPTIMIZATION.md` - Image guide
- `IMAGE_QUICKSTART.md` - Quick start

**Hugo Docs:** https://gohugo.io/
**Blowfish Theme:** https://blowfish.page/

---

**Status:** Ready to Deploy ✅
**Expected Build Time:** <30 seconds
**Expected SEO Impact:** +60-100% organic traffic (6-12 months)
