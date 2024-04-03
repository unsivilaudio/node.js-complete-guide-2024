import { Router } from 'https://deno.land/x/oak/mod.ts';

const router = new Router();

interface Todo {
    id: string;
    text: string;
}

let todos: Todo[] = [];

router.get('/todos', (ctx) => {
    ctx.response.body = { todos: todos };
});

router.post('/todos', async (ctx) => {
    /** NEW SYNTAX, Access and 'await' body.json() */
    const data = await ctx.request.body.json();
    const newTodo: Todo = {
        id: new Date().toISOString(),
        text: data.text,
    };
    todos.push(newTodo);

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
