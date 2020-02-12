import React, { Component } from 'react';
import CSHLogo from '../../images/csh_logo_round.svg';
import GithubLogo from '../../images/github.svg';
import "./Footer.css";

class Footer extends Component{
    render(){
        return(
            <div className="Footer bg-csh-primary font-csh-dark">
                <div className="authors">
                    <p className="authors-names">Site created by Aidan Brown, River Marks, Corey Rigney, and Rhys Stever</p>
                </div>
                <div className="github">
                    <a href="https://github.com/aidan-brown/Charity-Stream-Web-App">Check out this site on Github!</a>
                    <img id='github-logo' src={GithubLogo} alt='Github logo'/>
                </div>
                <div className="pubsite">
                    <a href="https://csh.rit.edu">Check out CSH!</a>
                    <img id='csh-logo' src={CSHLogo} alt='CSH logo'/>
                </div>
            </div>
        )
    }
}

export default Footer;