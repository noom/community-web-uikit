module.exports = {
  presets: ['@babel/env', '@babel/preset-react', '@babel/preset-typescript'],
  plugins: [
    [
      'styled-components',
      {
        displayName: process.env.NODE_ENV !== 'production',
        fileName: false,
        ssr: false,
      },
    ],
  ],
};
