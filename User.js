const express = require('express'); 
const { MongoClient, ObjectId } = require('mongodb');


const app = express();
const port = 3005;
const uri = "mongodb://127.0.0.1:27017";
const dbName = "LinkedIn";

app.use(express.json());

let db, users;
async function initializeDatabase() {
    try {
        // Connect to MongoDB
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        // Access the "socialApp" database
        db = client.db(dbName);

        // Set the correct collection name for users
        users = db.collection("users");

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


// 1 . GET /users: Fetch all users.
app.get('/users', async (req, res) => {
    try {
        const allUsers = await users.find({}).toArray();
        res.status(200).json(allUsers);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Internal Server Error");
    }
});



// 2.GET /users/:userId: Fetch a specific user.
// db.users.findOne({ userId: "u001" });

app.get('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params; 
        const user = await users.findOne({ userId });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});


// 3. POST /users: Create a new user.
// db.users.insertOne({
//   userId: "u003",
//   name: "Arjun Verma",
//   headline: "Full Stack Developer",
//   location: "Bangalore, India",
//   connections: 150,
// });
app.post('/users', async (req, res) => {
    try {
        const newUser = req.body; 
        const result = await users.insertOne(newUser);
        res.status(201).json({ message: "User created", userId: result.insertedId });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});


// 4. PATCH /users/:userId: Update user headline.
// db.users.updateOne(
//   { userId: "u001" },
//   { $set: { headline: "Team Lead at CodingGita" } }
// );
app.patch('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { headline } = req.body; 
        const result = await users.updateOne(
            { userId }, // Filter by userId
            { $set: { headline } } 
        );
        if (result.matchedCount === 0) {
            return res.status(404).send("User not found");
        }
        res.status(200).json({ message: "User headline updated" });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});


// DELETE /users/:userId: Delete a user.
// db.users.deleteOne({ userId: "u003" });
app.delete('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params; // Extract userId from URL
        // Delete the user from the database
        const result = await users.deleteOne({ userId });
        if (result.deletedCount === 0) {
            return res.status(404).send("User not found");
        }
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});