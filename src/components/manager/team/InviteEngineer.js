import React, { useState } from 'react';
import { inviteEngineer } from '../../../api/managerService';
import Modal from '../../common/Modal/Modal';
import styles from './InviteEngineer.module.css';

const InviteEngineer = ({ onSuccess }) => {
  // State to control the visibility of the invitation form modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  
  // State to control the visibility of the generated link modal
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  
  // State to store the generated invitation link
  const [generatedLink, setGeneratedLink] = useState('');
  
  // State to show copy success feedback message
  const [copySuccess, setCopySuccess] = useState('');
  
  // State to store the email input value
  const [email, setEmail] = useState('');
  
  // State to store and display form validation errors
  const [formError, setFormError] = useState('');

  // Handles form submission to send invitation and generate link
  const handleInvite = (e) => {
    e.preventDefault();
    setFormError('');

    inviteEngineer(email).then((res) => {
      const token = res.data.invitationToken;
      const link = `${window.location.origin}/accept-invitation?token=${token}`;
      setGeneratedLink(link);

      setIsFormModalOpen(false);
      setIsLinkModalOpen(true);
      
      setEmail('');
      onSuccess(); // Notify parent to refresh invitation list
    }).catch(err => {
      setFormError(err.response?.data?.error || 'Failed to send invitation.');
    });
  };

  // Copies the generated invitation link to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <>
      {/* Main container with title and invite button */}
      <div className={styles.container}>
        <h3 className={styles.title}>Recruit New Members</h3>
        <p>Invite a new engineer to join your team.</p>
        <button onClick={() => setIsFormModalOpen(true)} className={styles.inviteButton}>
          Invite Engineer
        </button>
      </div>

      {/* Modal for email input form */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title="Invite a New Engineer">
        <form onSubmit={handleInvite}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Engineer's Email" className={styles.input} required />
          {formError && <p className={styles.formError}>{formError}</p>}
          <button type="submit" className={styles.inviteButton}>Send Invitation</button>
        </form>
      </Modal>

      {/* Modal to display and copy the generated invitation link */}
      <Modal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} title="Invitation Link Generated">
        <div className={styles.linkContainer}>
          <p>Send this link to the new engineer to complete their registration:</p>
          <div className={styles.linkInputWrapper}>
            <input type="text" value={generatedLink} readOnly className={styles.linkInput} />
            <button onClick={handleCopyLink} className={styles.copyButton}>
              {copySuccess || 'Copy'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default InviteEngineer;
