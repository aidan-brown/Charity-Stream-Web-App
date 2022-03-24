import React from 'react';
import PropTypes from 'prop-types';

const CartItem = ({ item, changeCartAmount, removeFromCart }) => (
  <span className="cart-item">
    <div className="cart-item-description">
      <p className="cart-item-header">{item.displayName}</p>
      <p className="cart-item-price">
        $
        {(item.amount * item.price).toFixed(2)}
      </p>
    </div>
    <div className="cart-item-brand bg-csh-primary-gradient">
      <img className="cart-item-icon" src={item.icon} alt={item.displayName} />
      <img className="cart-item-image" src={item.img} alt={item.displayName} />
    </div>
    <div className="cart-item-counter bg-csh-tertiary">
      <span tabIndex={0} role="button" className="material-icons cart-item-count-control" onClick={() => changeCartAmount(item, -1)} onKeyPress={() => changeCartAmount(item, -1)}>remove</span>
      <span className="vr" />
      <span>{item.amount}</span>
      <span className="vr" />
      <span tabIndex={0} role="button" className="material-icons cart-item-count-control" onClick={() => changeCartAmount(item, 1)} onKeyPress={() => changeCartAmount(item, 1)}>add</span>
    </div>
    <div tabIndex={0} role="button" className="cart-item-remove" onClick={() => removeFromCart(item)} onKeyPress={() => removeFromCart(item)}>
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
  }).isRequired,
  changeCartAmount: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
};

export default CartItem;
