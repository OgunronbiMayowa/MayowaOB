//jshint esversion:6
require('dotenv').config(); 
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption"); // LEVEL 2 AUTHENTICATION
// const md5 = require("md5"); // LEVEL 3 AUTHENTICATION
// const bcrypt = require("bcrypt"); // LEVEL 4 AUTHENTICATION
// const saltRounds = 10; // LEVEL 4 AUTHENTICATION
const session = require("express-session"); // LEVEL 5: USING PASSPORT TO ADD COOKIES
const passport = require("passport"); // LEVEL 5: USING PASSPORT TO ADD COOKIES
const passportLocalMongoose = require("passport-local-mongoose"); // LEVEL 5: USING PASSPORT TO ADD COOKIES
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const findOrCreate = require("mongoose-findorcreate");


const app = express();

app.use(express.static("Public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect your db to a specified port and give the db a name 
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});
// mongoose.set("useCreateIndex", true);

// Create a Schema for Article
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String, 
    secret: String
});

// LEVEL 2 AUNTHENTICATION: Using the Mongoose Encryption to secure the passwords in the database
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });

// LEVEL 5: USING PASSPORT TO ADD COOKIES
userSchema.plugin(passportLocalMongoose);

userSchema.plugin(findOrCreate);

// Create a model for Article. Monogoose automatically creates a Collection called articles 
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(e, user) {
        done(e, user);
    });
});

passport.use(new GoogleStrategy({
    clientID:     process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/ouath2/v3/userinfo",
    // passReqToCallback   : true
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req, res) {
    res.render("home")
});

app.get("/login", function(req, res) {
    res.render("login")
});

app.get("/register", function(req, res) {
    res.render("register")
});

app.get("/secrets", function(req, res) {
    User.find({ "secret": {$ne:null} }, function(e, foundUsers) {
        if(e) {
            console.log(e);
        } else {
            if (foundUsers) {
                res.render("secrets", {usersWithSecrets: foundUsers})
            }
        }
    })
});

app.get("/submit", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("submit")
    } else {
        res.redirect("/login")
    }
});

app.post("/submit", function(req, res) {
    const submittedSecret = req.body.secret;

    console.log();
    User.findById(req.user.id, function(e, foundUser) {
        if(e) {
            console.log(e);
        } else {
            if(foundUser) {
                foundUser.secret = submittedSecret;
                foundUser.save(function() {
                    res.redirect("/secrets")
                });
            }
        }
    });
});

app.get("/logout", function(req, res) {
    req.logOut(function(e) {
        if (e) {
            console.log(e);
        } else {
            res.redirect("/")
        }
    })
});

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/auth/google/secrets',
    passport.authenticate( 'google', {
        successRedirect: '/secrets',
        failureRedirect: '/login'
}));



app.post("/register", function(req, res) {
    // const newUser = new User({
    //     email: req.body.username,
    //     password: md5(req.body.password) // LEVEL 3: Hashing Passwords using md5
    // });
    // newUser.save(function(e) {
    //     if(e) {
    //         console.log(e);
    //     } else (
    //         res.render("secrets")
    //     )
    // })

    // LEVEL 4: Using bcrypt
    // bcrypt.hash(req.body.password, 10, function(e, hash) {
    //     const newUser = new User({
    //         email: req.body.username,
    //         password: hash
    //     });
    //     newUser.save(function(e) {
    //         if(e) {
    //             console.log(e);
    //         } else (
    //             res.render("secrets")
    //         )
    //     });
    // });

   // LEVEL 5: USING PASSPORT TO ADD COOKIES
    User.register({username: req.body.username}, req.body.password, function(e, user) {
        if (e) {
            console.log(e)
            res.redirect("/register")
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets")
            })
        }
    });

});

app.post("/login", function(req, res) {
    // const username = req.body.username;
    // const password = req.body.password; // LEVEL 3: Comparing the hashed version of the user log in password to the hashed version of the registered password

    // User.findOne({email: username}, function(e, foundUser) {
    //     if(e) {
    //         console.log(e);
    //     } else {
    //         if(foundUser) {
    //             bcrypt.compare(password, foundUser.password, function(e, result) {
    //                 if (result === true) {
    //                     res.render("secrets");
    //                }
    //             })
    //         }
            
    //     }
    // })

   // LEVEL 5: USING PASSPORT TO ADD COOKIES
    const user = new User ({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(e) {
        if (e) {
            console.log(e);
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets")
            })
        }
    })

})




app.listen(3000, function() {
    console.log("Server is running on port 3000");
})