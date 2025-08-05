import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import styles from './TaskCard.module.css';

const TaskCard = ({ task, index, onEdit, onRecommend }) => {
  return (
    // Draggable wrapper that enables drag and drop functionality for the task card
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        // Main card container with drag and drop props applied
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={styles.card}
        >
          {/* Card header containing task title and edit button */}
          <div className={styles.cardHeader}>
            {/* Task title display */}
            <div className={styles.title}>{task.title}</div>
            
            {/* Edit button to modify task details */}
            <button onClick={() => onEdit(task)} className={styles.editButton}>Edit</button>
          </div>
          
          {/* Footer section containing priority and assignee information */}
          <div className={styles.footer}>
            {/* Priority badge with dynamic styling based on priority level */}
            <span className={`${styles.priority} ${styles[task.priority]}`}>
              {task.priority}
            </span>
            
            {/* Assignee name or 'Unassigned' if no assignee */}
            <span className={styles.assignee}>{task.assigneeName || 'Unassigned'}</span>
          </div>
          
          {/* Recommendations button only shown for open/unassigned tasks */}
          {task.status === 'open' && (
            <button onClick={() => onRecommend(task)} className={styles.recommendButton}>
              Get Recommendations
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
