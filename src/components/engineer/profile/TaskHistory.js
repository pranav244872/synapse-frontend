import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getTaskHistory } from '../../../api/engineerService';
import Table from '../../common/Table/Table';
import Pagination from '../../common/Pagination/Pagination';

// Number of tasks to display per page
const PAGE_SIZE = 10;

// Component to display paginated history of engineer's completed tasks
const TaskHistory = () => {
    // State to store the list of completed tasks for current page
    const [tasks, setTasks] = useState([]);
    
    // State to manage current page and total pages for pagination
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

    // Memoized function to fetch task history data from API
    const fetchHistory = useCallback((page) => {
        // Call API with page number and page size for paginated results
        getTaskHistory(page, PAGE_SIZE).then(res => {
            const { data, totalCount } = res.data;
            // Ensure data is always an array to prevent rendering errors
            setTasks(Array.isArray(data) ? data : []);
            // Calculate total pages based on total count and page size
            setPagination(prev => ({ ...prev, totalPages: Math.ceil(totalCount / PAGE_SIZE)}));
        });
    }, []);

    // Effect to fetch data when current page changes
    useEffect(() => {
        fetchHistory(pagination.currentPage);
    }, [pagination.currentPage, fetchHistory]);

    // Memoized column configuration for the task history table
    const columns = useMemo(() => [
        // Task name column
        { Header: 'Task Title', accessor: 'title'},
        
        // Project name column
        { Header: 'Project', accessor: 'projectName'},
        
        // Completion date column with custom formatting
        { Header: 'Completed On', Cell: ({row}) => new Date(row.completedAt).toLocaleString()},
    ], []);

    // Render task history table with pagination controls
    return (
        <div>
            {/* Section title */}
            <h2>Completed Task History</h2>
            
            {/* Table component displaying completed tasks */}
            <Table columns={columns} data={tasks} />
            
            {/* Pagination controls for navigating through task history */}
            <Pagination 
                currentPage={pagination.currentPage} 
                totalPages={pagination.totalPages} 
                onPageChange={p => setPagination(prev => ({...prev, currentPage: p}))} 
            />
        </div>
    );
};

export default TaskHistory;
