import React, { Component } from 'react';
import './Landing.css';
import PlayerList from '../../Players/PlayerList';
import StreamWindow from '../../StreamWindow/StreamWindow';
import Arrow from '../../../images/arrow.svg';

class Landing extends Component{
    constructor(props){
        super(props);
        this.state = {};

        this.togglePlayerList = this.togglePlayerList.bind(this);
    }

    togglePlayerList(){
        let playerList = document.querySelector('#player-list');
        let arrow = document.querySelector('#arrow');
        if(playerList.className == 'show'){
            playerList.className = 'hide';
            arrow.className = 'hide';
        }
        else{
            playerList.className = 'show';
            arrow.className = 'show';
        }
    }

    render(){
        return(
            <div className='Landing'>
                <div className='stream-player'>
                    <StreamWindow title='Charity Stream' width='100%' height='100%' url='https://player.twitch.tv/?channel=justgiving' />
                    <button role='button' className='btn bg-csh-secondary' onClick={this.togglePlayerList}><img id='arrow' className='show' src={Arrow}/></button>
                    <div id='player-list' className='show'>
                        <PlayerList/>
                    </div>
                </div>
                
                <div className='flavor-text'>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum quos incidunt, aspernatur error quisquam nesciunt quo rerum commodi porro adipisci obcaecati dolores at excepturi, dolore veniam eos, impedit dolorum nemo libero amet quis rem illo esse distinctio! Illum expedita officia corporis vitae odit maiores eos iure ut facilis impedit. Sunt, ex ullam tempore tenetur fugit corporis expedita velit dicta nisi consequuntur itaque repellendus aspernatur architecto explicabo cum? Qui esse, quaerat nobis tempora aperiam sunt beatae? Dolore, doloribus libero corporis, autem natus quae porro sequi deserunt ut culpa, tempore accusantium fuga et quisquam pariatur. Ducimus reprehenderit saepe non quasi obcaecati ullam.</p>
                </div>
            </div>
        );
    }
}

export default Landing;