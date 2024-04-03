import React, { useState, useEffect, useCallback } from 'react';

import './Todos.css';

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [editedTodo, setEditedTodo] = useState();
    const [enteredText, setEnteredText] = useState('');

    const getTodos = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8000/todos');
            const todosData = await response.json();
            setTodos(todosData.todos);
        } catch (err) {
            // Error handling would be implemented here
            console.log(err);
        }
    }, []);

    useEffect(() => {
        getTodos();
    }, [getTodos]);

    useEffect(() => {
        if (editedTodo) {
            setEnteredText(editedTodo.text);
        }
    }, [editedTodo]);

    const startEditHandler = (todo) => {
        setEditedTodo(todo);
    };

    const deleteTodoHandler = async (todoId) => {
        const response = await fetch('http://localhost:8000/todos/' + todoId, {
            method: 'DELETE',
        });
        const data = await response.json();

        console.log(data);
        getTodos();
    };

    const inputHandler = (event) => {
        setEnteredText(event.target.value);
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setEditedTodo(null);
        setEnteredText('');
        let url = 'http://localhost:8000/todos';
        let method = 'POST';
        if (editedTodo) {
            url = url + '/' + editedTodo.id;
            method = 'PUT';
        }
        const response = await fetch(url, {
            method,
            body: JSON.stringify({
                text: enteredText,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log(data);
        getTodos();
    };

    return (
        <React.Fragment>
            <div className="todos__form">
                <form onSubmit={submitHandler}>
                    <label>Todo Text</label>
                    <input type="text" value={enteredText} onChange={inputHandler} />
                    <button type="submit">{editedTodo ? 'Edit' : 'Add'} Todo</button>
                </form>
            </div>
            {todos && todos.length > 0 && (
                <ul className="todos__list">
                    {todos.map((todo) => (
                        <li key={todo.id}>
                            <span>{todo.text}</span>
                            <div className="todo__actions">
                                <button onClick={startEditHandler.bind(null, todo)}>Edit</button>
                                <button onClick={deleteTodoHandler.bind(null, todo.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </React.Fragment>
    );
};

export default Todos;
