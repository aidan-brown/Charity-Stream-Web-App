import React, { Component } from 'react';
import Placeholder from '../../../../images/placeholder.png';

import './StoreContent.css';

class Store extends Component{
    /*
    Handles the rendering of the component - Contains the routes to each of the content pages
    * @return {JSX Element} the store page
    */
    render(){
        return(
            <div className='StoreContent'>
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
        );
    }
}

export default Store;