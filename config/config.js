const config = {
  entry: {
    pages: ['src/*.html'],
  },
  outPath: 'dist', // 输出目录
  buildName: 'bundle.js',
  isDebug: false,
  isDevEnv: process.env.NODE_ENV === 'development',
};
console.log(process.env.NODE_ENV);

module.exports = config;
