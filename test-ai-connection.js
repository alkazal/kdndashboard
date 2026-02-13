import fetch from 'node-fetch';

const HOST_IP = "150.150.216.150";
const PORT = "11434";
const MODEL_NAME = "gpt-oss:120b";

async function checkOllama() {
    try {
        // 1. Check if Ollama is even alive
        const version = await fetch(`http://${HOST_IP}:${PORT}/api/tags`);
        const data = await version.json();
        
        console.log("✅ Connection Successful!");
        
        // 2. Check if your specific model is downloaded
        const modelExists = data.models.some(m => m.name === MODEL_NAME);
        if (modelExists) {
            console.log(`✅ Model '${MODEL_NAME}' is ready to use.`);
        } else {
            console.error(`❌ Model '${MODEL_NAME}' not found on server.`);
            console.log("Available models:", data.models.map(m => m.name));
        }
    } catch (err) {
        console.error("❌ Connection Failed. Check your IP/Port and Firewall settings.");
        console.error(err.message);
    }
}

checkOllama();