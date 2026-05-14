---
name: list-templates
description: List the 4 available wedding website templates with id, display name, style description, and preview image URL.
---

# list-templates

Return the 4 wedding website templates available on wedding30s.com.

## When to use

Before calling `create-wedding-draft`, when the user has not specified a template, or when the user asks "what templates do you have?".

## Transport

Preferred: MCP tool `list_templates` at `https://mcp.wedding30s.com/`.

HTTP fallback: `GET https://wedding30s.com/api/agent/templates`.

## Input

None.

## Output

```json
{
  "templates": [
    {
      "id": "classic-garden",
      "name": "Classic Garden",
      "style": "Botanical, soft greens, serif typography",
      "preview_url": "https://wedding30s.com/og-image.png"
    }
  ]
}
```

Template IDs are stable and can be passed directly to `create-wedding-draft` as the `template` field.

## Related skills

- [create-wedding-draft](../create-wedding-draft/SKILL.md)
