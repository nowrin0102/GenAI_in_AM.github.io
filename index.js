
//             require('dotenv').config();
            
//             // console.log(process.env);
//             // const express = require('express');
//             // const app = express();
//             // const apiKey = process.env.API_KEY;
//             // const testVariable = process.env.TEST_VARIABLE;
//             // console.log('API Key:', apiKey);           // Should print your API key
//             // console.log('Test Variable:', testVariable); // Should print "HelloWorld"
//             const apiKey1 = process.env.API_KEY;
//             console.log(apiKey1);

            
//             async function sendMessage() {
//                 let input = document.getElementById("userInput").value;
//                 let chatbox = document.getElementById("chatbox");
//                 // Add the user's message to the chatbox
//                 chatbox.innerHTML += `<div class='message user'>${input}</div>`;
//                 document.getElementById("userInput").value = "";

//                 // Get the AI response
//                 let reply = await getAIResponse(input);
//                 chatbox.innerHTML += `<div class='message bot'>${reply}</div>`;
//                 chatbox.
//                 scrollTop = chatbox.scrollHeight;  // Scroll to the bottom
//             }
//             // require('dotenv').config();
// // "02d33ffc524f45b5af582c6c902cb23e"
//             async function getAIResponse(message) {
//                 // let apiKey = "42cEIKjJE2kUiB1xPrwixrwnz6DC";
//                 // const apiKey = process.env.API_KEY;
//                 // const testVariable = process.env.TEST_VARIABLE;
//                 // constapi=apiKey
//                 let apiKey=apiKey1
//                 // const apiKey = process.env.API_KEY;
//                 console.log(apiKey);
//                 // const apiKey = "42cEIKjJE2kUiB1xPrwixrwnz6DC4pCv7mZLVsIZ3nyHatc8tzwwJQQJ99BCACYeBjFXJ3w3AAABACOGhgKq";
//                 // let apiKey = "42cEIKjJE2kUiB1xPrwixrwnz6DC4pCv7mZLVsIZ3nyHatc8tzwwJQQJ99BCACYeBjFXJ3w3AAABACOGhgKq";
//                 // let apiKey = AZURE_OPENAI_API_KEY;
//                 let endpoint = "https://nowrinimage.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-02-15-preview"; // Replace with your Azure OpenAI Endpoint
//                 let deployment = "gpt-4o-mini"; // Replace with your Azure GPT Deployment Name
//                 console.log(deployment);
            
//                 let response = await fetch(endpoint, {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "api-key": apiKey
//                     },
//                     body: JSON.stringify({
//                         messages: [{ role: "user", content: message }]
//                     })
//                 });

//                 if (!response.ok) {
//                     console.error("Error fetching AI response:", response.statusText);
//                     return "Sorry, I couldn't process your request.";
//                 }

//                 let data = await response.json();
//                 return data.choices[0].message.content;
//             }
async function sendMessage() {
    let input = document.getElementById("userInput").value;
    let chatbox = document.getElementById("chatbox");

    // Add the user's message to the chatbox
    chatbox.innerHTML += `<div class='message user'>${input}</div>`;
    document.getElementById("userInput").value = "";

    // Get the AI response
    let reply = await getAIResponse(input);
    chatbox.innerHTML += `<div class='message bot'>${reply}</div>`;
    chatbox.scrollTop = chatbox.scrollHeight;  // Scroll to the bottom
}

async function getAIResponse(message) {
    const response = await fetch('http://localhost:3000/api/getAIResponse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    });

    if (!response.ok) {
        console.error("Error fetching AI response:", response.statusText);
        return "Sorry, I couldn't process your request.";
    }

    const data = await response.json();
    return data.reply;
}