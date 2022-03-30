import React from 'react';
import PropTypes from 'prop-types';
import './StreamWindow.scss';

/** Class for constructing the stream window component * */
const StreamWindow = ({
  title, url, width, height,
}) => (
  <div className="StreamWindow" style={{ width, height }}>
    <iframe className="embed-responsive-item" src={url} title={title} width="100%" height="100%" frameBorder="0" allowFullScreen />
  </div>
);

StreamWindow.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
};

export default StreamWindow;
