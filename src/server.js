import Express from "express";
import morgan from "morgan";
import router from "./routes/routes.js";

const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(router);
export const initServer = () => {
  app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
  });
};
