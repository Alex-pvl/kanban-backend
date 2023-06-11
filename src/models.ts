export enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in progress",
    DONE = "done",
}

export enum TaskPriority {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
}

export interface User {
    id: number;
    name: string;
    login: string;
    password: string;
    token: string;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    userId: number;
}
