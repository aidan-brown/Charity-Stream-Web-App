import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './PlayerList.css';
import {BACKENDURL} from '../App/constants';

import CSHLogo from '../../images/csh.svg'
import BlackbaudLogo from '../../images/blackbaud.svg';
import HOGSLogo from '../../images/hogs.svg';
import EHouseLogo from '../../images/ehouse.svg';
import SSELogo from '../../images/sse.svg';
import ArtHouseLogo from '../../images/arthouse.svg';
import RITLogo from '../../images/rit.svg';
import CartLogo from '../../images/shopping-cart.svg';

/** Class for constructing the player list component **/
class PlayerList extends Component{
    /*
    * @constructor
    * @param {object} props - holds the props passed through to the component
    * @param {object} state - holds the curent state of the component
    **      @param {Element} playerList - holds the element where all the player elements will be appended
    **      @param {Array} players - holds all the player objects that needs to be rendered
    */
    constructor(props){
        super(props);
        this.state = {
            playerList: null,
            players: new Array()
        }

        this.renderPlayers = this.renderPlayers.bind(this);
    }

    /*
    Handles the construction and rendering of each player element in the list of players
    */
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

                this.state.playerList.append(listElement);
            })
        }
    }

    /*
    Handles the rendering of the component
    * @return {JSX Element} the list of players 
    */
    render(){
        return(
            <ul className='PlayerList'>
               
            </ul>
        )
    }

    /*
    Is run when the component successfully mounts and handles the requesting of player information and rendering the player list
    */
    componentDidMount(){
        // Sets the player list to the div rendered above
        this.setState({playerList: document.querySelector('.PlayerList')}, () => {
            // Hits the backend with a get request for the players and then renders the players when the request s complete
            let req = new XMLHttpRequest();
            req.open('get', `${BACKENDURL}/players`)
            req.setRequestHeader("Content-Type", "application/json");

            req.onload = () => {
                const response = JSON.parse(req.responseText);
                // If the response has data and a 200 code it uses that data to render the players, if not the response code is logged
                if(response.data && response.code == 200){
                    this.setState({players: response.data}, () => this.renderPlayers());
                }
                else{
                    console.error(response.code);
                }
            };

            req.send();
        })
    }
}

export default PlayerList;