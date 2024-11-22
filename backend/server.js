import express from "express";
import cors from "cors";
import { main } from "./chatbot.js";
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next)=> {
    console.log(`Request from ${req.url} \n`);
    next();
});

app.get("/", (req, res) => {
    return res.json({ message: "Server is running"})
})

app.post('/conversation', async (req, res) => {
    const userInput = req.body;
    console.log(userInput)
    console.log(userInput.prompt);
    try {
        const response = await main({prompt: userInput.prompt});
        return res.json({ output: response});
    } catch (error) {
        console.log("error", error);
        return res.json({output: "Internal Error 500"})
    }
    
});

export default app;