import "dotenv/config";
import { initServer } from "./server.js";
import { connectToDatabase } from "./data/mongoose.js";
(() => {
  main();
  console.log("Funcion main iniciada");
})();

async function main() {
  await connectToDatabase();
  initServer();
}
