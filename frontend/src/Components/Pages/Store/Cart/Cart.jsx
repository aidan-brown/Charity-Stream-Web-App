import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  MenuItem, Select, FormControl, InputLabel,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoadingButton from '@mui/lab/LoadingButton';
import { useQuery } from '@tanstack/react-query';
import CartEffect from './CartEffect';
import CartItem from './CartItem';
import './Cart.scss';
import { getPlayers } from '../../../../api';

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
  const [loading, setLoading] = useState(false);

  const { data: players = [] } = useQuery(
    ['players'],
    () => getPlayers(),
  );

  // TODO: Not set up to handle routes
  // const { data: checkoutDisabled } = useQuery(
  //   ['checkout-status'],
  //   () => getCheckoutStatus(),
  //   {
  //     refetchInterval: 10000,
  //   },
  // );

  return (
    <div className="Cart bg-csh-tertiary" data-showcart={showCart}>
      <div className="cart-playerselect">
        <FormControl fullWidth>
          <InputLabel id="select-label">Select Player for Donation</InputLabel>
          <Select
            labelId="select-label"
            className="cart-playerselect-select"
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
            autoWidth
          >
            {players.sort((a, b) => a.name.localeCompare(b.name)).map((p) => <MenuItem value={p.username} key={p.username}>{`${p.name} [${p.username}]`}</MenuItem>)}
          </Select>
        </FormControl>
      </div>
      <div className="cart-content">
        {cartItems.map((item, index) => {
          if (!('power' in item)) {
            return (
              <CartItem
                key={item.displayName}
                item={item}
                changeCartAmount={changeCartAmount(index)}
                removeFromCart={removeFromCart(index)}
              />
            );
          }
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
      <p className="cart-disclaimer">
        Minimum of $2.00 per donation
        <br />
        Please do not attempt to change the donation amount on the Just Giving page,
        this will result in the order not being processed correctly
      </p>
      <span className="cart-amount">
        <p>Total Amount</p>
        <p>
          $
          {calculateTotal().toFixed(2)}
        </p>
      </span>
      <hr />
      <LoadingButton
        loading={loading}
        className="cart-checkout bg-csh-secondary-gradient"
        onClick={async () => {
          setLoading(true);
          await proceedToCheckout();
          setLoading(false);
        }}
        startIcon={<ShoppingCartIcon />}
        disabled={(/** checkoutDisabled || */ calculateTotal() < 2 || player === '')}
      >
        {(() => {
          // TODO: if (checkoutDisabled) return 'Waiting For Game To Start';
          if (calculateTotal() < 2) return 'Minimum of $2.00';
          if (player === '') return 'Must select a player';
          if (loading) return 'Verifying Cart...';
          return 'Proceed To Checkout';
        })()}
      </LoadingButton>
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
