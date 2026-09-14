import Task from "../models/Task.js";

// GET /api/tasks?status=pending&priority=high&category=Work&sort=dueDate
export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, category, sort, search } = req.query;
    const filter = { user: req.userId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category && category !== "all") filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    let query = Task.find(filter);

    if (sort === "dueDate") query = query.sort({ dueDate: 1 });
    else if (sort === "priority") query = query.sort({ priority: 1 });
    else query = query.sort({ createdAt: -1 });

    const tasks = await query;
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ task });
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, category, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const task = await Task.create({
      user: req.userId,
      title,
      description,
      status,
      priority,
      category: category || "Work",
      dueDate,
    });
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const existing = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!existing) return res.status(404).json({ message: "Task not found" });

    // Completed task lockdown: if already completed and not reopening to pending, block edits
    if (existing.status === "completed" && req.body.status !== "pending") {
      return res.status(403).json({
        message: "This task is marked as completed and is locked from further edits.",
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    res.json({ task });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};
