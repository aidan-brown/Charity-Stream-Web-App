import React from 'react';
import './StreamWindow.css';

/** Class for constructing the stream window component **/
const StreamWindow = ({title, url, width, height}) => {
    return(
        <div className='StreamWindow'>
            <iframe className="embed-responsive-item" src={url} title={title} width={width} height={height} frameBorder="0" allowFullScreen={true}></iframe>
        </div>
    );
}

export default StreamWindow;