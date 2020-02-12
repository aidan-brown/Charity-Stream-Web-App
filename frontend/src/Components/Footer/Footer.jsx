import React, { Component } from 'react';

class Footer extends Component{
    render(){
        return(
            <div className="Footer">
                <div className="authors">
                    <p className="authors-names">Made by Aidan Brown, River Marks, Corey Rigney, and Rhys Stever</p>
                </div>
                <div className="github">
                    <a href="https://github.com/aidan-brown/Charity-Stream-Web-App">Check out this site on Github!</a>
                </div>
                <div className="pubsite">
                    <a href="https://csh.rit.edu">Check out CSH!</a>
                </div>
            </div>
        )
    }
}

export default Footer;