import "dotenv/config";
import { initServer } from "./server.js";
import { connectToDatabase } from "./data/mongoose.js";
(() => {
  main();
})();

async function main() {
  await connectToDatabase();
  initServer();
}
