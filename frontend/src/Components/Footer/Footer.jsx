import React from 'react';
import CSHLogo from '../../images/csh.svg';
import GithubLogo from '../../images/github.svg';
import "./Footer.css";

/** Class for constructing the footer component **/
const Footer = () => {
    return(
        <footer className="Footer bg-csh-primary-gradient">
            <div class="footer-row">
                <img src="https://assets.csh.rit.edu/pubsite/rit_csh.png" />
            </div>
            <div class="footer-row">
                <i>Getting more done after 2am than most people do all day.</i>
            </div>
            <div class="footer-row">
                <div>
                    <a href="mailto:charity@csh.rit.edu">charity.csh.rit.edu</a>
                </div>
                <div>
                    @ 2020 Computer Science House
                </div>
                <div>
                    <a href="https://github.com/aidan-brown/Charity-Stream-Web-App">Website on Github</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer;