import React from 'react'; // Import React — required for JSX, even if not directly used

// CSS Modules: styles will be scoped locally to avoid global naming conflicts
import styles from './Pagination.module.css';

// Pagination component accepts props to control page state and navigation
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Optimization: Don't render the component if there's only one page
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}> {/* Apply scoped CSS class */}
      <button 
        // Navigate to previous page by subtracting 1
        onClick={() => onPageChange(currentPage - 1)}
        // Disable the button when already on the first page
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {/* Display the current page status */}
      <span>Page {currentPage} of {totalPages}</span>

      <button 
        // Navigate to next page by adding 1
        onClick={() => onPageChange(currentPage + 1)}
        // Disable the button when on the last page
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination; // Export the component for use in other parts of the app
