import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import './Content.css';
import Landing from '../Pages/Landing/Landing';
import Store from '../Pages/Store/Store';
import Checkout from '../Pages/Checkout/Checkout';

class Content extends Component{
    render(){
        return(
            <main className="Content">
                <Switch>
                    <Route path='/Checkout' render={() => (<Checkout/>)} />
                    <Route path="/Store" render={() => (<Store/>)} />
                    <Route path="/" render={() => (<Landing/>)} />
                </Switch>
            </main>
        )
    }
}

export default Content;