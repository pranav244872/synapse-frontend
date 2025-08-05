import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import styles from './KanbanColumn.module.css';

const KanbanColumn = ({ status, tasks, onEditTask, onRecommend }) => {
  return (
    // Main column container for a specific task status
    <div className={styles.column}>
      {/* Column header with status name and task count */}
      <h3 className={styles.title}>{status.replace('_', ' ')} ({tasks.length})</h3>
      
      {/* Droppable area that accepts dragged task cards */}
      <Droppable droppableId={status}>
        {(provided) => (
          // Task list container with drop zone props applied
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={styles.taskList}
          >
            {/* Pass the props down to the TaskCard */}
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onEdit={onEditTask} onRecommend={onRecommend} />
            ))}
            
            {/* Placeholder element required by react-beautiful-dnd for proper spacing */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
