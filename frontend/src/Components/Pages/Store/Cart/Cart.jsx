import React, { useState, useEffect } from 'react';

import './Cart.css';
import Placeholder from '../../../../images/placeholder.png';

const Cart = ({cartItems, changeCartAmount, proceedToCheckout, showCart}) => {
    
    const calculateTotal = () => {
        let total = 0;
        cartItems.forEach(item => total += (item.amount * item.price));
        return total;
    }

    return(
        <div className="Cart bg-csh-tertiary" data-showcart={showCart}>
            <div className="cart-content">
                {cartItems.map((item, index) => {
                    return <CartItem key={index} item={item} changeCartAmount={changeCartAmount}/>
                })}
            </div>
            <span className='cart-amount'><p>Total Amount</p><p>${calculateTotal().toFixed(2)}</p></span>
            <hr/>
            <button className='bg-csh-secondary-gradient cart-checkout' onClick={proceedToCheckout}>Proceed To Checkout</button>
        </div>
    )
}

const CartItem = ({item, changeCartAmount}) => {

    return(
        <span className='cart-item'>
            <div className='cart-item-description'>
                <p className='cart-item-header'>{item.name}</p>
                <p className='cart-item-price'>${(item.amount * item.price).toFixed(2)}</p>
            </div>
            <div className='cart-item-image bg-csh-primary-gradient'>
                <img src={Placeholder}></img>
            </div>
            <div className='cart-item-counter bg-csh-tertiary'>
                <span className="material-icons cart-item-count-control" onClick={() => changeCartAmount(item, -1)}>remove</span>
                <span className='vr'></span>
                <span>{item.amount}</span>
                <span className='vr'></span>
                <span className="material-icons cart-item-count-control" onClick={() => changeCartAmount(item, 1)}>add</span>
            </div>
        </span>
    )
}

export default Cart;