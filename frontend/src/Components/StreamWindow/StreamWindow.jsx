import React, { Component } from 'react';
import './StreamWindow.css';
import ScreenHelper from '../../images/video-mask.png';

class StreamWindow extends Component{
    constructor(props){
        super(props);
        this.state = {
            title : this.props.title,
            url : this.props.url,
            width : this.props.width,
            height : this.props.height
        }
    }

    render(){
        return(
            <div className='StreamWindow'>
                <img src={ScreenHelper} height="100%" />
                <iframe className="embed-responsive-item" title={this.state.title} width={this.state.width} height={this.state.height} src={this.state.url} allowFullScreen></iframe>
            </div>
        );
    }
}

export default StreamWindow;