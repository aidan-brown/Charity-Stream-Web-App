import React, { useState, useEffect } from 'react';

const Cart = ({items}) => {

    useEffect(() => {
        
    }, [items])

    return(
        <div className="Cart">
            <ul className="allItemsList">

            </ul>
            <div className="shoppingCart">
                
            </div>
        </div>
    )
}

export default Cart;