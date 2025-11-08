export const dynamic = 'force-static';

export async function GET() {
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /cennik/admin/\nSitemap: https://papi-hair.web.app/sitemap.xml\n`,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
}
