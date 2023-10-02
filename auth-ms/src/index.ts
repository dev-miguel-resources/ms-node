import ServerBootstrap from "./bootstrap/server.bootstrap";
import DatabaseBootstrap from "./bootstrap/database.bootstrap";

const server = new ServerBootstrap();
const database = new DatabaseBootstrap();

(async () => {
  try {
    const listPromises = [server.initialize(), database.initialize()];
    await Promise.all(listPromises);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
