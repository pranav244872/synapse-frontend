import React, { useState, useEffect, useMemo, useCallback } from 'react';
// React hooks are used to manage component state, memoize values, and handle side effects

import { getTeams, createTeam } from '../../../api/adminService';
// These functions likely perform HTTP requests to your backend API

import Table from '../../common/Table/Table';
import Pagination from '../../common/Pagination/Pagination';
import Modal from '../../common/Modal/Modal';

import styles from './TeamsTab.module.css'; // Scoped CSS via CSS modules

const PAGE_SIZE = 9; // Constant for how many teams to show per page

const TeamsTab = () => {
    const [teams, setTeams] = useState([]); // State to hold the list of teams
    const [loading, setLoading] = useState(true); // Boolean flag for loading state
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 }); // Track current and total pages
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [newTeamName, setNewTeamName] = useState(''); // Controlled input for team name

    // useCallback memoizes the fetchTeams function to avoid recreating it on every render
    const fetchTeams = useCallback((page) => {
        setLoading(true); // Start loading spinner or disable UI
        getTeams(false, page, PAGE_SIZE) // API call to fetch teams (false = not unmanaged)
            .then(res => {
                const { data, totalCount } = res.data; // Destructure API response
                setTeams(Array.isArray(data) ? data : []);

                // Calculate total pages from item count and page size
                setPagination(prev => ({ ...prev, totalPages: Math.ceil(totalCount / PAGE_SIZE) }));
            })
            .catch(err => console.error("Failed to fetch teams", err)) // Log errors
            .finally(() => setLoading(false)); // Stop loading regardless of success or error
    }, []);

    // useEffect runs fetchTeams when currentPage changes
    useEffect(() => {
        fetchTeams(pagination.currentPage);
    }, [pagination.currentPage, fetchTeams]);

    // Form submission handler for creating a new team
    const handleCreateTeam = (e) => {
        e.preventDefault(); // Prevent page reload

        if (!newTeamName.trim()) return; // Optional: ignore empty or whitespace-only names

        createTeam(newTeamName)
            .then(() => {
                setIsModalOpen(false);
                setNewTeamName('');

                setPagination(prev => ({ ...prev, currentPage: 1 }));
                fetchTeams(1);
            })
            .catch(err => {
                console.error("Failed to create team:", err);
            });
    };

    // Called when the user clicks "Previous" or "Next"
    const handlePageChange = (newPage) => {
        setPagination(prev => ({...prev, currentPage: newPage}));
    }


    // useMemo prevents recalculating the columns array on every render
    const columns = useMemo(() => [
        {
            Header: 'Team Name',
            accessor: 'teamName',
        },
        {
            Header: 'Manager',
            Cell: ({ row }) => row.name || 'Unassigned',
        },
    ], []);

    // While loading, display a fallback (but only if no data is present)
    if (loading && teams.length === 0) return <div>Loading...</div>;
    return (
        <div>
            <div className={styles.tabHeader}>
                {/* Open modal on click */}
                <button onClick={() => setIsModalOpen(true)} className={styles.actionButton}>Create Team</button>
            </div>

            {/* Custom reusable table component */}
            <Table columns={columns} data={teams} />

            {/* Pagination component shows current page and total pages */}
            <Pagination 
                currentPage={pagination.currentPage} 
                totalPages={pagination.totalPages} 
                onPageChange={handlePageChange} 
            />

            {/* Modal component with form to create a team */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Team">
                <form onSubmit={handleCreateTeam}>
                    <input 
                        type="text"
                        value={newTeamName} // Controlled input
                        onChange={(e) => setNewTeamName(e.target.value)} 
                        placeholder="Enter team name" 
                        className={styles.input} 
                        required // HTML5 validation
                    />
                    <button type="submit" className={styles.actionButton}>Submit</button>
                </form>
            </Modal>
        </div>
    );
};

export default TeamsTab; // Export so it can be used in the admin interface
