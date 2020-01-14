import React, { Component } from 'react';
import PlayerList from '../../Players/PlayerList';

class Landing extends Component{
    render(){
        return(
            <div className='Landing'>
                <h1>Landing</h1>

                <div className="Twitch-Embed">

                </div>
                <PlayerList />
                <div className="flavor-text">
                    
                </div>
            </div>
        );
    }
}

export default Landing;