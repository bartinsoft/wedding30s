import { Router } from 'express';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const router = Router();

function sha256OfFile(rel: string): string {
  try {
    const buf = readFileSync(path.resolve('public', rel));
    return 'sha256:' + createHash('sha256').update(buf).digest('hex');
  } catch {
    return 'sha256:0000000000000000000000000000000000000000000000000000000000000000';
  }
}

const SKILL_FILES = {
  'create-wedding-draft': '.well-known/agent-skills/create-wedding-draft/SKILL.md',
  'list-templates': '.well-known/agent-skills/list-templates/SKILL.md',
  'get-pricing': '.well-known/agent-skills/get-pricing/SKILL.md',
} as const;

const SKILL_DIGESTS = Object.fromEntries(
  Object.entries(SKILL_FILES).map(([name, file]) => [name, sha256OfFile(file)])
);

const BASE = process.env.BASE_URL || 'https://wedding30s.com';
const MCP = process.env.MCP_BASE_URL || 'https://mcp.wedding30s.com';

const SKILLS_INDEX = {
  $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
  skills: [
    {
      name: 'create-wedding-draft',
      type: 'skill-md',
      description: 'Create an unpaid wedding invitation website draft on wedding30s.com from structured data and return a preview URL plus a human-payable EUR 49 checkout URL.',
      url: `${BASE}/.well-known/agent-skills/create-wedding-draft/SKILL.md`,
      digest: SKILL_DIGESTS['create-wedding-draft'],
    },
    {
      name: 'list-templates',
      type: 'skill-md',
      description: 'List the 4 available wedding website templates with id, name, style description, and preview image URL.',
      url: `${BASE}/.well-known/agent-skills/list-templates/SKILL.md`,
      digest: SKILL_DIGESTS['list-templates'],
    },
    {
      name: 'get-pricing',
      type: 'skill-md',
      description: 'Get current pricing for wedding30s (EUR 49 one-time) and what is included.',
      url: `${BASE}/.well-known/agent-skills/get-pricing/SKILL.md`,
      digest: SKILL_DIGESTS['get-pricing'],
    },
  ],
};

const TEMPLATES = [
  { id: 'classic-garden', name: 'Classic Garden', style: 'Botanical, soft greens, serif typography', preview_url: `${BASE}/og-image.png` },
  { id: 'minimal-white', name: 'Minimal White', style: 'Clean, monochrome, modern sans-serif', preview_url: `${BASE}/og-image.png` },
  { id: 'romantic-blush', name: 'Romantic Blush', style: 'Soft pinks, watercolor accents, romantic script', preview_url: `${BASE}/og-image.png` },
  { id: 'modern-dark', name: 'Modern Dark', style: 'Dark mode, bold typography, gold accents', preview_url: `${BASE}/og-image.png` },
];

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
};

router.get('/.well-known/api-catalog', (_req, res) => {
  res.set('Content-Type', 'application/linkset+json');
  res.set('Cache-Control', 'public, max-age=300');
  res.send(JSON.stringify({
    linkset: [
      {
        anchor: `${BASE}/api/agent/`,
        'service-desc': [
          { href: `${BASE}/openapi.json`, type: 'application/openapi+json', title: 'wedding30s agent HTTP API — OpenAPI 3.1 spec' },
        ],
        'service-doc': [
          { href: `${BASE}/llms.txt`, type: 'text/plain', title: 'wedding30s service description for LLMs' },
          { href: `${BASE}/.well-known/agent-skills/index.json`, type: 'application/json', title: 'wedding30s agent skills catalog' },
        ],
        'service-meta': [
          { href: `${BASE}/.well-known/agent-skills/index.json`, type: 'application/json', title: 'wedding30s agent skills catalog' },
        ],
        status: [
          { href: `${BASE}/health`, type: 'application/json', title: 'wedding30s service health' },
        ],
      },
      {
        anchor: `${MCP}/`,
        'service-desc': [
          { href: `${BASE}/.well-known/mcp/server-card.json`, type: 'application/json', title: 'wedding30s MCP server card' },
        ],
        'service-doc': [
          { href: `${BASE}/.well-known/agent-skills/index.json`, type: 'application/json', title: 'wedding30s agent skills catalog' },
        ],
        status: [
          { href: `${BASE}/health`, type: 'application/json', title: 'wedding30s service health' },
        ],
      },
    ],
  }));
});

router.get('/.well-known/agent-skills/index.json', (_req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  res.json(SKILLS_INDEX);
});


