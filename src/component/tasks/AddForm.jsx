import React, { useState } from 'react'

const AddForm = ({ onAddTask }) => {

    const [newTask, setNewTask] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if(newTask.trim() === '') return;

        onAddTask(newTask.trim());
        setNewTask('');
    }
    
  return (
    <div className='p-4 bg-white rounded-lg shadow-md mb-8 max-w-4xl mx-auto'>
        <h2 className='text-2xl font-semibold mb-4'>Add New Task</h2>
        <form onSubmit={handleSubmit} className='flex space-x-3'>
            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task title"
                className='flex-1 border border-gray-300 rounded-lg p-2'
            />
            <button
                type="submit"
                className='bg-blue-500 text-white rounded-lg px-4 py-2'
            >
                Add Task
            </button>
        </form>
    </div>
  )
}

export default AddForm