import express from "express";
import { addEvent, getEvent, putEvent } from "../controller/event.controller.js";

const router = express.Router();

router.post("/", addEvent)
router.get("/:id", getEvent)
router.put("/:id", putEvent)



export default router;