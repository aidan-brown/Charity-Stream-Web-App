import React, { useState, useEffect, useRef } from 'react';

import './Cart.css';
import Placeholder from '../../../../images/placeholder.png';
import {BACKENDURL} from '../../../App/constants.js';

const Cart = ({player, setPlayer, cartItems, changeCartAmount, proceedToCheckout, showCart, calculateTotal}) => {
    const[playerList, setPlayerList] = useState([]);
    const playerSelectRef = useRef();

    useEffect(() => {

        fetch(`${BACKENDURL}/players`)
            .then(res => res.json())
            .then(res => {
                setPlayerList(res);
                playerSelectRef.current.value = player;
            })
            .catch(err => console.error(err));
    }, [])

    return(
        <div className="Cart bg-csh-tertiary" data-showcart={showCart}>
            <div className='cart-playerselect'>
                <select name='players' ref={playerSelectRef} onChange={() => setPlayer(playerSelectRef.current.value)}>
                    {playerList.sort((a, b) => {
                            if(a.name > b.name){
                                return 1;
                            } else if(a.name < b.name){
                                return -1;
                            }
                            return 0;
                        }).map((player, index) => {
                            return <option value={player.username} key={index}>{`${player.name} [${player.username}]`}</option>
                        })
                    }
                </select>
            </div>
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