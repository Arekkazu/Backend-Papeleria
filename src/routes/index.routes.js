import { Router } from "express";
import { IndexController } from "../controller/index.controller.js";

const Indexrouter = Router();
Indexrouter.get("/", IndexController.index);

export default Indexrouter;
