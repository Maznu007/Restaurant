import express from "express";
import { getAllMenuItems, getMenuItem, seedMenu } from "../controller/menu.js";

const router = express.Router();

router.get("/all", getAllMenuItems);
router.get("/seed", seedMenu); // Remove after initial setup
router.get("/:id", getMenuItem);

export default router;