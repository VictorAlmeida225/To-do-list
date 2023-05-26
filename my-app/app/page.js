'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Navbar } from "flowbite-react";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingText, setEditingText] = useState('');
  const [updated, setUpdated] = useState('');

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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedTodos = [...todos];
    const [removed] = updatedTodos.splice(result.source.index, 1);
    updatedTodos.splice(result.destination.index, 0, removed);

    setTodos(updatedTodos);
  };

  const handleExportTodos = () => {
    const data = JSON.stringify(todos);
    const file = new Blob([data], { type: 'application/json' });
    const downloadLink = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = downloadLink;
    a.download = 'todos.json';
    a.click();
  };

  const handleImportTodos = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const importedTodos = JSON.parse(content);
        setTodos((prevTodos) => [...prevTodos, ...importedTodos]);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setUpdated(handleAddTodo);
    }
  };

  return (
    <html lang="pt-br">
      <body>
        <div className='flex justify-center w-full'>
          <div className='w-full flex flex-col'>
            <div className='Navbar flex sm:flex-col xl:flex-row bg-sky-800'>
              <a href="#" className='flex flex-row items-center sm:w-full xl:w-fit'>
                <img src="./favicon.ico" alt="To-do List Logo"  className='h-10 w-10 m-3'/>
                <span className='my-auto font-light text-2xl'>To-Do List</span>
              </a>
              <div className='flex h-full xl:w-5/6 sm:w-fit' >
                <div className='flex flex-row m-auto'>
                  <div onClick={handleImportTodos} className='cursor-pointer flex flex-row m-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M120-330v-60h300v60H120Zm0-165v-60h470v60H120Zm0-165v-60h470v60H120Zm530 500v-170H480v-60h170v-170h60v170h170v60H710v170h-60Z" fill='white' /></svg>
                    <span>Importar</span>
                  </div>
                  <div onClick={handleExportTodos} className='mr-5 cursor-pointer flex flex-row m-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M220-40q-24 0-42-18t-18-42v-509q0-24 18-42t42-18h169v60H220v509h520v-509H569v-60h171q24 0 42 18t18 42v509q0 24-18 42t-42 18H220Zm229-307v-457l-88 88-43-43 161-161 161 161-43 43-88-88v457h-60Z" fill='white' /></svg>
                    <span>Exportar</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex justify-center w-full'>
              <div className='lg:container flex flex-col'>
              <div className='flex flex-row'>
                <input
                  type="text"
                  value={newTodo}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite um novo afazer"
                  className='max-w-2xl mt-3 mb-1.5 ml-1.5 placeholder:italic placeholder:text-slate-400 text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-6 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm '
                />
                <button className='bg-sky-500 hover:bg-sky-700 px-1.5 py-1 rounded-md m-1.5 mt-3' onClick={handleAddTodo}>Adicionar</button>
              </div>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="todos">
                  {(provided) => (
                    <ul className='marker:none' {...provided.droppableProps} ref={provided.innerRef}>
                      {todos.map((todo, index) => (
                        <Draggable key={index} draggableId={`todo-${index}`} index={index}>
                          {(provided) => (
                            <li
                              className='mt-1'
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{ backgroundColor: todo.color }}
                            >
                              {editingIndex === index ? (
                                <>
                                  <input
                                    type="text"
                                    value={editingText}
                                    onChange={(event) => setEditingText(event.target.value)}
                                    className='text-slate-400 block bg-white w-full border border-slate-300 rounded-md px-1 mb-1 mx-1 max-w-xl pl-3 pr-1.5'
                                  />
                                  <div className='flex justify-start'>
                                    <button className='bg-cyan-500 hover:bg-cyan-700 rounded-md ml-1 px-0.5 flex justify-start' onClick={handleSaveEdit}>
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
                                    <span className='text-lg text-white ml-1' >{todo}</span>
                                    <div className='flex justify-start'>
                                      <button className='bg-gray-500 hover:bg-gray-700 rounded-md ml-1 px-0.5 flex justify-start' onClick={() => handleEditTodo(index)}>
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
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default App;
