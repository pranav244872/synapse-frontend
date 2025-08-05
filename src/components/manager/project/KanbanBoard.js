import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import styles from './KanbanBoard.module.css';

const KanbanBoard = ({ tasks, onDragEnd, onEditTask, onRecommend }) => {
  // Group tasks by their status into separate arrays for each column
  const columns = {
    open: tasks.filter(t => t.status === 'open'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    done: tasks.filter(t => t.status === 'done'),
  };

  return (
    // DragDropContext provides drag and drop functionality for the entire board
    <DragDropContext onDragEnd={onDragEnd}>
      {/* Main board container that holds all the columns */}
      <div className={styles.board}>
        {/* Column for open/to-do tasks */}
        <KanbanColumn status="open" tasks={columns.open} onEditTask={onEditTask} onRecommend={onRecommend} />
        
        {/* Column for tasks currently in progress */}
        <KanbanColumn status="in_progress" tasks={columns.in_progress} onEditTask={onEditTask} onRecommend={onRecommend} />
        
        {/* Column for completed tasks */}
        <KanbanColumn status="done" tasks={columns.done} onEditTask={onEditTask} onRecommend={onRecommend} />
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
