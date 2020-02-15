import React, { Component } from 'react';
import './PlayerList.css';

import CSHLogo from '../../images/csh.svg'
import BlackbaudLogo from '../../images/blackbaud.svg';
import HOGSLogo from '../../images/hogs.svg';
import EHouseLogo from '../../images/ehouse.svg';
import SSELogo from '../../images/sse.svg';
import ArtHouseLogo from '../../images/arthouse.svg';

class PlayerList extends Component{
    constructor(props){
        super(props);
        this.state = {
            playerList: null,
            players: new Array()
        }

        this.renderPlayers = this.renderPlayers.bind(this);
    }

    renderPlayers(){
        if(this.state.playerList){
            this.state.playerList.innerHTML = '';
            this.state.players.forEach(player => {
                let listElement = document.createElement('div');
                listElement.className = `list-element ${player.team}`;

                let playerName = document.createElement('p');
                playerName.innerHTML = `${player.name} [${player.username}]`;

                let teamIcon = document.createElement('img');
                switch(player.team){
                    case 'csh':
                        teamIcon.src = CSHLogo;
                        teamIcon.alt = 'CSH Logo'
                        break;

                    case 'blackbaud':
                        teamIcon.src = BlackbaudLogo;
                        teamIcon.alt = 'Blackbaud Logo'
                        break;

                    case 'hogs':
                        teamIcon.src = HOGSLogo;
                        teamIcon.alt = 'HOGS Logo'
                        break;

                    case 'ehouse':
                        teamIcon.src = EHouseLogo;
                        teamIcon.alt = 'EHouse Logo'
                        break;

                    case 'sse':
                        teamIcon.src = SSELogo;
                        teamIcon.alt = 'SSE Logo'
                        break;

                    case 'arthouse':
                        teamIcon.src = ArtHouseLogo;
                        teamIcon.alt = 'ArtHouse Logo';
                }

                listElement.append(playerName);
                listElement.append(teamIcon);

                this.state.playerList.append(listElement)
            })
        }
    }

    render(){
        return(
            <div className='PlayerList'>
               
            </div>
        )
    }

    componentDidMount(){
        this.setState({playerList: document.querySelector('.PlayerList')}, () => {
            let req = new XMLHttpRequest();
            req.open('get', 'http://tunnel.csh.rit.edu:8000/players')

            req.onload = () => {
                console.log(req.responseText);
                this.setState({players: JSON.parse(req.responseText)}, () => this.renderPlayers());
            };

            req.send();

            // this.state.players.push({name:'First Last', username: 'Username', team: 'arthouse'});

            // this.renderPlayers();
        })
    }
}

export default PlayerList;