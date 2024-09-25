const express = require('express');
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/edit/:id', isLoggedIn, async (req, res) => {
        const post = await postModel.findOne({ _id: req.params.id }).populate("user");
      res.render("edit",{post});
});
app.get('/update/:id', isLoggedIn, async (req, res) => {
        const post = await postModel.findOneAndUpdate({ _id: req.params.id },{content: req.body.content});
      res.redirect("/profile");
});
app.get('/like/:id', isLoggedIn, async (req, res) => {
        const post = await postModel.findOne({ _id: req.params.id }).populate("user");
      
        if(post.likes.indexOf(req.user.userid) === -1){
            post.likes.push(req.user.userid);
        }
        else{
            post.likes.splice(post.likes.indexOf(req.user.userid), 1);
        }
        await post.save();
        res.redirect("/profile");
});
app.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email }).populate('posts');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render("profile", { user }); // Pass the user object to the template
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/logout', (req, res) => {
    res.cookie("token", "", { expires: new Date(0) }); // Clear the cookie
    res.redirect("/login");
});

app.post('/post',isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        let { content } = req.body;
        let post = await postModel.create({
            user: user._id,
            content
        });
        user.posts.push(post._id);
        await user.save();
        res.redirect("/profile");
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).send("User not found");

        const result = await bcrypt.compare(password, user.password);
        if (result) {
            const token = jwt.sign({ email: user.email, userid: user._id,name: user.name }, "irkam");
            res.cookie("token", token);
            res.status(200).redirect("/profile");
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
});

app.post('/register', async (req, res) => {
    const { email, password, username, name, age } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(400).send("User already registered");

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            username,
            email,
            age,
            name,
            password: hash
        });

        const token = jwt.sign({ email: user.email, userid: user._id , name: user.name}, "irkam");
        res.cookie("token", token);
        res.status(201).send("Registered");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send("You must logged in First");
    }

    jwt.verify(token, "irkam", (err, data) => {
        if (err) return res.status(401).send("Invalid token");
        req.user = data; // Attach the decoded user data to the request
        next();
    });
}

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
