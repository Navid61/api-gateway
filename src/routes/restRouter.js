import { Router } from "express";
import axios from "axios";
const router = Router();
router.get("/", (req, res) => {
    res.send("This is the REST router!");
});
router.get("/external-data", async (req, res) => {
    try {
        const response = await axios.get('https://api.example.com/data');
        res.json(response.data);
    }
    catch (error) {
        console.error("Error fetching data from external API:", error);
        res.status(500).send("Error fetching data from external API");
    }
});
export default router;
