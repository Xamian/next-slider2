module.exports = {
  webpack: {},
  async rewrites() {
    return [
      {
        source: '/api/proxy/thispersondoesnotexist/:path*',
        destination: 'https://thispersondoesnotexist.com/:path*', // Matched parameters can be used in the destination
      },
      // {
      //   source: '/api/proxy/thispersondoesnotexist/:path*',
      //   destination: '/download.png', // Matched parameters can be used in the destination
      // },
    ]
  },
}