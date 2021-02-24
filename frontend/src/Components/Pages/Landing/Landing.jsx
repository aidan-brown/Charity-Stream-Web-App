import React, { Component } from 'react';
import './Landing.css';
import PlayerList from './Players/PlayerList';
import StreamWindow from './StreamWindow/StreamWindow';
import Arrow from '../../../images/arrow.svg';

/** Class for constructing the landing/stream page **/
class Landing extends Component{
    /*
    * @constructor
    * @param {object} props - holds the props passed through to the component
    * @param {object} state - holds the curent state of the component
    */
    constructor(props){
        super(props);
        this.state = {};

        this.togglePlayerList = this.togglePlayerList.bind(this);
    }

    /*
    Handles the toggling of the player list, changing the class name of the list and arrow to the appropriate state
    */
    togglePlayerList(){
        let playerList = document.querySelector('#player-list');
        let arrow = document.querySelector('#arrow');
        if(playerList.className === 'show'){
            playerList.className = 'hide';
            arrow.className = 'btn show';
        }
        else{
            playerList.className = 'show';
            arrow.className = 'btn hide';
        }
    }

    /*
    Handles the rendering of the component
    * @return {JSX Element} the content for the landing page
    */
    render(){
        return(
            <div className='Landing'>
                <div className='stream-player'>
                    <StreamWindow title='Charity Stream' width='100%' height='100%' url='https://player.twitch.tv/?channel=justgiving' />
                    <button id='arrow' className='btn hide' onClick={this.togglePlayerList}><img className='show' src={Arrow}/></button>
                    <div id='player-list' className='show'>
                        <PlayerList/>
                    </div>
                </div>
                
                <div className='flavor-text bg-csh-secondary-gradient'>
                    <h2>About the Stream</h2>
                    <p>CSH's annual Minecraft Charity Stream is a large-scale competition between players in a series of minigames, with all donations and money earned during the stream going to charity.<br/> The competition comes with a twist: viewer donations can provide items, cause mob spawns, or apply potion effects to drastically change the course of the game!<br/> Check out the stream above or on our <a href="https://www.twitch.tv/cshba">Twitch</a> and if you'd like to donate, head to our store above to influence the tournament.</p>
                </div>
            </div>
        );
    }
}

export default Landing;