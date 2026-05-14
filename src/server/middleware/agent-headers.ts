import type { Request, Response, NextFunction } from 'express';

const LINKS = [
  '</sitemap.xml>; rel="sitemap"',
  '</legal/legal>; rel="terms-of-service"',
  '</legal/privacy>; rel="privacy-policy"',
  '</blog>; rel="help"',
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</.well-known/agent-skills/index.json>; rel="https://isitagentready.com/rels/agent-skills"; type="application/json"',
  '</.well-known/mcp/server-card.json>; rel="https://modelcontextprotocol.io/rels/server-card"; type="application/json"',
].join(', ');

export function agentLinkHeaders(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'GET' || req.method === 'HEAD') {
    res.setHeader('Link', LINKS);
  }
  next();
}
