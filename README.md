# LINKDIN-CURD_TASK
GET /users: Fetches all users from the database. Returns a list of user profiles.
GET /users/:userId: Retrieves a specific user by their userId. Returns the details of that user.
POST /users: Creates a new user in the database. Adds the user’s profile information.
PATCH /users/:userId: Updates the user’s headline. Changes the headline for a specific user.
DELETE /users/:userId: Deletes a user from the database. Removes the user’s profile.
GET /connections/:userId: Fetches all connections for a given user. Returns a list of connected users.
POST /connections: Sends a new connection request between two users. Adds a pending connection to the database.
PATCH /connections/:connectionId: Accepts a pending connection request. Updates the connection status to 'connected.'
DELETE /connections/:connectionId: Removes a connection between users. Deletes the connection from the database.
GET /posts: Fetches all posts from the database. Returns a list of posts created by users.
GET /posts/:postId: Retrieves a specific post by postId. Returns the details of that post.
POST /posts: Creates a new post. Adds a post to the user’s profile with content and media.
PATCH /posts/:postId/likes: Increments the likes of a post. Adds one like to a specific post.
DELETE /posts/:postId: Deletes a specific post by postId. Removes the post from the database.
GET /messages/:userId: Fetches all messages for a user. Returns a list of received messages.
POST /messages: Sends a new message. Adds a message from one user to another.
DELETE /messages/:messageId: Deletes a specific message by messageId. Removes the message from the database.
GET /users/:userId/profile-views: Fetches the profile view count for a user. Returns the number of profile views.
PUT /users/:userId/skills: Adds a new skill to a user. Updates the user's skills with the new entry.
PATCH /users/:userId/premium: Upgrades a user to premium status. Changes the user’s account to 'premium.'
