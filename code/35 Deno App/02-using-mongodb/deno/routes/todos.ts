import { Router } from 'https://deno.land/x/oak@14.2.0/mod.ts';
import { ObjectId } from 'https://deno.land/x/mongo@v0.33.0/mod.ts';

import { getDb } from '../helpers/db_client.ts';

const router = new Router();

interface Todo {
    id?: string;
    text: string;
}

let todos: Todo[] = [];

router.get('/todos', async (ctx) => {
    /** FIND RETURNS A CURSOR, CALL .toArray() */
    const todos = await getDb().collection('todos').find().toArray();
    /** Deno is confused on the returned collection, override with assertion */
    const transformedTodos = (todos as { _id: ObjectId; text: string }[]).map(
        (todo) => {
            return { id: todo._id.toString(), text: todo.text };
        }
    );
    ctx.response.body = { todos: transformedTodos };
});

router.post('/todos', async (ctx) => {
    /** NEW SYNTAX, Access and 'await' body.json() */
    const data = await ctx.request.body.json();
    const newTodo: Todo = {
        // id: new Date().toISOString(),
        text: data.text,
    };

    const id = await getDb().collection('todos').insertOne(newTodo);

    newTodo.id = id.$oid;

    ctx.response.body = { message: 'Created todo!', todo: newTodo };
});

router.put('/todos/:todoId', async (ctx) => {
    const tid = ctx.params.todoId;
    const data = await ctx.request.body.json();
    const todoIndex = todos.findIndex((todo) => {
        return todo.id === tid;
    });
    todos[todoIndex] = {
        id: todos[todoIndex].id,
        text: data.text,
    };
    ctx.response.body = { message: 'Updated todo!' };
});

router.delete('/todos/:todoId', (ctx) => {
    const tid = ctx.params.todoId;
    todos = todos.filter((todo) => todo.id !== tid);
    ctx.response.body = { message: 'Deleted todo!' };
});

export default router;
