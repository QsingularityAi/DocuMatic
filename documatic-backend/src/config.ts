export const environment = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_ENV: process.env.APP_ENV || 'local',

  // Runtime environments
  runtime: {
    isDev: process.env.NODE_ENV === 'development',
    isTest: process.env.APP_ENV === 'test',
    isProd: process.env.NODE_ENV === 'production',
  },

  // Deployment environments
  deployment: {
    isDev: process.env.APP_ENV === 'local',
    isStaging: process.env.APP_ENV === 'staging',
    isProd: process.env.APP_ENV === 'production',
  },
};

export const frontendUrl = environment.deployment.isDev
  ? 'http://localhost:5173'
  : environment.deployment.isStaging
    ? 'https://app.documatic.xyz'
    : environment.deployment.isProd
      ? 'https://app.documatic.com'
      : 'https://DOCUMATIC';
