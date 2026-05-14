import type { Router } from 'vue-router'

type ModelContextTool = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute: (input: Record<string, unknown>) => Promise<unknown> | unknown
}

type ModelContext = {
  provideContext: (ctx: { tools: ModelContextTool[] }) => void
}

declare global {
  interface Navigator {
    modelContext?: ModelContext
  }
}

const TEMPLATES = [
  { id: 'classic-garden', name: 'Classic Garden', style: 'Botanical, soft greens, serif typography' },
  { id: 'minimal-white', name: 'Minimal White', style: 'Clean, monochrome, modern sans-serif' },
  { id: 'romantic-blush', name: 'Romantic Blush', style: 'Soft pinks, watercolor accents, romantic script' },
  { id: 'modern-dark', name: 'Modern Dark', style: 'Dark mode, bold typography, gold accents' },
]

const PRICING = {
  amount: 49,
  currency: 'EUR',
  model: 'one-time',
  includes: [
    'Wedding invitation website at wedding30s.com/your-slug',
    'RSVP form with menu choices and allergies',
    'Photo gallery, story, program, menu',
    '4 templates, EN and ES',
    'No recurring fees, no ads',
  ],
}

export function registerWebMCP(router: Router): void {
  if (typeof navigator === 'undefined' || !navigator.modelContext) return

  const tools: ModelContextTool[] = [
    {
      name: 'list_templates',
      description: 'List the 4 wedding website templates available on wedding30s.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: () => ({ templates: TEMPLATES }),
    },
    {
      name: 'get_pricing',
      description: 'Get current pricing (EUR 49 one-time) and what is included.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: () => PRICING,
    },
    {
      name: 'start_wedding_creation',
      description: 'Navigate the current page to the wedding creation wizard. Optionally pass partner names and date to pre-fill the first step.',
      inputSchema: {
        type: 'object',
        properties: {
          partner1_name: { type: 'string', description: 'First partner full name' },
          partner2_name: { type: 'string', description: 'Second partner full name' },
          date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'Wedding date YYYY-MM-DD' },
          template: { type: 'string', enum: ['classic-garden', 'minimal-white', 'romantic-blush', 'modern-dark'] },
        },
        additionalProperties: false,
      },
      execute: async (input) => {
        const query: Record<string, string> = {}
        for (const k of ['partner1_name', 'partner2_name', 'date', 'template'] as const) {
          const v = input[k]
          if (typeof v === 'string' && v.length > 0) query[k] = v
        }
        await router.push({ path: '/create', query })
        return { navigated_to: '/create', query }
      },
    },
    {
      name: 'view_blog',
      description: 'Navigate to the wedding30s blog (Spanish by default; pass language: "en" for English).',
      inputSchema: {
        type: 'object',
        properties: { language: { type: 'string', enum: ['es', 'en'] } },
        additionalProperties: false,
      },
      execute: async (input) => {
        const path = input.language === 'en' ? '/en/blog' : '/blog'
        window.location.assign(path)
        return { navigated_to: path }
      },
    },
    {
      name: 'view_my_weddings',
      description: 'Navigate to the authenticated user dashboard listing their weddings. Requires the user to be logged in; otherwise redirects to /login.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: async () => {
        await router.push('/my-weddings')
        return { navigated_to: '/my-weddings' }
      },
    },
  ]

  try {
    navigator.modelContext.provideContext({ tools })
  } catch (err) {
    console.warn('WebMCP provideContext failed:', err)
  }
}
