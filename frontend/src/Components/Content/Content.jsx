import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import Landing from '../Pages/Landing/Landing';
import StoreLanding from '../Store/StoreLanding';
import Checkout from '../Pages/Checkout/Checkout';

class Content extends Component{
    render(){
        return(
            <div className="Content">
                <Switch>
                    <Route path='/Checkout' render={() => (<Checkout/>)} />
                    <Route path="/Store" render={() => (<StoreLanding/>)} />
                    <Route path="/" render={() => (<Landing/>)} />
                </Switch>
            </div>
        )
    }
}

export default Content;