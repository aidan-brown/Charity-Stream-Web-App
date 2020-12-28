import React, { Component } from 'react';
import './StreamWindow.css';

/** Class for constructing the stream window component **/
class StreamWindow extends Component{
    /*
    * @construction
    * @param {object} props - holds the props passed through to the component
    **      @param {string} title - holds the title for the stream window
    **      @param {string} url - holds the url for the stream
    **      @param {number} width - holds the width of the stream window
    **      @param {number} height - holds the height of the stream window
    * @param {object} state - holds the curent state of the component
    **      @param {string} title - holds the title for the stream window
    **      @param {string} url - holds the url for the stream
    **      @param {number} width - holds the width of the stream window
    **      @param {number} height - holds the height of the stream window
    */
    constructor(props){
        super(props);
        this.state = {
            title : this.props.title,
            url : this.props.url,
            width : this.props.width,
            height : this.props.height,
        }
    }

    /*
    Handles the rendering of the component - Contains the routes to each of the content pages
    * @return {JSX Element} the stream window
    */
    render(){
        return(
            <div className='StreamWindow'>
                <iframe className="embed-responsive-item" title={this.state.title} width={this.state.width} height={this.state.height} src={this.state.url} frameBorder="0" allowFullScreen></iframe>
            </div>
        );
    }
}

export default StreamWindow;