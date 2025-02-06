import React from 'react';

const Input = (props) => {
  return (
    <input
      className='bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-secondary focus:border-secondary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary dark:focus:border-secondary outline-none'
      {...props}
    />
  );
}

// Add prop validation if needed
Input.propTypes = {
  // Example prop validations:
  // type: PropTypes.string,
  // value: PropTypes.string,
  // onChange: PropTypes.func,
};

export default Input; 