import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Select, Button } from '@mui/material';
import { getUrl, getReq } from '../../../../Utils';
import CartEffect from './CartEffect';
import CartItem from './CartItem';
import './Cart.scss';

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
    getReq(`${getUrl}/checkout/status`)
      .then((res) => res.json())
      .then((res) => {
        setCheckoutDisabled(res);
      })
      .catch(() => {});
  };

  useEffect(() => {
    getReq(`${getUrl()}/players`)
      .then((res) => res.json())
      .then((res) => {
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
        {cartItems.map((item, index) => {
          if (!('power' in item)) return <CartItem key={item.displayName} item={item} changeCartAmount={changeCartAmount(index)} removeFromCart={removeFromCart(index)} />;
          return (
            <CartEffect
              key={item.displayName}
              effect={item}
              changeEffectPower={changeEffectPower(index)}
              changeEffectTime={changeEffectTime(index)}
              removeFromCart={removeFromCart(index)}
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
      <Button className="cart-checkout bg-csh-secondary-gradient" onClick={proceedToCheckout} disabled={(checkoutDisabled || calculateTotal() < 2)}>
        {(() => {
          if (checkoutDisabled) return 'Waiting For Game To Start';
          if (calculateTotal() < 2) return 'Minimum of $2.00';
          return 'Proceed To Checkout';
        })()}
      </Button>
    </div>
  );
};

Cart.propTypes = {
  player: PropTypes.string.isRequired,
  showCart: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  cartItems: PropTypes.array.isRequired,
  setPlayer: PropTypes.func.isRequired,
  changeCartAmount: PropTypes.func.isRequired,
  changeEffectPower: PropTypes.func.isRequired,
  changeEffectTime: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  proceedToCheckout: PropTypes.func.isRequired,
  calculateTotal: PropTypes.func.isRequired,
};

export default Cart;
