import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../images/csh.svg';
import ToggleIcon from '../../images/toggler.svg';
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
        if(event.target.className === 'nav-link' || event.target.className === 'nav-link active'){
            event.target.className = 'nav-link active';
        }
        else{
            event.target.parentNode.className = 'nav-link active';
        }
    }

    render(){
        return(
            <nav className='Navbar'>
                <div className='navbar navbar-expand-md bg-csh-primary-gradient'>
                    <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#collapsibleNavbar'>
                        <img src={ToggleIcon} height="100%" />
                    </button>
                    <a className='navbar-brand order-md-last' href='https://www.csh.rit.edu/' target='_blank' rel="noopener noreferrer">
                            <img id='csh-logo' src={Logo} alt='CSH logo' />
                    </a>

                    <div className='collapse navbar-collapse' id='collapsibleNavbar'>
                        <ul className='navbar-nav justify-content-center'>
                            <li className='nav-item'>
                                <Link id='stream' className='nav-link' onClick={e => this.setLinkActive(e)} to='/'><span>Stream</span></Link>
                            </li>
                            <li className='nav-item'>
                                <Link id='store' className='nav-link' onClick={e => this.setLinkActive(e)} to='/Store'><span>Store</span></Link>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link' href='#'><span>JustGiving Page</span></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }

    componentDidMount(){
        let activeLink;
        switch(window.location.pathname){
            case '/':
                activeLink = document.querySelector('#stream');
                break;

            default:
                activeLink = document.querySelector(`#${window.location.pathname.substring(1, window.location.pathname.length).toLowerCase()}`);
                break;
        }

        if(activeLink){
            activeLink.className += ' active';
        }
    }
}

export default Navbar;