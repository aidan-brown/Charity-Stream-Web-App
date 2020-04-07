import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import './Content.css';
import Landing from '../Pages/Landing/Landing';
import StoreLanding from '../Store/StoreLanding';
import Checkout from '../Pages/Checkout/Checkout';

/** Class for constructing the main content component **/
class Content extends Component{
    /*
    Handles the rendering of the component - Contains the routes to each of the content pages
    * @return {JSX Element} the content
    */
    render(){
        return(
            <main className="Content">
                <Switch>
                    <Route path='/Checkout' render={() => (<Checkout/>)} />
                    <Route path="/Store" render={() => (<StoreLanding/>)} />
                    <Route path="/" render={() => (<Landing/>)} />
                </Switch>
            </main>
        )
    }
}

export default Content;