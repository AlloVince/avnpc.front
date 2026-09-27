/** @type {import('next').NextConfig} */
const config = {
  poweredByHeader: false,
  output: 'export',
  trailingSlash: true,
  // The original brand fonts live in the repository's static/fonts directory.
  turbopack: { root: new URL('..', import.meta.url).pathname },
};
export default config;
