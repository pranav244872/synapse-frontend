import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getAdminInvitations, getTeams, inviteManager, deleteInvitation } from '../../../api/adminService';

import Table from '../../common/Table/Table';
import Pagination from '../../common/Pagination/Pagination';
import Modal from '../../common/Modal/Modal';
import styles from './InvitationsTab.module.css';

const PAGE_SIZE = 5;

const InvitationsTab = () => {
    // === STATE MANAGEMENT ===

    // Stores fetched invitation data
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Controls pagination state
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

    // View mode: "all" or "me" (my invitations)
    const [viewMode, setViewMode] = useState('all');

    // Modal visibility flags
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

    // Form input state for inviting new manager
    const [unmanagedTeams, setUnmanagedTeams] = useState([]);
    const [email, setEmail] = useState('');
    const [teamId, setTeamId] = useState('');
    const [formError, setFormError] = useState('');

    // Stores the generated invitation link and copy-to-clipboard status
    const [generatedLink, setGeneratedLink] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    // === DATA FETCHING FUNCTIONS ===

    /**
     * Fetch invitations based on current page and view filter
     */
    const fetchInvitations = useCallback((page, filter) => {
        setLoading(true);
        getAdminInvitations(page, PAGE_SIZE, filter)
            .then(res => {
                const { data, totalCount } = res.data;
                setInvitations(Array.isArray(data) ? data : []);
                setPagination(prev => ({ ...prev, totalPages: Math.ceil(totalCount / PAGE_SIZE) }));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Fetch invitations when page number or view mode changes
    useEffect(() => {
        fetchInvitations(pagination.currentPage, viewMode);
    }, [pagination.currentPage, viewMode, fetchInvitations]);

    /**
     * Fetch list of unmanaged teams when opening the invitation form modal
     */
    useEffect(() => {
        if (isFormModalOpen) {
            getTeams(true).then(res => {
                const teams = Array.isArray(res.data) ? res.data : [];
                setUnmanagedTeams(teams);
            }).catch(err => {
                console.error('Failed to fetch unmanaged teams', err);
                setUnmanagedTeams([]);
            });
            setFormError('');
        }
    }, [isFormModalOpen]);

    // === EVENT HANDLERS ===

    /**
     * Switch between "all" and "me" view filters
     */
    const handleViewChange = (newView) => {
        setViewMode(newView);
        setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
    };

    /**
     * Submit form to invite a new manager
     */
    const handleInvite = (e) => {
        e.preventDefault();
        if (!teamId) {
            setFormError('You must select a team.');
            return;
        }

        inviteManager(email, parseInt(teamId))
            .then(res => {

                // Access the token using camelCase
                const token = res.data.invitationToken;

                if (!token) {
                    console.error('No invitation token in response:', res.data);
                    setFormError('No invitation token received from server.');
                    return;
                }

                const link = `${window.location.origin}/accept-invitation?token=${token}`;
                setGeneratedLink(link);

                // Close form modal, open link modal
                setIsFormModalOpen(false);
                setIsLinkModalOpen(true);
                setEmail('');
                setTeamId('');

                // Refresh invitations list
                fetchInvitations(1, viewMode);
            })
            .catch(err => {
                console.error('Invitation error:', err);
                const errorMsg = err.response?.data?.error || 'Failed to send invitation.';
                setFormError(errorMsg);
            });
    };

    /**
     * Copy generated invitation link to clipboard
     */
    const handleCopyLink = () => {
        navigator.clipboard.writeText(generatedLink).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    /**
     * Delete an invitation by ID with enhanced error handling
     */
    const handleDelete = useCallback((id, status) => {
        // Show different confirmation messages based on status
        let confirmMessage = 'Are you sure you want to delete this invitation?';
        if (status === 'accepted') {
            confirmMessage = 'This invitation has already been accepted. Are you sure you want to delete it?';
        } else if (status === 'expired') {
            confirmMessage = 'This invitation has expired. Delete it to clean up the list?';
        }

        if (window.confirm(confirmMessage)) {
            deleteInvitation(id)
                .then(() => {
                    console.log('Successfully deleted invitation');
                    fetchInvitations(pagination.currentPage, viewMode);
                })
                .catch(err => {
                    console.error('Delete invitation error:', err);
                    
                    // Handle specific error cases from backend
                    if (err.response?.status === 400) {
                        alert('Cannot delete this invitation: ' + (err.response?.data?.error || 'Only pending invitations can be deleted'));
                    } else if (err.response?.status === 404) {
                        alert('Invitation not found. It may have already been deleted.');
                        // Refresh the list since the invitation might not exist anymore
                        fetchInvitations(pagination.currentPage, viewMode);
                    } else {
                        alert('Failed to delete invitation: ' + (err.response?.data?.error || 'Unknown error'));
                    }
                });
        }
    }, [pagination.currentPage, viewMode, fetchInvitations]);

    // === HELPER FUNCTIONS ===

    /**
     * Format status text for better display
     */
    const formatStatus = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    /**
     * Get CSS class for status styling
     */
    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return styles.statusPending;
            case 'accepted':
                return styles.statusAccepted;
            case 'expired':
                return styles.statusExpired;
            case 'rejected':
                return styles.statusRejected;
            default:
                return styles.statusDefault;
        }
    };

    // === TABLE COLUMN CONFIGURATION ===

    const columns = useMemo(() => [
        { 
            Header: 'Email Invited', 
            Cell: ({ row }) => row.email 
        },
        { 
            Header: 'Role', 
            Cell: ({ row }) => formatStatus(row.roleToInvite) 
        },
        { 
            Header: 'Status', 
            Cell: ({ row }) => (
                <span className={`${styles.status} ${getStatusClass(row.status)}`}>
                    {formatStatus(row.status)}
                </span>
            )
        },
        { 
            Header: 'Inviter', 
            accessor: 'inviterName' 
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => {
                const status = row.status?.toLowerCase();
                
                if (status === 'pending') {
                    return (
                        <button 
                            onClick={() => handleDelete(row.id, status)} 
                            className={styles.deleteButton}
                            title="Delete pending invitation"
                        >
                            Delete
                        </button>
                    );
                } else if (status === 'accepted') {
                    return (
                        <div className={styles.actionContainer}>
                            <span className={styles.statusText}>Completed</span>
                            <button 
                                onClick={() => handleDelete(row.id, status)} 
                                className={styles.deleteButtonSecondary}
                                title="Delete completed invitation (for cleanup)"
                            >
                                Remove
                            </button>
                        </div>
                    );
                } else if (status === 'expired') {
                    return (
                        <div className={styles.actionContainer}>
                            <span className={styles.statusText}>Expired</span>
                            <button 
                                onClick={() => handleDelete(row.id, status)} 
                                className={styles.deleteButtonSecondary}
                                title="Delete expired invitation"
                            >
                                Clean Up
                            </button>
                        </div>
                    );
                } else {
                    return (
                        <span className={styles.statusText}>
                            {formatStatus(status)}
                        </span>
                    );
                }
            }
        },
    ], [handleDelete]);

    // === CONDITIONAL RENDERING ===
    if (loading && invitations.length === 0) return <div>Loading...</div>;

    // === COMPONENT RENDER ===
    return (
        <div>
            {/* === Top Controls: View Filter & Invite Button === */}
            <div className={styles.tabHeader}>
                <div className={styles.viewSwitcher}>
                    <button onClick={() => handleViewChange('all')} className={viewMode === 'all' ? styles.active : ''}>
                        All
                    </button>
                    <button onClick={() => handleViewChange('me')} className={viewMode === 'me' ? styles.active : ''}>
                        My Invitations
                    </button>
                </div>
                <button onClick={() => setIsFormModalOpen(true)} className={styles.actionButton}>
                    Invite Manager
                </button>
            </div>

            {/* === Table Displaying Invitations === */}
            <Table columns={columns} data={invitations} />

            {/* === Pagination Controls === */}
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(p) => setPagination(prev => ({ ...prev, currentPage: p }))}
            />

            {/* === Modal: Invite New Manager Form === */}
            <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title="Invite a New Manager">
                <form onSubmit={handleInvite}>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Manager's Email"
                        className={styles.input}
                        required
                    />
                    <select
                        value={teamId}
                        onChange={e => setTeamId(e.target.value)}
                        className={styles.input}
                        required
                    >
                        <option value="">Select an Unmanaged Team</option>
                        {unmanagedTeams.map(team => (
                            <option key={team.id} value={team.id}>
                                {team.teamName}
                            </option>
                        ))}
                    </select>
                    {formError && <p className={styles.formError}>{formError}</p>}
                    <button type="submit" className={styles.actionButton}>Send Invitation</button>
                </form>
            </Modal>

            {/* === Modal: Display Generated Invitation Link === */}
            <Modal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} title="Invitation Link Generated">
                <div className={styles.linkContainer}>
                    <p>Send this link to the new manager to complete their registration:</p>
                    <div className={styles.linkInputWrapper}>
                        <input type="text" value={generatedLink} readOnly className={styles.linkInput} />
                        <button onClick={handleCopyLink} className={styles.copyButton}>
                            {copySuccess || 'Copy'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default InvitationsTab;
