/* eslint-disable no-mixed-operators */
import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Select } from '@mui/material';
import { POWER_LEVELS, TIME_LEVELS } from '../../../../constants';

const CartEffect = ({
  effect, changeEffectPower, changeEffectTime, removeFromCart,
}) => (
  <span className="cart-item">
    <div className="cart-item-description">
      <p className="cart-item-header">{effect.displayName}</p>
      <p className="cart-item-price">
        $
        {(((effect.power + 1) * (effect.time / 30 * effect.price))).toFixed(2)}
      </p>
    </div>
    <div className="cart-item-brand bg-csh-primary-gradient">
      <img className="cart-item-icon" src={effect.icon} alt={effect.displayName} />
      <img className="cart-item-image" src={effect.img} alt={effect.displayName} />
    </div>
    <div className="cart-effect-stats bg-csh-tertiary">
      <Select className="effect-select" value={effect.power} onChange={(e) => changeEffectPower(e.target.value)}>
        {Object.keys(POWER_LEVELS).map((lvl) => (
          <MenuItem value={POWER_LEVELS[lvl]} key={effect.displayName}>
            {lvl}
          </MenuItem>
        ))}
      </Select>
      <Select className="effect-select" value={effect.time} onChange={(e) => changeEffectTime(e.target.value)}>
        {Object.keys(TIME_LEVELS).map((lvl) => (
          <MenuItem value={TIME_LEVELS[lvl]} key={effect.displayName}>
            {lvl}
          </MenuItem>
        ))}
      </Select>
    </div>
    <div tabIndex={0} role="button" className="cart-item-remove" onClick={() => removeFromCart()} onKeyPress={() => removeFromCart()}>
      <span className="material-icons md-18">close</span>
    </div>
  </span>
);

CartEffect.propTypes = {
  effect: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,
    power: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  changeEffectPower: PropTypes.func.isRequired,
  changeEffectTime: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
};

export default CartEffect;
