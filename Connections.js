const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3006;
const uri = "mongodb://127.0.0.1:27017";
const dbName = "LinkedIn";

app.use(express.json());

let db, connections;

async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);

        connections = db.collection("connections");

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


// 6. GET /connections/:userId: Fetch all connections for a user.
// db.connections.find({ user1: "u001" });
app.get('/connections/:userId', async (req, res) => {
    try {
        const { userId } = req.params; // Extract userId from the URL parameter

        // Query the 'connections' collection to get all connections for this user
        const userConnections = await connections.find({ user1: userId }).toArray();

        if (userConnections.length === 0) {
            return res.status(404).json({ message: "No connections found for this user" });
        }

        res.status(200).json(userConnections);
    } catch (err) {
        console.error("Error fetching connections:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// 7. POST /connections: Send a connection request.
// db.connections.insertOne({
//     connectionId: "c003",
//     user1: "u001",
//     user2: "u004",
//     status: "pending",
//   });
app.post('/connections', async (req, res) => {
    try {
        const { user1, user2 } = req.body; // Extract user1 and user2 from the request body

        // Check if the connection already exists
        const existingConnection = await connections.findOne({ user1, user2 });
        if (existingConnection) {
            return res.status(400).json({ message: "Connection request already exists" });
        }

        // Create the new connection request with status 'pending'
        const newConnection = {
            connectionId: `c${Date.now()}`,  // Generate a unique connectionId
            user1,
            user2,
            status: "pending",
        };

        // Insert the new connection request into the database
        await connections.insertOne(newConnection);

        res.status(201).json({ message: "Connection request sent", connection: newConnection });
    } catch (err) {
        console.error("Error sending connection request:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// 8. PATCH /connections/:connectionId: Accept a connection request.
// db.connections.updateOne(
//   { connectionId: "c003" },
//   { $set: { status: "connected" } }
// );
app.patch('/connections/:connectionId', async (req, res) => {
    try {
        const { connectionId } = req.params; // Extract connectionId from URL
        const updatedConnection = await connections.updateOne(
            { connectionId }, 
            { $set: { status: "connected" } }
        );

        if (updatedConnection.matchedCount === 0) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        res.status(200).json({ message: "Connection request accepted" });
    } catch (err) {
        console.error("Error accepting connection request:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// 9. DELETE /connections/:connectionId: Remove a connection.
// db.connections.deleteOne({ connectionId: "c002" });
app.delete('/connections/:connectionId', async (req, res) => {
    try {
        const { connectionId } = req.params; // Extract connectionId from URL

        // Delete the connection
        const deleteResult = await connections.deleteOne({ connectionId });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ message: "Connection not found" });
        }

        res.status(200).json({ message: "Connection removed" });
    } catch (err) {
        console.error("Error removing connection:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});