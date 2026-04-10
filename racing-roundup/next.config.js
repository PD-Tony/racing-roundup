/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'www.autosport.com',
      'www.motorsport.com',
      'www.crash.net',
      'www.motogp.com',
      'cdn.crash.net',
      'cdn.motorsport.com',
      'photos.motogp.com',
      'cdn.autosport.com',
      'picsum.photos', // Added for mock data images
      'ichef.bbci.co.uk',
      'c.files.bbci.co.uk',
      'static.files.bbci.co.uk',
      'media.formula1.com',
      'www.formula1.com',
      'content.formula1.com',
      'f1-outsider.com',
      'd2d0b2rxqzh1q5.cloudfront.net',
      'i.ytimg.com',
      'static.independent.co.uk',
      'img.youtube.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  i18n: {
    locales: ['en-GB'],
    defaultLocale: 'en-GB',
  },
};

module.exports = nextConfig;
