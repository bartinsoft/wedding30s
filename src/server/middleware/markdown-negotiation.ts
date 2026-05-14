import type { Request, Response, NextFunction } from 'express';
import { NodeHtmlMarkdown } from 'node-html-markdown';

const nhm = new NodeHtmlMarkdown({ keepDataImages: false, useLinkReferenceDefinitions: false });

export function wantsMarkdown(req: Request): boolean {
  const accept = req.headers['accept'];
  if (!accept || typeof accept !== 'string') return false;
  if (!accept.includes('text/markdown')) return false;
  const preferred = req.accepts(['text/html', 'text/markdown']);
  return preferred === 'text/markdown';
}

export function approxTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function sendMarkdown(res: Response, markdown: string) {
  res.set('Content-Type', 'text/markdown; charset=utf-8');
  res.set('X-Markdown-Tokens', String(approxTokens(markdown)));
  res.set('Vary', 'Accept');
  res.send(markdown);
}

export function htmlToMarkdown(html: string): string {
  return nhm.translate(html);
}

export function markdownNegotiation(req: Request, res: Response, next: NextFunction) {
  if (!wantsMarkdown(req)) return next();

  res.set('Vary', 'Accept');

  const originalSend = res.send.bind(res);
  res.send = function (body: unknown): Response {
    const contentType = String(res.getHeader('Content-Type') || '');
    if (contentType.includes('text/html') && typeof body === 'string') {
      const md = htmlToMarkdown(body);
      res.set('Content-Type', 'text/markdown; charset=utf-8');
      res.set('X-Markdown-Tokens', String(approxTokens(md)));
      res.removeHeader('Content-Length');
      return originalSend(md);
    }
    return originalSend(body as never);
  };

  next();
}
