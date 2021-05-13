import React, { useState } from 'react';
import {Route, Switch} from 'react-router-dom';
import './Content.css';
import Landing from '../Pages/Landing/Landing';
import Store from '../Pages/Store/Store';

/** Class for constructing the main content component **/
const Content = () => {
    const[selectedPlayer, setSelectedPlayer] = useState('fastturtle123');

    return(
        <main className="Content">
            <Switch>
                <Route path="/Store" render={() => (<Store selectedPlayer={selectedPlayer}/>)} />
                <Route path="/" render={() => (<Landing setSelectedPlayer={setSelectedPlayer}/>)} />
            </Switch>
        </main>
    )
}

export default Content;