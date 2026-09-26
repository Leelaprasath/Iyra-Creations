import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Emits canonical/OG URLs and sitemap.xml only when the production URL is known
 * (VITE_SITE_URL). Without it, relative metadata is kept and no sitemap is produced.
 */
function siteUrlPlugin(siteUrl, routes) {
  const base = siteUrl ? siteUrl.replace(/\/$/, '') : ''
  return {
    name: 'iyra-site-url',
    transformIndexHtml(html) {
      if (!base) return html.replace('<!--canonical-->', '').replace('<!--og:url-->', '')
      return html
        .replace('<!--canonical-->', `<link rel="canonical" href="${base}/" />`)
        .replace('<!--og:url-->', `<meta property="og:url" content="${base}/" />`)
        .replace(/content="\/og-image\.png"/g, `content="${base}/og-image.png"`)
    },
    generateBundle() {
      if (!base) return
      const urls = routes.map((r) => `  <url><loc>${base}${r}</loc></url>`).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
      })
    },
  }
}

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const { projects } = await import('./src/data/projects.js')
  const routes = ['/', ...projects.map((p) => `/work/${p.slug}`)]

  return {
    plugins: [react(), siteUrlPlugin(env.VITE_SITE_URL, routes)],
    build: {
      target: 'es2020',
      // The lazily-loaded WebGL chunk (three + r3f + drei) is ~1.1 MB raw / ~300 kB gzip by design.
      chunkSizeWarningLimit: 1200,
    },
  }
})
