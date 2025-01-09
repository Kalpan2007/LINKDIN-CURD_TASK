const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3008; // You can change this port if you need
const uri = "mongodb://127.0.0.1:27017";
const dbName = "LinkedIn"; // Make sure this is the correct database name

app.use(express.json());

let db, messages;
async function initializeDatabase() {
    try {
        // Connect to MongoDB
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        // Access the "LinkedIn" database
        db = client.db(dbName);

        // Set the correct collection name for messages
        messages = db.collection("messages");

        // Start the server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Call the function to initialize the database connection
initializeDatabase();

// API Endpoints

// 15. GET /messages/:userId: Fetch messages for a user
app.get('/messages/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const userMessages = await messages.find({ to: userId }).toArray();

        if (userMessages.length === 0) {
            return res.status(404).json({ message: "No messages found" });
        }

        res.status(200).json(userMessages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 16. POST /messages: Send a message
app.post('/messages', async (req, res) => {
    try {
        const { from, to, content } = req.body;

        const newMessage = {
            messageId: `m${Date.now()}`,  // Unique messageId based on the timestamp
            from,
            to,
            content,
            sentAt: new Date(),
        };

        await messages.insertOne(newMessage);

        res.status(201).json({ message: "Message sent", message: newMessage });
    } catch (err) {
        console.error("Error sending message:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 17. DELETE /messages/:messageId: Delete a message
app.delete('/messages/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;

        const result = await messages.deleteOne({ messageId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.status(200).json({ message: "Message deleted" });
    } catch (err) {
        console.error("Error deleting message:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
