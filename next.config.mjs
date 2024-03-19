/** @type {import('next').NextConfig} */

const nextConfig = {
  compiler: {
    // https://nextjs.org/docs/architecture/nextjs-compiler#emotion
    emotion: {
      sourceMap: true,
      autoLabel: 'always',
      labelFormat: '[local]',
    },
  },
};
