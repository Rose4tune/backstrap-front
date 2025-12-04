/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    // NOTE: remotePatterns가 제대로 작동하지 않아서 domains를 임시로 추가.
    // domains: [
    //   'dev.bagstrap.team',
    //   'resource.bagstrap.team',
    //   'apiv2.bagstrap.team',
    //   'bagstrap-static.s3.ap-northeast-2.amazonaws.com',
    // ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'dev.bagstrap.team'
      },
      {
        protocol: 'http',
        hostname: '*.kakaocdn.net'
      },
      {
        protocol: 'https',
        hostname: '*.kakaocdn.net'
      },
      {
        protocol: 'https',
        hostname: '*.bagstrap.team'
      },
      {
        protocol: 'https',
        hostname: 'bagstrap-static.s3.ap-northeast-2.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'bagstrap-resource.s3.ap-northeast-2.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net'
      },
      {
        protocol: 'https',
        hostname: '*.youtube.com'
      }
    ]
  },
  reactStrictMode: true,
  webpack(config) {
    //Grab the existing rule
    const fileLoaderRule = config.module.rules.find(rule => rule.test?.test?.('.svg'));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/ // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack']
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  env: {
    BASE_URL: `${process.env.NEXT_PUBLIC_BASE_SERVICE_PROTOCOL}://${process.env.NEXT_PUBLIC_BASE_SERVICE_DOMAIN}`
  },
  async rewrites() {
    const restApiEndpoint = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
    
    // 환경 변수가 설정되어 있으면 프록시 설정
    if (restApiEndpoint) {
      return [
        {
          source: '/api/:path*',
          destination: `${restApiEndpoint}/api/:path*`,
        },
      ];
    }
    
    // 환경 변수가 없으면 빈 배열 반환 (프록시 없음)
    return [];
  }
};
