require('dotenv').config({
  path: '.env',
});

const env = {
  sourceDatabaseUrl: process.env.SOURCE_DATABASE_URL,
  targetDatabaseUrl: process.env.TARGET_DATABASE_URL
};

for (const key in env) {
  if (env[key] === null || env[key] === undefined || env[key] === '') {
    throw new Error(`Environment variable: ${key.replace(/(.)([A-Z])/gm, '$1_$2').toUpperCase()} was not defined\nProgram exited with code: 1`);
  }
}

module.exports = {
  ...env,
};
