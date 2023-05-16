'use client';

import React, { useState, useEffect } from 'react';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Carregar afazeres salvos ao iniciar o aplicativo
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Salvar afazeres sempre que houver uma mudança
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleInputChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, newTodo]);
      setNewTodo('');
    }
  };

  const handleRemoveTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  return (
    <html lang="pt-br">
      <body>
        <div className='flex justify-center w-full'>
          <div className='xl:container flex flex-col'>
            <h1 className='font-mono text-3xl'> To-Do List</h1>
            <div className='flex flex-row'>
              <input
                type="text"
                value={newTodo}
                onChange={handleInputChange}
                placeholder="Digite um novo afazer"
                className='max-w-2xl mt-1.5 mr-1.5 mb-1.5 placeholder:italic placeholder:text-slate-400 text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm '
              />
              <button className='bg-sky-500 hover:bg-sky-700 px-1.5 py-1 rounded-md m-1.5' onClick={handleAddTodo}>Adicionar</button>
            </div>
            <ul role='list' className='marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-400'>
              {todos.map((todo, index) => (
                <li key={index}>
                  {todo}
                  <button className='bg-red-500 hover:bg-red-700 rounded-md ml-1 px-0.5' onClick={() => handleRemoveTodo(index)}> Remover</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </body>
    </html>
  );
};

export default App;
