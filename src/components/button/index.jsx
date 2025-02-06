import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';

import styles from './button.styles';

const Button = ({
  children,
  variant = 'primary',
  ...rest
}) => {
  return (
    <button
      className={clsx(styles.variant[variant])}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary']),
};

export default Button; 