/**
 * Cloudflare Pages middleware to enforce the canonical domain.
 *
 * Requests coming to `bierecode.com` are redirected permanently to
 * `www.bierecode.com` while preserving the original path and query
 * string. Requests already on the `www` subdomain continue to the
 * next handler or static asset.
 */
export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);

  if (url.hostname === 'bierecode.com') {
    url.hostname = 'www.bierecode.com';
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
};
