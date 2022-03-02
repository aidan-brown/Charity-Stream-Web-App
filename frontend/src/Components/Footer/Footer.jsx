import React from 'react';
import './Footer.css';

/** Class for constructing the footer component * */
const Footer = () => (
  <footer className="Footer bg-csh-primary-gradient">
    <div className="footer-row">
      <img src="https://assets.csh.rit.edu/pubsite/rit_csh.png" alt="RIT and Computer Science House" />
    </div>
    <div className="footer-row">
      <i>Getting more done after 2am than most people do all day.</i>
    </div>
    <div className="footer-row stuff">
      <div className="bottom">
        <a href="mailto:charity@csh.rit.edu">charity@csh.rit.edu</a>
      </div>
      <div className="bottom">
        &copy;
        {' '}
        {(new Date()).getFullYear()}
        {' '}
        Computer Science House
      </div>
      <div className="bottom">
        <a href="https://github.com/aidan-brown/Charity-Stream-Web-App">Website on Github</a>
      </div>
    </div>
  </footer>
);

export default Footer;
