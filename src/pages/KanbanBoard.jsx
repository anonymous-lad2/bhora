// src/pages/KanbanBoard.jsx
import { useMemo, useState, useEffect } from "react";
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { arrayMove } from "@dnd-kit/sortable";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Column from "../component/tasks/Column";
import Card from "../component/tasks/Card";
import AddForm from "../component/tasks/AddForm";
import { getUser, logout } from "../redux/Authentication/Action"; // Auth Actions
import { createTask, deleteTask, updateTaskStatus } from "../redux/Task/Action"; // Task Actions (You'll integrate these later)

// Define initial state structure (will be replaced by Redux state from API)
const initialColumns = {
    start: { id: 'start', title: 'To Do', taskIds: [] },
    inProgress: { id: 'inProgress', title: 'In Progress', taskIds: [] },
    completed: { id: 'completed', title: 'Completed', taskIds: [] },
};
const initialTasks = {};

function KanbanBoard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, jwt } = useSelector(state => state.auth);
    // Use the global task state here instead of local state in a real app
    // const { tasks: globalTasks, columns: globalColumns } = useSelector(state => state.task); 

    // --- TEMPORARY LOCAL STATE (TO BE REPLACED BY REDUX TASK STATE) ---
    const [columns, setColumns] = useState(initialColumns);
    const [tasks, setTasks] = useState(initialTasks);
    // -----------------------------------------------------------------
    const [activeId, setActiveId] = useState(null);

    // --- AUTHENTICATION CHECK & USER FETCH ---
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (token && !user) {
            dispatch(getUser(token));
        } else if (!token) {
             // If no token, redirect to login
             navigate("/login"); 
        }
        
        // In a real app, you'd dispatch getAllTasks(token) here.
        // For now, we'll keep the board empty until integrated with API.

    }, [dispatch, user, navigate]);


    // Helper functions (same as your original logic)
    const columnIds = useMemo(() => Object.keys(columns), [columns]);
    const findColumn = (id) => {
        if (id in columns) return id;
        return Object.keys(columns).find(key => columns[key].taskIds.includes(id));
    };
    
    // --- CRUD FUNCTIONS (TO BE REPLACED WITH REDUX THUNKS) ---
    
    const handleAddTask = (content) => {
        // 1. **REDUX STEP:** Dispatch CREATE_TASK_REQUEST
        // dispatch(createTask({ content, status: 'start' }, jwt));
        
        // 2. Local State Fallback (Your original logic)
        const newTaskId = `task-${Date.now()}`;
        setTasks(prev => ({ ...prev, [newTaskId]: { id: newTaskId, content: content, status: 'start' } }));
        setColumns(prev => ({ ...prev, start: { ...prev.start, taskIds: [...prev.start.taskIds, newTaskId] } }));
    };

    const handleDeleteTask = (taskId) => {
        // 1. **REDUX STEP:** Dispatch DELETE_TASK_REQUEST
        // dispatch(deleteTask(taskId, jwt));
        
        // 2. Local State Fallback (Your original logic)
        const taskToDelete = tasks[taskId];
        if (!taskToDelete) return;
        const columnId = taskToDelete.status;
        setColumns(prev => ({ ...prev, [columnId]: { ...prev[columnId], taskIds: prev[columnId].taskIds.filter(id => id !== taskId) } }));
        setTasks(prev => { const newTasks = { ...prev }; delete newTasks[taskId]; return newTasks; });
    };

    const handleDragStart = (event) => { setActiveId(event.active.id); };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        const activeId = active.id;
        const overId = over?.id;

        if (!overId) { setActiveId(null); return; }

        const activeColumnId = findColumn(activeId);
        const overColumnId = findColumn(overId);

        if (!activeColumnId || !overColumnId) { setActiveId(null); return; }

        setColumns((prev) => {
            const sourceTaskIds = prev[activeColumnId].taskIds;
            let targetTaskIds = prev[overColumnId].taskIds;

            const activeIndex = sourceTaskIds.indexOf(activeId);
            let newIndex;

            // Determine if the drop target is a column or a card
            const isOverAColumn = overId in columns;
            if (isOverAColumn) {
                newIndex = targetTaskIds.length;
            } else {
                newIndex = targetTaskIds.indexOf(overId);
            }
            
            // 1. Task moves to a new column (STATUS CHANGE)
            if (activeColumnId !== overColumnId) {
                const newSourceTaskIds = sourceTaskIds.filter(id => id !== activeId);
                const newTargetTaskIds = [...targetTaskIds];
                newTargetTaskIds.splice(newIndex, 0, activeId);

                // **REDUX STEP:** Dispatch UPDATE_TASK_STATUS_REQUEST
                // dispatch(updateTaskStatus(activeId, overColumnId, jwt));

                // Local State Fallback: Update task status in the tasks object
                setTasks(prevTasks => ({...prevTasks, [activeId]: {...prevTasks[activeId], status: overColumnId}}));

                return {
                    ...prev,
                    [activeColumnId]: { ...prev[activeColumnId], taskIds: newSourceTaskIds },
                    [overColumnId]: { ...prev[overColumnId], taskIds: newTargetTaskIds }
                };
            } 
            // 2. Task stays in the same column (REORDER)
            else {
                const newIds = arrayMove(sourceTaskIds, activeIndex, newIndex);
                
                // **REDUX STEP:** Dispatch UPDATE_TASK_REQUEST (to save new order)
                // dispatch(updateTask(activeId, { newOrder: newIds }, jwt)); 

                return {
                    ...prev,
                    [activeColumnId]: { ...prev[activeColumnId], taskIds: newIds }
                };
            }
        });
        setActiveId(null);
    };

    const activeTask = activeId ? tasks[activeId] : null;
    
    // --- Render Login Message if not logged in ---
    if (!jwt) {
        return <div className="p-10 text-center text-xl">Please <a href="/login" className="text-blue-600 font-bold">Log In</a> to view your board.</div>;
    }
    
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="flex justify-between items-center max-w-7xl mx-auto mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900">Kanban Board</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Welcome, {user?.fullName || 'User'}!</span>
                    <button
                        onClick={() => dispatch(logout(navigate))}
                        className='bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition duration-200'
                    >
                        Logout
                    </button>
                </div>
            </header>
            
            <AddForm onAddTask={handleAddTask} />
            
            <DndContext 
                onDragStart={handleDragStart} 
                onDragEnd={handleDragEnd} 
                collisionDetection={closestCorners}
            >
                <div className="flex flex-wrap justify-center lg:flex-nowrap max-w-7xl mx-auto">
                    {columnIds.map((columnId) => {
                        const column = columns[columnId];
                        const columnTasks = column.taskIds.map(taskId => tasks[taskId]).filter(task => task);
                        return (
                            <Column 
                                key={columnId} 
                                id={columnId} 
                                title={column.title} 
                                tasks={columnTasks} 
                                allTaskIds={column.taskIds} 
                                onDeleteTask={handleDeleteTask} 
                            />
                        );
                    })}
                </div>

                <DragOverlay>
                    {activeTask ? <Card id={activeTask.id} content={activeTask.content} onDeleteTask={()=>{}} /> : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

export default KanbanBoard;