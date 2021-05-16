import React, { useState, useEffect } from 'react';

import './Cart.css';
import {BACKENDURL} from '../../../App/constants.js';
import { Button, MenuItem, Select } from '@material-ui/core';

const Power_Levels = {
    'I': 0,
    'II': 1,
    'III': 2,
    'IV': 3,
    'V': 4,
    'VI': 5,
    'VII': 6,
    'VIII': 7,
    'IX': 8,
    'X': 9
};
const Time_Levels = {
    '0:30': 30,
    '1:00': 60,
    '1:30': 90,
    '2:00': 120,
    '2:30': 150,
    '3:00': 180,
    '3:30': 210,
    '4:00': 240,
    '4:30': 270,
    '5:00': 300,
};

const Cart = ({player, setPlayer, cartItems, changeCartAmount, changeEffectPower, changeEffectTime, removeFromCart, proceedToCheckout, showCart, calculateTotal}) => {
    const[playerList, setPlayerList] = useState([]);

    useEffect(() => {

        fetch(`${BACKENDURL}/players`)
            .then(res => res.json())
            .then(res => {
                setPlayerList(res);
            })
            .catch(err => console.error(err));
    }, [])

    return(
        <div className="Cart bg-csh-tertiary" data-showcart={showCart}>
            <div className='cart-playerselect'>
                <Select className='cart-playerselect-select' value={player} onChange={e => setPlayer(e.target.value)} autoWidth>
                    {playerList.sort((a, b) => {
                            if(a.name > b.name){
                                return 1;
                            } else if(a.name < b.name){
                                return -1;
                            }
                            return 0;
                        }).map((player, index) => {
                            return <MenuItem value={player.username} key={index}>{`${player.name} [${player.username}]`}</MenuItem>
                        })
                    }
                </Select>
            </div>
            <div className="cart-content">
                {cartItems.map((item, index) => {
                    if(!('power' in item))
                        return <CartItem key={index} item={item} changeCartAmount={changeCartAmount} removeFromCart={removeFromCart}/>
                    else
                        return <CartEffect key={index} effect={item} changeEffectPower={changeEffectPower} changeEffectTime={changeEffectTime} removeFromCart={removeFromCart}/>
                })}
                {}
            </div>
            <span className='cart-amount'><p>Total Amount</p><p>${calculateTotal().toFixed(2)}</p></span>
            <hr/>
            <Button className='cart-checkout bg-csh-secondary-gradient' onClick={proceedToCheckout}>Proceed To Checkout</Button>
        </div>
    )
}

const CartItem = ({item, changeCartAmount, removeFromCart}) => {

    return(
        <span className='cart-item'>
            <div className='cart-item-description'>
                <p className='cart-item-header'>{item.name}</p>
                <p className='cart-item-price'>${(item.amount * item.price).toFixed(2)}</p>
            </div>
            <div className='cart-item-brand bg-csh-primary-gradient'>
                <img className='cart-item-icon' src={item.icon} alt={item.name}></img>
                <img className='cart-item-image' src={item.img} alt={item.name}></img>
            </div>
            <div className='cart-item-counter bg-csh-tertiary'>
                <span className="material-icons cart-item-count-control" onClick={() => changeCartAmount(item, -1)}>remove</span>
                <span className='vr'></span>
                <span>{item.amount}</span>
                <span className='vr'></span>
                <span className="material-icons cart-item-count-control" onClick={() => changeCartAmount(item, 1)}>add</span>
            </div>
            <div className='cart-item-remove' onClick={() => removeFromCart(item)}>
                <span className='material-icons md-18'>close</span>
            </div>
        </span>
    )
}

const CartEffect = ({effect, changeEffectPower, changeEffectTime, removeFromCart}) => {

    return(
        <span className='cart-item'>
            <div className='cart-item-description'>
                <p className='cart-item-header'>{effect.name}</p>
                <p className='cart-item-price'>${(((effect.power + 1) * (effect.time / 30 * effect.price))).toFixed(2)}</p>
            </div>
            <div className='cart-item-brand bg-csh-primary-gradient'>
                <img className='cart-item-icon' src={effect.icon} alt={effect.name}></img>
                <img className='cart-item-image' src={effect.img} alt={effect.name}></img>
            </div>
            <div className='cart-effect-stats bg-csh-tertiary'>
                <Select value={effect.power} onChange={e => changeEffectPower(effect, e.target.value)}>
                    {Object.keys(Power_Levels).map((lvl, index) => {
                        return <MenuItem value={Power_Levels[lvl]} key={index}>{lvl}</MenuItem>
                    })}
                </Select>
                <Select value={effect.time} onChange={e => changeEffectTime(effect, e.target.value)}>
                    {Object.keys(Time_Levels).map((lvl, index) => {
                        return <MenuItem value={Time_Levels[lvl]} key={index}>{lvl}</MenuItem>
                    })}
                </Select>
            </div>
            <div className='cart-item-remove' onClick={() => removeFromCart(effect)}>
                <span className='material-icons md-18'>close</span>
            </div>
        </span>
    )
}

export default Cart;