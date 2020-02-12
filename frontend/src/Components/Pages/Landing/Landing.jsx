import React, { Component } from 'react';
import './Landing.css';
import PlayerList from '../../Players/PlayerList';
import StreamWindow from '../../StreamWindow/StreamWindow';

class Landing extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        return(
            <div className='Landing'>
                <div className="jumbotron stream-player">
                    <StreamWindow title="Charity Stream" width="auto" height="100%" url="https://player.twitch.tv/?channel=justgiving" />
                    <PlayerList />
                </div>
                
                <div className="flavor-text">
                    
                </div>
            </div>
        );
    }
}

export default Landing;