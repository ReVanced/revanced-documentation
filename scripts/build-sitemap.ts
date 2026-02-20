import { SITE_URL } from '../site.config.js';

await Bun.$`bunx svelte-sitemap --domain ${SITE_URL}`;
