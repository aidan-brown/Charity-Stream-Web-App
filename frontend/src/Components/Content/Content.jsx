import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import Landing from '../Pages/Landing/Landing';
import Store from '../Pages/Store/Store';
import Checkout from '../Pages/Checkout/Checkout';

class Content extends Component{
    render(){
        return(
            <div className="Content">
                <Switch>
                    <Route path='/Checkout' render={() => (<Checkout/>)} />
                    <Route path="/Store" render={() => (<Store/>)} />
                    <Route path="/" render={() => (<Landing/>)} />
                </Switch>
            </div>
        )
    }
}

export default Content;