import * as fs from "fs";
import * as crypto from "crypto";
import { generateId } from "./idgen";
import { resolve } from "path";

interface ITodo {
    /**
     * Todo の内容
     */
    todo: string;

    /**
     * Todo の ID
     */
    id: string;

    /**
     * Todo が完了しているか
     */
    completed: boolean;
}

class Todo implements ITodo {
    constructor(public todo: string, public id: string, public completed = false) {
    }

    toString(): string {
        const state = this.completed ? "✅" : " ";
        return `${state}  [${this.id}]    ${this.todo}`;
    }
}


export async function list(): Promise<boolean> {
    const todos = await restoreTodos();
    for (const todo of todos) {
        console.log(todo.toString());
    }
    return Promise.resolve(true);
}

export async function add(todo: string): Promise<boolean> {
    if (todo.length > 0) {
        const todos = await restoreTodos();
        const newTodo = new Todo(todo, generateId(), false);
        todos.push(newTodo);
        return new Promise<boolean>((resolve) => {
            fs.writeFileSync("./todo.json", JSON.stringify(todos, undefined, 4));
            console.log("Todo を追加したやで: " + newTodo.toString());
            resolve(true);
        });
    } else {
        console.log("内容のない Todo");
        return Promise.resolve(false);
    }
}

export async function complete(todoId: string): Promise<boolean> {
    if (todoId.length > 0) {
        const todos = await restoreTodos();
        const todoToComplete = todos.find(todo => todo.id == todoId);
        if (todoToComplete) {
            todoToComplete.completed = true;
            return new Promise<boolean>(resolve => {
                fs.writeFileSync("./todo.json", JSON.stringify(todos, undefined, 4));
                resolve(true);
            });
        } else {
            console.log("指定された ID に相当する Todo が見つかりませんでした: " + todoId);
            return Promise.resolve(false);
        }
    } else {
        console.log("不正な Todo ID");
        return Promise.resolve(false);
    }
}

export function restoreTodos(): Promise<Todo[]> {
    return new Promise((resolve) => {
        if (fs.existsSync("./todo.json")) {
            const s = fs.readFileSync("./todo.json").toString();
            const todoObjects = JSON.parse(s) as ITodo[];
            const todos = todoObjects.map(x => new Todo(x.todo, x.id, x.completed));
            resolve(todos);
        } else {
            resolve([]);
        }
    });
}
