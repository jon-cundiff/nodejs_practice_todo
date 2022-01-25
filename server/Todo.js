class Todo {
    constructor(title, priority, dateCreated) {
        this.title = title;
        this.priority = priority;
        this.dateCreated = dateCreated;
    }

    toObject() {
        return {
            title: this.title,
            priority: this.priority,
            dateCreated: this.dateCreated,
        };
    }
}

module.exports = Todo;
