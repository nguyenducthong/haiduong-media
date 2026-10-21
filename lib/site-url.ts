/** Shared origin for metadata, structured data, sitemap and robots. */
export function resolveSiteUrl(value: string): URL {
  const url = new URL(value.trim());
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('NEXT_PUBLIC_SITE_URL / SITE_URL must be an HTTP(S) origin without a path, query or credentials.');
  }
  return url;
}

export const siteUrl = resolveSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://thuonghieuhangdauvn.com',
);

export function absoluteSiteUrl(path = '/'): string {
  return new URL(path, siteUrl).href;
}