router.get('/.well-known/mcp/server-card.json', (_req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  res.json({
    $schema: 'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
    name: 'com.wedding30s/mcp',
    version: '1.0.0',
    title: 'wedding30s',
    description: 'Create wedding invitation website drafts at wedding30s.com. Tools: create_wedding_draft, list_templates, get_pricing. Unpaid drafts are deleted after 7 days; publishing requires a human-completed EUR 49 checkout.',
    websiteUrl: BASE,
    icons: [
      { src: `${BASE}/favicon.png`, sizes: ['256x256'], mimeType: 'image/png' },
      { src: `${BASE}/favicon-32.png`, sizes: ['32x32'], mimeType: 'image/png' },
    ],
    remotes: [
      {
        type: 'streamable-http',
        url: `${MCP}/`,
        supportedProtocolVersions: ['2025-03-26', '2025-06-18'],
      },
    ],
    _meta: {
      'com.wedding30s/skills': `${BASE}/.well-known/agent-skills/index.json`,
      'com.wedding30s/tools': ['create_wedding_draft', 'list_templates', 'get_pricing'],
    },
  });
});

router.get('/llms.txt', (_req, res) => {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=300');
  res.send(`# wedding30s

> Create a wedding invitation website in minutes. One-time EUR 49 payment, no subscription.

wedding30s is a service that lets couples create a beautiful single-page wedding invitation site with RSVP, photo gallery, menu choices, and program. Sites are hosted at wedding30s.com/<slug>.

## For AI agents

You can create wedding draft websites on behalf of a user. Drafts are free and live for 7 days; publishing requires a human-completed EUR 49 checkout.

- Agent skills catalog: ${BASE}/.well-known/agent-skills/index.json
- MCP server: ${MCP}
- MCP server card: ${BASE}/.well-known/mcp/server-card.json

## Pricing

- EUR 49 one-time payment via Polar (Merchant of Record)
- Includes hosting, RSVP backend, photo gallery, 4 templates, EN/ES
- No subscription, no recurring fees

## Languages

- Spanish (default): ${BASE}/
- English: ${BASE}/en/blog (blog), main app is locale-detected

## Links

- Home: ${BASE}/
- Blog (ES): ${BASE}/blog
- Blog (EN): ${BASE}/en/blog
- Create: ${BASE}/create
- Terms: ${BASE}/legal/legal
- Privacy: ${BASE}/legal/privacy
- Sitemap: ${BASE}/sitemap.xml

## Contact

support@wedding30s.com
`);
});

router.get('/api/agent/templates', (_req, res) => {
  res.json({ templates: TEMPLATES });
});

router.get('/api/agent/pricing', (_req, res) => {
  res.json(PRICING);
});

router.get('/health', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ status: 'ok', service: 'wedding30s', time: new Date().toISOString() });
});

router.get('/openapi.json', (_req, res) => {
  res.set('Content-Type', 'application/openapi+json');
  res.set('Cache-Control', 'public, max-age=300');
  res.send(JSON.stringify({
    openapi: '3.1.0',
    info: {
      title: 'wedding30s agent HTTP API',
      version: '1.0.0',
      description: 'HTTP fallback for agents that cannot use MCP. Equivalent skills are also exposed via the MCP server at https://mcp.wedding30s.com.',
      contact: { email: 'support@wedding30s.com', url: BASE },
    },
    servers: [{ url: BASE, description: 'Production' }],
    paths: {
      '/api/agent/templates': {
        get: {
          summary: 'List available wedding templates',
          operationId: 'list_templates',
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      templates: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            style: { type: 'string' },
                            preview_url: { type: 'string', format: 'uri' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/agent/pricing': {
        get: {
          summary: 'Get current pricing and what is included',
          operationId: 'get_pricing',
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      amount: { type: 'number' },
                      currency: { type: 'string' },
                      model: { type: 'string' },
                      includes: { type: 'array', items: { type: 'string' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/agent/create-wedding-draft': {
        post: {
          summary: 'Create an unpaid wedding invitation draft and return a preview URL plus a human-payable checkout URL',
          operationId: 'create_wedding_draft',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['partner1_name', 'partner2_name', 'date', 'location', 'email'],
                  properties: {
                    partner1_name: { type: 'string' },
                    partner2_name: { type: 'string' },
                    date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
                    location: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    venue: { type: 'string' },
                    template: { type: 'string', enum: ['classic-garden', 'minimal-white', 'romantic-blush', 'modern-dark'] },
                    language: { type: 'string', enum: ['es', 'en'] },
                    story: { type: 'string' },
                    maps_url: { type: 'string', format: 'uri' },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Draft created',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      draft_id: { type: 'string' },
                      preview_url: { type: 'string', format: 'uri' },
                      checkout_url: { type: 'string', format: 'uri' },
                      expires_at: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
            '400': { description: 'Invalid input' },
            '429': { description: 'Rate limit exceeded (10/hour per IP)' },
          },
        },
      },
    },
  }));
});

export { TEMPLATES, PRICING };
export default router;
