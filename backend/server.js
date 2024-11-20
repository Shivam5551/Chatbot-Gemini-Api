import express from "express";
import cors from "cors";

import { hostname } from "os";
import { main } from "./chatbot.js";
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next)=> {
    console.log(`Request from ${req.url} \n`);
    next();
});

app.post('/conversation', async (req, res) => {
    const userInput = req.body;
    // console.log(userInput.body)
    const response = await main({ prompt: userInput.body})
    return res.json({ output: response});
});

app.listen(PORT, hostname, (req, res) => {
    console.log(`Server running on ${hostname} at Port: ${PORT}`);
})
