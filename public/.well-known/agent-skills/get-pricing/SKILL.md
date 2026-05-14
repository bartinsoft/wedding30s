---
name: get-pricing
description: Get current pricing for wedding30s and what is included in the one-time fee.
---

# get-pricing

Return the current price, currency, billing model, and feature list for wedding30s.

## When to use

When the user asks about cost, when they want to confirm the price before proceeding to draft creation, or when explaining what the EUR 49 covers.

## Transport

Preferred: MCP tool `get_pricing` at `https://mcp.wedding30s.com/`.

HTTP fallback: `GET https://wedding30s.com/api/agent/pricing`.

## Input

None.

## Output

```json
{
  "amount": 49,
  "currency": "EUR",
  "model": "one-time",
  "includes": [
    "Wedding invitation website at wedding30s.com/your-slug",
    "RSVP form with menu choices and allergies",
    "Photo gallery, story, program, menu",
    "4 templates, EN and ES",
    "No recurring fees, no ads"
  ]
}
```

Payment is processed by Polar (Merchant of Record). The agent cannot pay; a human must complete checkout via the URL returned by `create-wedding-draft`.

## Related skills

- [create-wedding-draft](../create-wedding-draft/SKILL.md)
