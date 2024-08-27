const express = require('express');
const mongoose = require('mongoose')
//app configuration
const app = express();
const port = 3000;

//middleware configuration
app.use(express.json());

//configure mongodb
mongoose.connect("mongodb+srv://hairwayon2024:Pavan21p5959@cluster0.zqxqw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log('MongoDB connected');
  }).catch((error) => {
    console.error('MongoDB connection error:', error);
  });

  const User = require('./models/todoSchema');


app.get('/',(req,res)=>{
  res.send("Node Server is Running, Yay!!");
})

app.get('/api/v1/items/', async (req, res) => {
  try {
    const userId = req.query.id; // Get user_id from query parameters
    console.log(`Fetching todos for user: ${userId}`);
    
    // Check if user exists in the database
    let user = await User.findOne({ user_id: userId });

    // If user doesn't exist, create a new user with an empty todos list
    if (!user) {
      console.log(`User not found. Creating new user with ID: ${userId}`);
      user = new User({
        user_id: userId,
        todos: [] // Initialize with an empty todos list
      });

      // Save the new user to the database
      await user.save();
    }

    // Return the user's todos (which may be empty if newly created)
    return res.status(200).json(user.todos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});



app.post('/api/v1/items', async (req, res) => {
  try {
    const { user_id, todos } = req.body;

    // Validate data if needed
    if (!user_id || !todos || !Array.isArray(todos) || todos.length === 0) {
      return res.status(400).json({ message: 'User ID and valid todos are required' });
    }

    // Find the user by user_id
    const existingUser = await User.findOne({ user_id });

    if (existingUser) {
      // If user exists, push new todos to the existing todos array
      existingUser.todos.push(...todos);
      await existingUser.save();
      return res.status(200).json({ message: 'Todo item(s) added successfully', data: existingUser });
    } else {
      // If user does not exist, create a new user with todos
      const newUser = new User({ user_id, todos });
      await newUser.save();
      return res.status(201).json({ message: 'User and Todo item(s) created successfully', data: newUser });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.put('/api/v1/items', async (req, res) => {
  try {
    const { user_id, todo_id, isDone } = req.body;

    if (!user_id || !todo_id || typeof isDone !== 'boolean') {
      return res.status(400).json({ message: 'Invalid data' });
    }

    // Find the user by user_id
    const user = await User.findOne({ user_id: user_id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the todo item within the user's todos array
    const todo = user.todos.find(todo => todo.id === todo_id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo item not found' });
    }

    // Update the isDone status
    todo.isDone = isDone;

    // Save the updated user document
    await user.save();

    return res.status(200).json({ message: 'Todo item updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Delete ToDo route
app.delete('/api/v1/items/:todo_id', async (req, res) => {
  try {
    const { todo_id } = req.params;
    const { user_id } = req.body; // Assuming you are sending user_id in the body

    if (!todo_id || !user_id) {
      return res.status(400).json({ message: 'User ID and ToDo ID are required' });
    }

    // Find the user by user_id
    const user = await User.findOne({ user_id: user_id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use pull to remove the todo item by its id
    const result = await User.updateOne(
      { user_id: user_id },
      { $pull: { todos: { id: todo_id } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Todo item not found' });
    }

    return res.status(200).json({ message: 'Todo item deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//listners
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})