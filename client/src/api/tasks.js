import api from "./axios";

export const fetchTasks = (params = {}) => api.get("/tasks", { params });
export const fetchTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const aiDecomposeTask = (data) => api.post("/tasks/ai-decompose", data);
export const toggleSubtask = (taskId, subtaskId) => api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`);
