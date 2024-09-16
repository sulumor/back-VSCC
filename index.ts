import { createServer } from "node:http";
import "@/helpers/env.load";
import app from "@/index.app";

const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`Running on : http://localhost:${PORT}`);
});
