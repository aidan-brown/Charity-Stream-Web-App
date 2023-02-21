/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

const CartItem = ({ item, changeCartAmount, removeFromCart }) => (
  <span className="cart-item">
    <div className="cart-item-description">
      <p className="cart-item-header">{item.displayName}</p>
      <span className="cart-item-price">
        <p className={`original-price ${(item.priceOverride !== null && item.priceOverride !== undefined) ? 'overrided' : ''}`}>
          $
          {(item.amount * item.price).toFixed(2)}
        </p>
        {(item.priceOverride !== null && item.priceOverride !== undefined) && (
        <p>
          $
          {(item.amount * Number(item.priceOverride)).toFixed(2)}
        </p>
        )}
      </span>
    </div>
    <div className="cart-item-brand bg-csh-primary-gradient">
      <img className="cart-item-icon" src={item.icon} alt={item.displayName} />
      <img className="cart-item-image" src={item.img} alt={item.displayName} />
    </div>
    <div className="cart-item-counter bg-csh-tertiary">
      <span tabIndex={0} role="button" className="material-icons cart-item-count-control" onClick={() => changeCartAmount(-1)} onKeyPress={() => changeCartAmount(-1)}>remove</span>
      <span className="vr" />
      <input
        type="number"
        value={item.amount}
        onChange={(e) => changeCartAmount(e.target.value - item.amount)}
      />
      <span className="vr" />
      <span tabIndex={0} role="button" className="material-icons cart-item-count-control" onClick={() => changeCartAmount(1)} onKeyPress={() => changeCartAmount(1)}>add</span>
    </div>
    <div tabIndex={0} role="button" className="cart-item-remove" onClick={() => removeFromCart()} onKeyPress={() => removeFromCart()}>
      <span className="material-icons md-18">close</span>
    </div>
  </span>
);

CartItem.propTypes = {
  item: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    priceOverride: PropTypes.any,
  }).isRequired,
  changeCartAmount: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
};

export default CartItem;
