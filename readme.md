Mini Project - Social Media App


A simple social media application built with Node.js, Express, and MongoDB, featuring user authentication, post creation, liking, and editing functionality.



Table of Contents:


Features
Technologies Used
Installation
Usage
API Endpoints
License

Features:


User registration and authentication using JWT.
Create, edit, and delete posts.
Like/unlike posts.
User profiles displaying posts.
Secure routes ensuring only logged-in users can access certain functionalities.




Technologies Used


Node.js: Server-side JavaScript runtime.
Express: Web framework for building APIs and web applications.
MongoDB: NoSQL database for storing user and post data.
EJS: Templating engine for rendering dynamic HTML pages.
JWT: JSON Web Tokens for secure user authentication.
Bcrypt: Library for hashing passwords.




Installation


Clone the repository:


git clone https://github.com/yourusername/mini-project.git
cd mini-project
Install dependencies:



npm install
Set up the environment variables:


Create a .env file and add your MongoDB URI and JWT secret if needed.
Start the server:



npm start
Open your browser and go to http://localhost:3000.



Usage


Register a new user by visiting the /register route.
Log in using the /login route.
Create new posts from the profile page.
Edit or delete your posts as needed.
Like and unlike posts to engage with content.


API Endpoints

User Authentication
POST /register: Register a new user.
POST /login: Log in an existing user.
GET /logout: Log out the user.

Posts

POST /post: Create a new post.


GET /edit/:id: Display the edit form for a specific post.


POST /edit/:id: Update the content of a specific post.


GET /like/:id: Like or unlike a specific post.


GET /profile: View the user profile and posts.




License


This project is licensed under the MIT License - see the LICENSE file for details.


Feel free to customize any sections as needed, such as adding more specific instructions or modifying feature descriptions!
