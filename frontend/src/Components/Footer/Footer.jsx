import React, { Component } from 'react';
import CSHLogo from '../../images/csh.svg';
import GithubLogo from '../../images/github.svg';
import "./Footer.css";

class Footer extends Component{
    render(){
        return(
            <footer className="Footer bg-csh-primary-gradient">
                <div className="authors">
                    <p className="authors-names font-csh-dark">Site created by Aidan Brown, River Marks, Corey Rigney, and Rhys Stever</p>
                </div>
                <div className="links">
                    <a href="https://github.com/aidan-brown/Charity-Stream-Web-App" className="github">
                        <p className="githubLink font-csh-dark">Check out this site on Github!</p>
                        <img id='github-logo' src={GithubLogo} alt='Github logo'/>
                    </a>
                    <a href="https://csh.rit.edu" className="pubsite">
                        <p className="pubsiteLink font-csh-dark">Check out CSH!</p>
                        <img id='csh-logo' src={CSHLogo} alt='CSH logo'/>
                    </a>
                </div>
            </footer>
        )
    }
}

export default Footer;