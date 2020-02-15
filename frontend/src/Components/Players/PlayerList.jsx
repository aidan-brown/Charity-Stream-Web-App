import React, { Component } from 'react';
import './PlayerList.css';

import CSHLogo from '../../images/csh.svg'
import BlackbaudLogo from '../../images/blackbaud.svg';
import HOGSLogo from '../../images/hogs.svg';
import EHouseLogo from '../../images/ehouse.svg';
import SSELogo from '../../images/sse.svg';
import ArtHouseLogo from '../../images/arthouse.svg';
import RITLogo from '../../images/rit.svg';
import CartLogo from '../../images/shopping-cart.svg';

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
                listElement.className = `list-element ${player.team.toLowerCase()}`;

                let playerName = document.createElement('p');
                playerName.innerHTML = `${player.name} [${player.username}]`;

                let teamIcon = document.createElement('img');
                teamIcon.className = 'team-logo';

                console.log(player.team);
                switch(player.team.toLowerCase()){
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
                        break;

                    default:
                        teamIcon.src = RITLogo;
                        teamIcon.alt = 'RIT Logo';
                        break;
                }

                let shoppingLogo = document.createElement('img');
                shoppingLogo.src = CartLogo;
                shoppingLogo.alt = 'Shop Logo';
                shoppingLogo.className = 'shop-logo';

                listElement.append(playerName);
                listElement.append(teamIcon);
                listElement.append(shoppingLogo);

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
                const response = JSON.parse(req.responseText);
                if(response && response.code == 200){
                    this.setState({players: response.data}, () => this.renderPlayers());
                }
                else{
                    console.error(response.code);
                }
            };

            req.send();

            // this.state.players.push({name:'First Last', username: 'Username', team: 'csh'});

            // this.renderPlayers();
        })
    }
}

export default PlayerList;