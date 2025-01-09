const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3007;  // Change the port to 3007
const uri = "mongodb://127.0.0.1:27017";
const dbName = "LinkedIn";

app.use(express.json());

let db, posts;
async function initializeDatabase() {
    try {
        // Connect to MongoDB
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        // Access the "LinkedIn" database
        db = client.db(dbName);
        posts = db.collection("posts");

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



// 10. GET /posts: Fetch all posts.
// db.posts.find({});
app.get('/posts', async (req, res) => {
    try {
        const allPosts = await posts.find({}).toArray();
        
        if (allPosts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        res.status(200).json(allPosts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//11.  GET /posts/:postId: Fetch a specific post.
// db.posts.findOne({ postId: "p001" });
app.get('/posts/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        
        const post = await posts.findOne({ postId });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);
    } catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 12. POST /posts: Create a new post.
// db.posts.insertOne({
//   postId: "p003",
//   userId: "u001",
//   content: "Learning MongoDB is fun!",
//   likes: 0,
//   createdAt: new Date(),
// });
app.post('/posts', async (req, res) => {
    try {
        const { userId, content, mediaUrl, hashtags } = req.body;

        const newPost = {
            postId: `p${Date.now()}`, // Unique postId
            userId,
            content,
            mediaUrl,
            likes: 0,
            comments: [],
            createdAt: new Date(),
            hashtags: hashtags || [],
        };

        await posts.insertOne(newPost);

        res.status(201).json({ message: "Post created", post: newPost });
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// 13. PATCH /posts/:postId/likes: Add a like to a post.
// db.posts.updateOne({ postId: "p001" }, { $inc: { likes: 1 } });

app.patch('/posts/:postId/likes', async (req, res) => {
    try {
        const { postId } = req.params;

        // Increment the likes by 1
        const result = await posts.updateOne(
            { postId },
            { $inc: { likes: 1 } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Like added to post" });
    } catch (err) {
        console.error("Error adding like:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 14.   DELETE /posts/:postId: Delete a post.
// db.posts.deleteOne({ postId: "p003" });
app.delete('/posts/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        const result = await posts.deleteOne({ postId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post deleted" });
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});