/** @type {import('next').NextConfig} */
const config = {
  poweredByHeader: false,
  output: 'export',
  trailingSlash: true,
  turbopack: { root: new URL('..', import.meta.url).pathname },
};
export default config;
