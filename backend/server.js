import express from "express";
import cors from "cors";
import { main } from "./chatbot";
import { hostname } from "os";
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next)=> {
    console.log(`Request from ${req.url} \n Headers: ${req.headers}`);
    next();
})

app.post('/conversation', (req, res) => {
    const userInput = req.body;
    const response = main(userInput);
    return res.json({ response: response});
});

app.listen(PORT, hostname, (req, res) => {
    console.log(`Server running on ${hostname} at Port: ${PORT}`);
})
