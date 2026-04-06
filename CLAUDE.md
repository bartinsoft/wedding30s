# Wedding30s

## Architecture Rules

### Ephemeral containers — no local state
The app runs in Docker containers that can be destroyed and recreated at any time. **Never store persistent data on local disk.**

- **Photos**: always upload to S3 (`uploadToS3`). Local temp files (`public/uploads/tmp/`) must be deleted immediately after processing.
- **Generated HTML**: always upload to S3 (`uploadWeddingHtml`). The `weddings/` directory is a performance cache that regenerates from S3 on first request.
- **Wedding/guest data**: lives in the MySQL database, never on disk.
- **Static assets** (`public/`, `templates/`, `dist/`): baked into the Docker image at build time.

If you add a new feature that produces data, it must go to S3 or the database. Never rely on local filesystem persistence.

### Deployment
- Push to `main` triggers CI/CD (GitHub Actions) that builds, deploys via SSH, and runs in Docker with `--network host`.
- The `weddings/` volume is mounted for caching but is not the source of truth — S3 is.
- Database runs separately (MariaDB via docker-compose on the host).
- Run `npm run db:migrate` after schema changes.

### Pricing
- Current price: **EUR 49** (one-time). Payment via Polar.sh (Merchant of Record).
- If changing the price, update: landing page (`LandingView.vue`), i18n files (`en.json`, `es.json`), legal pages (terms), `index.html` meta, and Polar.sh dashboard.

### Templates
- 4 wedding templates in `templates/`: classic-garden, minimal-white, romantic-blush, modern-dark.
- Template variables use `{{variable}}` syntax, conditionals use `{{#section}}...{{/section}}`.
- Translated strings use `{{t_key}}` and are defined in `TEMPLATE_STRINGS` in `generator.ts`.
- Changes to templates require regenerating published weddings.

### i18n
- Frontend: vue-i18n with `src/client/i18n/locales/{en,es}.json`.
- Templates: `TEMPLATE_STRINGS` in `generator.ts` with `es` and `en` keys.
- Wedding pages use `{{lang}}` for the html lang attribute.
