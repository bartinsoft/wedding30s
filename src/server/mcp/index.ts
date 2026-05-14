import type { Request, Response } from 'express';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createWeddingDraft } from './draft.js';
import { TEMPLATES, PRICING } from '../routes/well-known.js';

function buildServer(): McpServer {
  const server = new McpServer({ name: 'wedding30s', version: '1.0.0' });

  server.registerTool(
    'create_wedding_draft',
    {
      description: 'Create an unpaid wedding invitation website draft. Returns a preview URL viewable immediately and a checkout URL the human must follow to pay EUR 49 and publish. Unpaid drafts are deleted after 7 days.',
      inputSchema: {
        partner1_name: z.string().min(1).describe('First partner full name'),
        partner2_name: z.string().min(1).describe('Second partner full name'),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Wedding date in ISO format YYYY-MM-DD'),
        location: z.string().min(1).describe('City or place'),
        email: z.string().email().describe('Couple email; receives confirmation and dashboard link'),
        venue: z.string().optional(),
        template: z.enum(['classic-garden', 'minimal-white', 'romantic-blush', 'modern-dark']).optional(),
        language: z.enum(['es', 'en']).optional(),
        story: z.string().optional(),
        maps_url: z.string().url().optional(),
      },
    },
    async (args) => {
      const result = await createWeddingDraft(args);
      return {
        content: [
          { type: 'text', text: `Draft created. Share these URLs with the human:\n\nPreview (free, immediate): ${result.preview_url}\nCheckout (EUR 49, required to publish): ${result.checkout_url}\n\nDraft expires at: ${result.expires_at}` },
          { type: 'text', text: JSON.stringify(result, null, 2) },
        ],
      };
    }
  );

  server.registerTool(
    'list_templates',
    {
      description: 'List the 4 available wedding website templates.',
      inputSchema: {},
    },
    async () => ({
      content: [{ type: 'text', text: JSON.stringify({ templates: TEMPLATES }, null, 2) }],
    })
  );

  server.registerTool(
    'get_pricing',
    {
      description: 'Get current pricing and what is included.',
      inputSchema: {},
    },
    async () => ({
      content: [{ type: 'text', text: JSON.stringify(PRICING, null, 2) }],
    })
  );

  return server;
}

export async function handleMcpRequest(req: Request, res: Response) {
  try {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on('close', () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error('MCP error:', err);
    if (!res.headersSent) {
      res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' }, id: null });
    }
  }
}

export function mcpMethodNotAllowed(_req: Request, res: Response) {
  res.status(405).set('Allow', 'POST').json({
    jsonrpc: '2.0',
    error: { code: -32000, message: 'Method not allowed. Use POST.' },
    id: null,
  });
}
