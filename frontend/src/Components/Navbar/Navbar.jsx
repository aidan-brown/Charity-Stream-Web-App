import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component{
    render(){
        return(
            <div className="Navbar">
                <ul className="nav-items">
                    <li className="nav-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/Store">Store</Link>
                    </li>
                    <li className="nav-item">
                        <a href='#'>JustGiving Page</a>
                    </li>
                </ul>
                <div className="nav-logo">
                    <img src="Logo.png" alt="CSH logo" />
                </div>
            </div>
        )
    }
}

export default Navbar;