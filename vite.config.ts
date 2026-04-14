import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const ga4Id = env.VITE_GA4_ID || ''

  const ga4Snippet = ga4Id
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${ga4Id}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ga4Id}');
</script>`
    : ''

  return {
    plugins: [
      vue(),
      {
        name: 'inject-ga4',
        transformIndexHtml(html) {
          return html.replace('</head>', `${ga4Snippet}\n</head>`)
        },
      },
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/client'),
      },
    },
    build: {
      outDir: 'dist/client',
    },
    server: {
      host: true,
      proxy: {
        '/api': 'http://localhost:3000',
        '/media': 'http://localhost:3000',
      },
    },
  }
})
