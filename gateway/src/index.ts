import ServerBootstrap from "./bootstrap/server.bootstrap";

(async () => {
  try {
    const serverBootstrap = new ServerBootstrap();
    await serverBootstrap.initialize();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
