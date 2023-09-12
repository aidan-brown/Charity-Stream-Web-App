import React from 'react';
import PropTypes from 'prop-types';
import './Panel.scss';

const Panel = ({ heading, children }) => (
  <div className="panel">
    <h1>{heading}</h1>
    <div className="panel-container">
      {children}
    </div>
  </div>
);

Panel.propTypes = {
  heading: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Panel;
