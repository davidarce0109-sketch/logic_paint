const env = require('./src/config/env');
const { bootstrap } = require('./src/startup/bootstrap');
const { createApp } = require('./src/app');

async function main() {
  const container = await bootstrap(env);
  const app = createApp(container);
  const server = app.listen(env.port, () => {
    console.log(`Logic Paint API escuchando en http://localhost:${env.port} (persistencia: ${env.storageDriver})`);
  });

  const shutdown = async () => {
    server.close();
    await container.close();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((error) => {
  console.error('No se pudo iniciar la API:', error.message);
  process.exit(1);
});
