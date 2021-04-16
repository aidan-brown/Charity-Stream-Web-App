import React, { useState, useEffect } from 'react';

import './Cart.css';

const Cart = ({cartItems, removeItemFromCart, proceedToCheckout, showCart}) => {
    

    return(
        <div className="Cart bg-csh-secondary-gradient" data-showCart={showCart}>
            <div className="cart-content">
                {cartItems.map((item, index) => {
                    return <span key={index} className='cart-item'>
                        <p className='cart-item-name'>{item.name}</p>
                        <p className='cart-item-price'>${item.price.toFixed(2)}</p>
                        <p className='cart-item-amount'>{item.amount}</p>
                        <p className='cart-item-total'>${(item.amount * item.price).toFixed(2)}</p>
                        <button onClick={() => removeItemFromCart(index)}>Remove</button>
                    </span>
                })}
            </div>
            <button onClick={proceedToCheckout}>Proceed To Checkout</button>
        </div>
    )
}

export default Cart;