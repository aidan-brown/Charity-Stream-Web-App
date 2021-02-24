import React, { useState } from 'react';
import './StreamWindow.css';

/** Class for constructing the stream window component **/
const StreamWindow = ({title, url, width, height}) => {
    return(
        <div className='StreamWindow'>
            <iframe className="embed-responsive-item" title={title} width={width} height={height} src={url} frameBorder="0" allowFullScreen></iframe>
        </div>
    );
}

export default StreamWindow;