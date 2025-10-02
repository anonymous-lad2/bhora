import { useMemo, useState } from "react";
import {DndContext, DragOverlay} from '@dnd-kit/core';
import Column from "./component/Column";
import Card from "./component/Card";
import AddForm from "./component/AddForm";

  const initialColumns = {
    start: {id: 'start', title: 'To Do', taskIds: ['task-1', 'task-2', 'task-5', 'task-9', 'task-10']},
    inProgress: {id: 'inProgress', title: 'In Progress', taskIds: ['task-3', 'task-6', 'task-11']},
    completed: {id: 'completed', title: 'Completed', taskIds: ['task-4', 'task-7', 'task-8', 'task-12']},
  }

  const initialTasks = {
    'task-1': {id: 'task-1', content: 'Take out the garbage', status: 'start'},
    'task-2': {id: 'task-2', content: 'Watch my favorite show', status: 'start'},
    'task-3': {id: 'task-3', content: 'Charge my phone', status: 'inProgress'},
    'task-4': {id: 'task-4', content: 'Cook dinner', status: 'completed'},
    'task-5': {id: 'task-5', content: 'Take out the garbage', status: 'start'},
    'task-6': {id: 'task-6', content: 'Watch my favorite show', status: 'start'},
    'task-7': {id: 'task-7', content: 'Charge my phone', status: 'inProgress'},
    'task-8': {id: 'task-8', content: 'Cook dinner', status: 'completed'},
    'task-9': {id: 'task-9', content: 'Take out the garbage', status: 'start'},
    'task-10': {id: 'task-10', content: 'Watch my favorite show', status: 'start'},
    'task-11': {id: 'task-11', content: 'Charge my phone', status: 'inProgress'},
    'task-12': {id: 'task-12', content: 'Cook dinner', status: 'completed'},
  }

  function App() {

    const [columns, setColumns] = useState(initialColumns)
    const [tasks, setTasks] = useState(initialTasks)
    const [activeId, setActiveId] = useState(null)

    console.log(tasks)

    const columnIds = useMemo(() => Object.keys(columns), [columns]);
    // console.log(columnIds)

    const findColumn = (id) => {
      if(id in columns) {
        return id;
      }
      return Object.keys(columns).find(key => columns[key].taskIds.includes(id));
    }

    const handleAddTask = (content) => {
      const newTaskId = `task-${Date.now()}`;
      setTasks(prev => ({
        ...prev,
        [newTaskId]: {id: newTaskId, content: content, status: 'start'}
      }))

      setColumns(prev => ({
        ...prev,
        start: {
          ...prev.start,
          taskIds: [...prev.start.taskIds, newTaskId]
        }
      }))
    }

    const handleDeleteTask = (taskId) => {
      const taskToDelete = tasks[taskId];
      if(!taskToDelete) return;

      const columnId = taskToDelete.status;

      setColumns(prev => ({
        ...prev,
        [columnId]: {
          ...prev[columnId],
          taskIds: prev[columnId].taskIds.filter(id => id !== taskId)
        }
      }))
      
      setTasks(prev => {
        const newTasks = {...prev};
        delete newTasks[taskId];
        return newTasks;
      })
      console.log("done")
    }

    const handleDragStart = (event) => {
      setActiveId(event.active.id);
    }

    const handleDragEnd = (event) => {
      const {active, over} = event;
      const activeId = active.id;
      const overId = over?.id;

      if(!overId) {
        setActiveId(null);
        return;
      }

      const activeColumn = findColumn(activeId);
      const overColumn = findColumn(overId);

      if(!activeColumn || !overColumn) {
        setActiveId(null);
        return;
      }

      if(activeColumn === overColumn) {
        setActiveId(null);
        return;
      }

      const getNewIndex = () => {
        const isOverAColumn = overId in columns;
        if(isOverAColumn) {
          return columns[overId].taskIds.length;
        }
        const taskIds = columns[overColumn].taskIds;
        const overIndex = taskIds.indexOf(overId);
        return overIndex >= 0 ? overIndex : taskIds.length;
      }

      setColumns((prev) => {
        const newSourceTaskIds = prev[activeColumn].taskIds.filter(id => id !== activeId);
        const newTargetTaskIds = [...prev[overColumn].taskIds];
        newTargetTaskIds.splice(getNewIndex(), 0, activeId);

        if(activeColumn !== overColumn) {
          setTasks(prevTasks => ({...prevTasks,
            [activeId]: {...prevTasks[activeId], status: overColumn}
          }))
        }

        return {
          ...prev,
          [activeColumn]: {
            ...prev[activeColumn],
            taskIds: newSourceTaskIds
          },
          [overColumn]: {
            ...prev[overColumn],
            taskIds: newTargetTaskIds
          }
        }
      })
      setActiveId(null);
    }

    const activeTask = activeId ? tasks[activeId] : null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">To Do List</h1>
      
      <AddForm onAddTask = {handleAddTask} />
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-wrap justify-center lg:flex-nowrap">
        {columnIds.map((columnId) => {
          const column = columns[columnId];
          const columnTasks = column.taskIds ? column.taskIds.map(taskId => tasks[taskId]).filter(task => task) : [];
          return (
            <Column key={columnId} id={columnId} title={column.title} tasks={columnTasks} allTaskIds={column.taskIds} onDeleteTask={handleDeleteTask} />
          )
        })}
      </div>

      <DragOverlay>
        {activeTask ? <Card id={activeTask.id} content={activeTask.content} /> : null}
      </DragOverlay>
    </DndContext>
    </div>
  );
}

export default App;