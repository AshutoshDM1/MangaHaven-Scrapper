import { Router } from "express";
import main from "../controllers/webscrapper.controller";

const router = Router();

router.post("/", main);

export default router;
