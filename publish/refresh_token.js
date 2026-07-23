#!/usr/bin/env node
/* Refreshes the long-lived Instagram access token before it expires.
 * Meta's Instagram Login tokens expire 60 days after issue/last refresh;
 * refreshing (only possible while still valid, and only after it's at
 * least 24h old) extends it another 60 days. This is run weekly by
 * .github/workflows/refresh-token.yml, well within that window.
 *
 * Prints ONLY the new token to stdout — nothing else — so the calling
 * workflow can capture and mask it without ever logging the value.
 */
const TOKEN = process.env.IG_ACCESS_TOKEN;

async function main() {
  if (!TOKEN) {
    throw new Error('Missing IG_ACCESS_TOKEN env var.');
  }
  const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(TOKEN)}`;
  const res = await fetch(url);
  const json = await res.json();
  if (json.error) {
    throw new Error(`Token refresh failed: ${JSON.stringify(json.error)}`);
  }
  if (!json.access_token) {
    throw new Error(`Unexpected refresh response (no access_token): ${JSON.stringify(json)}`);
  }
  process.stdout.write(json.access_token);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
