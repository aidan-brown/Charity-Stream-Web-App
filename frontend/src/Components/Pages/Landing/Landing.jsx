import React, {useEffect, useRef} from 'react';
import './Landing.css';
import PlayerList from './Players/PlayerList';
import StreamWindow from './StreamWindow/StreamWindow';
import Arrow from '../../../images/arrow.svg';

/** Class for constructing the landing/stream page **/
const Landing = ({setSelectedPlayer}) => {
    const streamDiv = useRef();

    useEffect(() => {
        streamDiv.current.style.height = `${window.screen.height * 0.8}px`;
    }, [])

    /*
    Handles the toggling of the player list, changing the class name of the list and arrow to the appropriate state
    */
    const togglePlayerList = () => {
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

    return(
        <div className='Landing'>
            <div className='stream-player' ref={streamDiv}>
                <StreamWindow title='Charity Stream' width='100%' height='100%' url={`https://player.twitch.tv/?channel=cshba&muted=true&parent=${window.location.hostname}`} />
                <button id='arrow' className='btn hide' onClick={togglePlayerList}><img className='show' src={Arrow} alt="toggle playerlist"/></button>
                <div id='player-list' className='show'>
                    <PlayerList setSelectedPlayer={setSelectedPlayer}/>
                </div>
            </div>
            
            <div className='flavor-text bg-csh-secondary-gradient'>
                <h2>About the Stream</h2>
                <p>CSH's annual Minecraft Charity Stream is a large-scale competition between players in a series of minigames, with all donations and money earned during the stream going to charity.<br/> The competition comes with a twist: viewer donations can provide items, cause mob spawns, or apply potion effects to drastically change the course of the game!<br/> Check out the stream above or on our <a href="https://www.twitch.tv/cshba">Twitch</a> and if you'd like to donate, head to our store above to influence the tournament.</p>
            </div>
        </div>
    );
}

export default Landing;
