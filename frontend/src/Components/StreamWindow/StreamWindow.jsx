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
            height : this.props.height,
            iframeWidth : 1,
            iframeHeight : 1,

            videoMask : null
        }
    }

    render(){
        return(
            <div className='StreamWindow'>
                <img src={ScreenHelper} width={this.state.width} height={this.state.height} />
                <iframe className="embed-responsive-item" title={this.state.title} width={this.state.iframeWidth} height={this.state.iframeHeight} src={this.state.url} allowFullScreen></iframe>
            </div>
        );
    }

    componentDidMount(){
        setTimeout(() =>
            this.setState({videoMask : document.querySelector('.StreamWindow img')}, () => {
                this.setState({
                    iframeWidth: this.state.videoMask.clientWidth,
                    iframeHeight: this.state.videoMask.clientHeight
                }, () => {
                    document.querySelector('.StreamWindow iframe').style.display = 'initial';
                })
                window.addEventListener('resize', () => {
                    this.setState({
                        iframeWidth: this.state.videoMask.clientWidth,
                        iframeHeight: this.state.videoMask.clientHeight
                    })
                })
            }), 100)
    }
}

export default StreamWindow;