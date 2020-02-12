import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../images/csh_logo_round.svg';
import './Navbar.css';
import '../Bootstrap-Colors/palette.css';

class Navbar extends Component{
    constructor(props){
        super(props);
        this.state = {};

        this.setLinkActive = this.setLinkActive.bind(this);
    }
    
    setLinkActive(event){
        document.querySelector('.Navbar .active').className = 'nav-link';
        event.target.className = 'nav-link active';
    }

    render(){
        return(
            <nav className='Navbar'>
                <div className='navbar navbar-expand-md bg-csh-primary navbar-dark'>
                    <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#collapsibleNavbar'>
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <a className='navbar-brand order-md-last' href='https://www.csh.rit.edu/' target='_blank'>
                            <img id='csh-logo' src={Logo} alt='CSH logo' />
                    </a>

                    <div className='collapse navbar-collapse' id='collapsibleNavbar'>
                        <ul className='navbar-nav'>
                            <li className='nav-item'>
                                <Link className='nav-link active' onClick={e => this.setLinkActive(e)} to='/'>Home</Link>
                            </li>
                            <li className='nav-item'>
                                <Link className='nav-link' onClick={e => this.setLinkActive(e)} to='/Store'>Store</Link>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link' href='#'>JustGiving Page</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Navbar;