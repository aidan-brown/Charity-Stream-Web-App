import React, { Component } from 'react';
import PlayerList from '../Players/PlayerList.jsx';

class Content extends Component{
    render(){
        return(
            <div className="Content">
                <div className="Twitch-Embed">

                </div>
                <PlayerList />
                <div className="flavor-text">
                    
                </div>
            </div>
        )
    }
}

export default Content;