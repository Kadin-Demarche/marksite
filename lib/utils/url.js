export function normalizeBasePath(baseUrl = '') {
  const trimmed = (baseUrl || '').trim();
  if (!trimmed) return '';
  return '/' + trimmed.replace(/^\/+|\/+$/g, '');
}

export function normalizeSiteUrl(siteUrl = '') {
  const trimmed = (siteUrl || '').trim();
  if (!trimmed) return '';
  return trimmed.replace(/\/+$/, '');
}

export function buildAbsoluteBase(siteUrl = '', baseUrl = '') {
  const origin = normalizeSiteUrl(siteUrl);
  const basePath = normalizeBasePath(baseUrl);
  return `${origin}${basePath}`;
}
