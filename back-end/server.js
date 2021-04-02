const express = require('express');
const bodyParser = require("body-parser");

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
  name: String,
});

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
  description: String,
  difficulty: String,
  time: String
});

const PreviousTask = mongoose.model('PreviousTask', previousTaskSchema);

//----------------METHODS--------------
//User Methods
app.post('/api/user', async (req, res) => {
  const user = new User({
    name: req.body.name
  });
  try {
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/user', async (req, res) => {
  try {
    let users = await User.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/user/:id', async (req, res) => {
  try {
    await User.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/user/:id', async (req, res) => {
  try {
    let user = await User.findOne({
      _id: req.params.id
    });
    user.name = req.body.name;
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

//Current Methods
app.post('/api/categories/:categoryID/currentTasks', async (req, res) => {
    try {
        let category = await Category.findOne({_id: req.params.categoryID});
        if (!category) {
            res.send(404);
            return;
        }
        let task = new CurrentTask({
            category: category,
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
