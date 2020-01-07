import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import App from '../App/App';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import StoreContent from '../Content/StoreContent';

class Navbar extends Component{
    render(){
        return(
            <div className="Navbar">
                <Router>
                <ul className="nav-items">
                    <li className="nav-item">
                        <Link to="/Home">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/Store">Store</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/JustGiving">JustGiving Page</Link>
                    </li>
                </ul>
                <div className="nav-logo">
                    <img src="Logo.png" alt="CSH logo" />
                </div>
                <Route exact path="/Home" component={App} />
                <Route exact path="/Store" component={StoreContent} />
                <Route exact path="/JustGiving" component={StoreContent} />
                </Router>
            </div>
        )
    }
}

export default Navbar;