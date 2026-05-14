---
name: create-wedding-draft
description: Create an unpaid wedding invitation website draft on wedding30s.com from structured data and return a preview URL plus a human-payable checkout URL.
---

# create-wedding-draft

Create an unpaid wedding invitation website draft on [wedding30s.com](https://wedding30s.com). Drafts are free to create and viewable immediately at a preview URL. Publishing requires a human to complete a EUR 49 one-time checkout at Polar (Merchant of Record). Unpaid drafts are deleted after 7 days.

## When to use

The user wants to create a wedding invitation website for themselves or for a couple they know. They have at minimum the partner names, wedding date, location, and an email address.

## Transport

Preferred: MCP tool `create_wedding_draft` at `https://mcp.wedding30s.com/` (Streamable HTTP).

HTTP fallback: `POST https://wedding30s.com/api/agent/create-wedding-draft` with JSON body.

Rate limit: 10 requests/hour per IP for the HTTP endpoint; 30 requests/hour per IP for the MCP endpoint.

## Input

| Field | Required | Type | Notes |
|---|---|---|---|
| `partner1_name` | yes | string | First partner full name |
| `partner2_name` | yes | string | Second partner full name |
| `date` | yes | string | ISO `YYYY-MM-DD` |
| `location` | yes | string | City or place |
| `email` | yes | string | Couple email; receives confirmation and dashboard link |
| `venue` | no | string | |
| `template` | no | enum | `classic-garden` (default), `minimal-white`, `romantic-blush`, `modern-dark` |
| `language` | no | enum | `es` (default), `en` |
| `story` | no | string | Long-form couple story |
| `maps_url` | no | string | Google Maps URL for the venue |

## Output

```json
{
  "draft_id": "string",
  "preview_url": "https://wedding30s.com/preview/<id>?token=<secret>",
  "checkout_url": "https://buy.polar.sh/...",
  "expires_at": "ISO 8601 timestamp 7 days from creation"
}
```

## Response to user

Always share **both** URLs with the human:

- The **preview URL** lets them check the result for free, immediately.
- The **checkout URL** is the only way to publish the site. The agent cannot pay; a human must complete the EUR 49 checkout.

Do not pretend the site is published until the human confirms they've paid.

## Errors

- `400` — invalid input (bad date format, invalid template/language enum, missing required field)
- `429` — rate limit exceeded; retry after the `Retry-After` seconds

## Related skills

- [list-templates](../list-templates/SKILL.md)
- [get-pricing](../get-pricing/SKILL.md)
