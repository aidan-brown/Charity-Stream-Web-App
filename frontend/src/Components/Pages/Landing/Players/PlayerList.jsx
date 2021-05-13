import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PlayerList.css';
import {BACKENDURL} from '../../../App/constants';

import cshLogo from '../../../../images/csh.svg'
import blackbaudLogo from '../../../../images/blackbaud.svg';
import hogsLogo from '../../../../images/hogs.svg';
import ehouseLogo from '../../../../images/ehouse.svg';
import sseLogo from '../../../../images/sse.svg';
import arthouseLogo from '../../../../images/arthouse.svg';
import ritLogo from '../../../../images/rit.svg';
import CartLogo from '../../../../images/shopping-cart.svg';

const logos = {
    cshLogo,
    blackbaudLogo,
    hogsLogo,
    ehouseLogo,
    sseLogo,
    arthouseLogo,
    ritLogo
}

/** Class for constructing the player list component **/
const PlayerList = ({setSelectedPlayer}) => {
    const[playerList, setPlayerList] = useState([]);

    useEffect(() => {
        fetch(`${BACKENDURL}/players`)
            .then(res => res.json())
            .then(res => {
                setPlayerList(res);
            })
            .catch(err => console.error(err));
    }, [])

    return(
        <ul className='PlayerList'>
            {playerList.sort((a, b) => {
                if(a.type > b.type){
                    return 1;
                } else if (a.type < b.type) {
                    return -1;
                } else {
                    if(a.name > b.name){
                        return 1;
                    } else {
                        return -1;
                    }
                    return 0;
                }
            }).map((player, index) => {
                return <Link key={index} className={`list-element ${player.type.toLowerCase()}`} onClick={() => setSelectedPlayer(player.username)} to='/Store'>
                    <p>{`${player.name} [${player.username}]`}</p>
                    <img src={logos[`${player.type.toLowerCase()}Logo`]} alt={`${player.type} Logo`} className = 'team-logo'></img>
                    <img src={CartLogo} alt='Shop logo' className='shop-logo'></img>
                </Link>
            })}
        </ul>
    )
}

export default PlayerList;