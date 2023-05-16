'use client';

import React, { useState, useEffect } from 'react';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

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

  const handleEditTodo = (index) => {
    setEditingIndex(index);
    setEditingText(todos[index]);
  };

  const handleSaveEdit = () => {
    if (editingText.trim() !== '') {
      const updatedTodos = [...todos];
      updatedTodos[editingIndex] = editingText;
      setTodos(updatedTodos);
      setEditingIndex(-1);
      setEditingText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setEditingText('');
  };

  return (
    <html lang="pt-br">
      <body>
        <div className='flex justify-center w-full'>
          <div className='xl:container flex flex-col'>
            <h1 className='font-mono text-3xl mt-3 ml-3'> To-Do List</h1>
            <div className='flex flex-row'>
              <input
                type="text"
                value={newTodo}
                onChange={handleInputChange}
                placeholder="Digite um novo afazer"
                className='max-w-2xl mt-1.5 mx-1.5 mb-1.5 placeholder:italic placeholder:text-slate-400 text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-6 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm '
              />
              <button className='bg-sky-500 hover:bg-sky-700 px-1.5 py-1 rounded-md m-1.5' onClick={handleAddTodo}>Adicionar</button>
            </div>
            <ul role='list' className='marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-400 ml-3' >
              {todos.map((todo, index) => (
                <li className='text-lg text-white' key={index}>
                  {editingIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={editingText}
                        onChange={(event) => setEditingText(event.target.value)}
                        className='text-slate-400 block bg-white w-full border border-slate-300 rounded-md px-1 mb-1 mr-1 max-w-xl pl-3 pr-1.5'
                      />
                      <div className='flex justify-start'> 
                        <button className='bg-emerald-500 hover:bg-emerald-700 rounded-md ml-1 px-0.5 flex justify-start' onClick={handleSaveEdit}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mt-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                            Salvar</button>
                          <button className='bg-red-500 hover:bg-red-700 rounded-md ml-1 px-0.5 flex justify-start' onClick={handleCancelEdit}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mt-0.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                              Cancelar</button>
                        </div>
                    </>
                  ) : (
                    <>
                      <span>{todo}</span>
                        <div className='flex justify-start'> 
                          <button className='bg-stone-500 hover:bg-stone-700 rounded-md ml-1 px-0.5 flex justify-start' onClick={() => handleEditTodo(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mt-0.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            Editar</button>
                          <button className='bg-red-500 hover:bg-red-700 rounded-md ml-1 px-0.5 flex justify-start' onClick={() => handleRemoveTodo(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mt-0.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Remover</button>
                        </div>
                    </>
                  )}
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
