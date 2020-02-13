import React, { Component } from 'react';
import './StreamWindow.css';

class StreamWindow extends Component{
    constructor(props){
        super(props);
        this.state = {
            title : this.props.title,
            url : this.props.url,
            width : this.props.width,
            height : this.props.height,
        }
    }

    render(){
        return(
            <div className='StreamWindow'>
                <iframe className="embed-responsive-item" title={this.state.title} width={this.state.width} height={this.state.height} src={this.state.url} frameBorder="0" allowFullScreen></iframe>
            </div>
        );
    }
}

export default StreamWindow;