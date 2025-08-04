import React from 'react';
import styles from './Table.module.css'; // CSS module for scoped styling

/**
 * A reusable and flexible Table component.
 * 
 * Props:
 * - columns: Array of column definitions, each with:
 *    - accessor: key in the data row to display (optional if Cell is provided)
 *    - Header: string (column label)
 *    - Cell (optional): custom render function for the cell
 * 
 * - data: Array of row objects (each row is a plain object)
 */
const Table = ({ columns, data }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {/* 
              Render each column header 
              - Use accessor as key if available, otherwise use column index
              - This prevents key conflicts when columns don't have accessors (like Actions column)
            */}
            {columns.map((col, colIndex) => (
              <th key={col.accessor || `col-${colIndex}`}>{col.Header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 
            Defensive fix: If `data` is null or undefined, map over an empty array
            to prevent runtime errors when calling .map on null or undefined.
            This ensures the component doesn't crash when data is still loading.
          */}
          {(data || []).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {/* 
                Render each cell in the row
                - Use the same key strategy as headers for proper alignment
                - If Cell function exists, use it for custom rendering
                - Otherwise, access the value directly using the accessor
              */}
              {columns.map((col, colIndex) => (
                <td key={col.accessor || `col-${colIndex}`}>
                  {/* 
                    Conditional rendering logic:
                    - If a custom Cell render function is provided, use it with row data
                    - Otherwise, access the value directly from the row using the accessor key
                    - This allows for both simple data display and complex custom components
                  */}
                  {col.Cell ? col.Cell({ row }) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
