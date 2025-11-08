export const dynamic = 'force-static';

export async function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://papi-hair.web.app/</loc></url>\n  <url><loc>https://papi-hair.web.app/blog</loc></url>\n  <url><loc>https://papi-hair.web.app/cennik</loc></url>\n</urlset>`;
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
