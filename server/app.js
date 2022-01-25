const express = require("express");
const cors = require("cors");
const Todo = require("./Todo");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const todos = [];

const formatIndex = (position) => {
    const index = parseInt(position);
    if (index < 0 || index >= todos.length || isNaN(index)) {
        throw new Error("Invalid index");
    }
    return index;
};

app.get("/todos", (req, res) => {
    res.json(todos);
});

app.post("/todos", (req, res) => {
    const { title, priority } = req.body;
    if (!title || !priority) {
        return res
            .status(400)
            .json({ error: "Title and priority are required!" });
    }

    const today = new Date();
    const newTodo = new Todo(title, priority, today.toLocaleDateString());
    todos.push(newTodo.toObject());
    res.status(201).json({
        todoAdded: "Todo added succesfully.",
    });
});

app.put("/todos", (req, res) => {
    const { index, title, priority } = req.body;
    try {
        if (index === undefined) {
            return res.status(400).json({ error: "Index is required!" });
        } else if (!title && !priority) {
            return res
                .status(400)
                .json({ error: "Title or priority is required!" });
        }

        const position = formatIndex(index); // Throws error if not numerical and out of index range
        const todo = todos[position];
        todo.title = title ? title : todo.title;
        todo.priority = priority ? priority : todo.priority;
        res.json({ todoUpdated: "Todo successfully updated" });
    } catch {
        res.status(400).json({ error: "Invalid index" });
    }
});

app.delete("/todos", (req, res) => {
    const { index } = req.body;
    try {
        if (index === undefined) {
            return res.status(400).json({ error: "Index is required!" });
        }
        const position = formatIndex(index); // Throws error if not numerical and out of index range
        todos.splice(position, 1);
        res.json({ todoDeleted: "Todo successfully deleted" });
    } catch {
        res.status(400).json({ error: "Invalid index" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
