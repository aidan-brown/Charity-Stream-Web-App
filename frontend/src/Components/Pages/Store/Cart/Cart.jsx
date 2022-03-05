import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, MenuItem, Select } from '@mui/material';
import { BACKENDURL } from '../../../App/constants';
import CartEffect from './CartEffect';
import CartItem from './CartItem';
import './Cart.css';

const Cart = ({
  player,
  setPlayer,
  cartItems,
  changeCartAmount,
  changeEffectPower,
  changeEffectTime,
  removeFromCart,
  proceedToCheckout,
  showCart,
  calculateTotal,
}) => {
  const [playerList, setPlayerList] = useState([]);
  const [checkoutDisabled, setCheckoutDisabled] = useState(false);

  const fetchCheckoutStatus = () => {
    fetch(`${BACKENDURL}/checkout/status`)
      .then((res) => res.json())
      .then((res) => {
        setCheckoutDisabled(res);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetch(`${BACKENDURL}/players`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setPlayerList(res);
      })
      .catch(() => {});

    fetchCheckoutStatus();

    const checkoutPoll = setInterval(fetchCheckoutStatus, 10000);
    return () => {
      clearInterval(checkoutPoll);
    };
  }, []);

  return (
    <div className="Cart bg-csh-tertiary" data-showcart={showCart}>
      <div className="cart-playerselect">
        <Select className="cart-playerselect-select" value={player} onChange={(e) => setPlayer(e.target.value)} autoWidth>
          {playerList.sort((a, b) => {
            if (a.name > b.name) {
              return 1;
            } if (a.name < b.name) {
              return -1;
            }
            return 0;
          }).map((p) => <MenuItem value={p.username} key={p.username}>{`${p.name} [${p.username}]`}</MenuItem>)}
        </Select>
      </div>
      <div className="cart-content">
        {cartItems.map((item) => {
          if (!('power' in item)) return <CartItem key={item.name} item={item} changeCartAmount={changeCartAmount} removeFromCart={removeFromCart} />;
          return (
            <CartEffect
              key={item.name}
              effect={item}
              changeEffectPower={changeEffectPower}
              changeEffectTime={changeEffectTime}
              removeFromCart={removeFromCart}
            />
          );
        })}
      </div>
      <p className="cart-disclaimer">Minimum of $2.00 per donation</p>
      <span className="cart-amount">
        <p>Total Amount</p>
        <p>
          $
          {calculateTotal().toFixed(2)}
        </p>
      </span>
      <hr />
      <Button className="cart-checkout bg-csh-secondary-gradient" onClick={proceedToCheckout} disabled={checkoutDisabled}>{checkoutDisabled ? 'Waiting For Game To Start' : 'Proceed To Checkout'}</Button>
    </div>
  );
};

Cart.propTypes = {
  player: PropTypes.string.isRequired,
  setPlayer: PropTypes.func.isRequired,
  cartItems: PropTypes.oneOf([
    {
      icon: PropTypes.string.isRequired,
      img: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      time: PropTypes.number.isRequired,
      power: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
    },
    {
      icon: PropTypes.string.isRequired,
      img: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
    },
  ]).isRequired,
  changeCartAmount: PropTypes.func.isRequired,
  changeEffectPower: PropTypes.func.isRequired,
  changeEffectTime: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  proceedToCheckout: PropTypes.func.isRequired,
  showCart: PropTypes.func.isRequired,
  calculateTotal: PropTypes.func.isRequired,
};

export default Cart;
