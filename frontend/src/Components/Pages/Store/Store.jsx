import React, { Component } from 'react';
import './Store.css';

import Placeholder from '../../../images/placeholder.png';

/** Responsible for constructing the store page component **/
class Store extends Component{
    /*
    Handles the rendering of the component - Contains the routes to each of the content pages
    * @return {JSX Element} the store page
    */
    render(){
        return(
            <div className='Store'>
                <div className='store-window'>
                    <nav className='store-nav'>
                        <ul>
                            <li id='link-all' className='store-link'>All</li>
                            <li id='link-tools' className='store-link'>Tools</li>
                            <li id='link-weapons' className='store-link'>Weapons</li>
                            <li id='link-armor' className='store-link'>Armor</li>
                            <li id='link-armor' className='store-link'>Food</li>
                            <li id='link-armor' className='store-link'>Buffs</li>
                            <li id='link-armor' className='store-link'>Materials</li>
                            <li id='link-armor' className='store-link'>Kits</li>
                        </ul>
                    </nav>
                    <div className='store-content'>
                        <span className='store-item'>
                            <p className='item-name'>Item Name</p>
                            <div className='item-image'>
                                <img src={Placeholder} alt='item placeholder image'/>
                            </div>
                            <dl className='item-stats'>
                                <dt>Amount:</dt>
                                <dd>64</dd>
                            </dl>
                            <p className='item-price'>Price: $0.00</p>
                        </span>

                        <span className='store-item'>
                            <p className='item-name'>Item Name</p>
                            <div className='item-image'>
                                <img src={Placeholder} alt='item placeholder image'/>
                            </div>
                            <dl className='item-stats'>
                                <dt>Amount:</dt>
                                <dd>64</dd>
                            </dl>
                            <p className='item-price'>Price: $0.00</p>
                        </span>

                        <span className='store-item'>
                            <p className='item-name'>Item Name</p>
                            <div className='item-image'>
                                <img src={Placeholder} alt='item placeholder image'/>
                            </div>
                            <dl className='item-stats'>
                                <dt>Amount:</dt>
                                <dd>64</dd>
                            </dl>
                            <p className='item-price'>Price: $0.00</p>
                        </span>

                        <span className='store-item'>
                            <p className='item-name'>Item Name</p>
                            <div className='item-image'>
                                <img src={Placeholder} alt='item placeholder image'/>
                            </div>
                            <dl className='item-stats'>
                                <dt>Amount:</dt>
                                <dd>64</dd>
                            </dl>
                            <p className='item-price'>Price: $0.00</p>
                        </span>

                        <span className='store-item'>
                            <p className='item-name'>Item Name</p>
                            <div className='item-image'>
                                <img src={Placeholder} alt='item placeholder image'/>
                            </div>
                            <dl className='item-stats'>
                                <dt>Amount:</dt>
                                <dd>64</dd>
                            </dl>
                            <p className='item-price'>Price: $0.00</p>
                        </span>

                        <span className='store-item'>
                            <p className='item-name'>Item Name</p>
                            <div className='item-image'>
                                <img src={Placeholder} alt='item placeholder image'/>
                            </div>
                            <dl className='item-stats'>
                                <dt>Amount:</dt>
                                <dd>64</dd>
                            </dl>
                            <p className='item-price'>Price: $0.00</p>
                        </span>

                        <span className='store-item'>
                            <p className='item-name'>Item Name</p>
                            <div className='item-image'>
                                <img src={Placeholder} alt='item placeholder image'/>
                            </div>
                            <dl className='item-stats'>
                                <dt>Amount:</dt>
                                <dd>64</dd>
                            </dl>
                            <p className='item-price'>Price: $0.00</p>
                        </span>

                        <span className='store-item'>
                            <p className='item-name'>Item Name</p>
                            <div className='item-image'>
                                <img src={Placeholder} alt='item placeholder image'/>
                            </div>
                            <dl className='item-stats'>
                                <dt>Amount:</dt>
                                <dd>64</dd>
                            </dl>
                            <p className='item-price'>Price: $0.00</p>
                        </span>

                        <span className='store-item'>
                            <p className='item-name'>Item Name</p>
                            <div className='item-image'>
                                <img src={Placeholder} alt='item placeholder image'/>
                            </div>
                            <dl className='item-stats'>
                                <dt>Amount:</dt>
                                <dd>64</dd>
                            </dl>
                            <p className='item-price'>Price: $0.00</p>
                        </span>

                        <span className='store-item'>
                            <p className='item-name'>Item Name</p>
                            <div className='item-image'>
                                <img src={Placeholder} alt='item placeholder image'/>
                            </div>
                            <dl className='item-stats'>
                                <dt>Amount:</dt>
                                <dd>64</dd>
                            </dl>
                            <p className='item-price'>Price: $0.00</p>
                        </span>

                        <span className='store-item'>
                            <p className='item-name'>Item Name</p>
                            <div className='item-image'>
                                <img src={Placeholder} alt='item placeholder image'/>
                            </div>
                            <dl className='item-stats'>
                                <dt>Amount:</dt>
                                <dd>64</dd>
                            </dl>
                            <p className='item-price'>Price: $0.00</p>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Store;