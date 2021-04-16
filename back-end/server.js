const express = require('express');
const bodyParser = require("body-parser");
const argon2 = require("argon2");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/surprise', {
  useNewUrlParser: true
});

//User
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password'))
    return next();
  try {
    const hash = await argon2.hash(this.password);
    this.password = hash;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function(password) {
  try {
    const isMatch = await argon2.verify(this.password, password);
    return isMatch;
  } catch (error) {
    return false;
  }
};

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}



const User = mongoose.model('User', userSchema);

//Category
const categorySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  title: String,
});

const Category = mongoose.model('Category', categorySchema);

//Current Task
const currentTaskSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  description: String,
  difficulty: String,
  time: String,
});

const CurrentTask = mongoose.model('CurrentTask', currentTaskSchema);

//Previous Task
const previousTaskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  showCategories: Boolean,
  description: String,
  difficulty: String,
  time: String
});

const PreviousTask = mongoose.model('PreviousTask', previousTaskSchema);

//cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    keys: ['secretValue'],
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// middleware function to check for logged-in users
const validUser = async (req, res, next) => {
  if (!req.session.userID)
    return res.status(403).send({
      message: "not logged in"
    });
  try {
    const user = await User.findOne({
      _id: req.session.userID
    });
    if (!user) {
      return res.status(403).send({
        message: "not logged in"
      });
    }
    // set the user field in the request
    req.user = user;
  } catch (error) {
    return res.status(403).send({
      message: "not logged in"
    });
  }
  next();
};







//----------------METHODS--------------
//User Methods
app.post('/api/user', async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res.status(400).send({
      message: "username and password are required"
    });

  try {
    const existingUser = await User.findOne({
      username: req.body.username
    });
    if (existingUser)
      return res.status(403).send({
        message: "username already exists"
      });
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password
    });
    await user.save();
    req.session.userID = user._id;
    return res.send({
      user: user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.post('/api/user/login', async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res.sendStatus(400);

  try {
    const user = await User.findOne({
      username: req.body.username
    });
    if (!user)
      return res.status(403).send({
        message: "username or password is wrong"
      });
    if (!await user.comparePassword(req.body.password))
      return res.status(403).send({
        message: "username or password is wrong"
      });
    req.session.userID = user._id;
    return res.send({
      user: user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.get('/api/user', validUser, async (req, res) => {
  try {
    res.send({
      user: req.user
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.delete('/api/user/:id', async (req, res) => {
  try {
    let user = await User.findOne({_id: req.params.id});
    await Category.deleteMany({user:user});
    await CurrentTask.deleteMany({user:user});
    await PreviousTask.deleteMany({user:user});
    await user.delete();
    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete("/api/user", validUser, async (req, res) => {
  try {
    req.session = null;
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.put('/api/user/:id', async (req, res) => {
  try {
    let user = await User.findOne({
      _id: req.params.id
    });
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    await user.save();
    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//Category Methods
app.get('/api/user/:userID/categories', async (req, res) => {
  try {
    let user = await User.find({
      _id: req.params.userID
    });
    let categories = await Category.find({user:user});
    res.send(categories);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/user/:userID/categories', async (req, res) => {
    try {
        let user = await User.findOne({_id: req.params.userID});
        if (!user) {
            res.send(404);
            return;
        }
        let category = new Category({
            user: user,
            title: req.body.title,
        });
        await category.save();
        res.send(category);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/user/:userID/categories/:categoryID', async (req, res) => {
    try {
        let category = await Category.findOne({_id:req.params.categoryID, user: req.params.userID});
        if (!category) {
            res.send(404);
            return;
        }
        await CurrentTask.deleteMany({category:category});
        await category.delete();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//Previous Methods
app.post('/api/user/:userID/previousTasks', async (req, res) => {
    try {
        let user = await User.findOne({_id: req.params.userID});
        if (!user) {
            res.send(404);
            return;
        }
        let task = new PreviousTask({
            user: user,
            showCategories: false,
            description: req.body.description,
            difficulty: req.body.difficulty,
            time: req.body.time
        });
        await task.save();
        res.send(task);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/user/:userID/previousTasks', async (req, res) => {
    try {
        let user = await User.findOne({_id: req.params.userID});
        if (!user) {
            res.send(404);
            return;
        }
        let tasks = await PreviousTask.find({user:user});
        res.send(tasks);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/user/:userID/previousTasks', async (req, res) => {
  try {
    let user = await User.findOne({
      _id: req.params.userID
    });
    await PreviousTask.deleteMany({
      user:user
    });
    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/previousTasks/:previousID', async (req, res) => {
  try {
    let task = await PreviousTask.findOne({_id: req.params.previousID});

    if (task.showCategories===false) {
      task.showCategories = true;
      await task.save();
      res.sendStatus(200);
      return;
    }
    if (task.showCategories===true) {
      task.showCategories = false;
      await task.save();
      res.sendStatus(200);
    }
  }catch (error) {
    console.log(error);
  }
})

//Current Methods
app.post('/api/user/:userID/categories/:categoryID/currentTasks', async (req, res) => {
    try {
        let category = await Category.findOne({_id: req.params.categoryID});
        if (!category) {
            res.send(404);
            return;
        }
        let user = await User.findOne({_id: req.params.userID});
        if (!user) {
          res.send(404);
          return;
        }
        let task = new CurrentTask({
            user: user,
            category: category,
            description: req.body.description,
            difficulty: req.body.difficulty,
            time: req.body.time,
        });
        await task.save();
        res.send(task);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/categories/:categoryID/currentTasks', async (req, res) => {
    try {
        let category = await Category.findOne({_id: req.params.categoryID});
        if (!category) {
            res.send(404);
            return;
        }
        let tasks = await CurrentTask.find({category:category});
        res.send(tasks);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/categories/:categoryID/currentTasks/:taskID', async (req, res) => {
    try {
        let task = await CurrentTask.findOne({_id:req.params.taskID, category: req.params.categoryID});
        if (!task) {
            res.send(404);
            return;
        }
        await task.delete();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});


app.listen(3000, () => console.log('Server listening on port 3000!'));
