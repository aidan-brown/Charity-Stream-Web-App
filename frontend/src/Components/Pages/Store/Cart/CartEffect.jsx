/* eslint-disable no-mixed-operators */
import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Select } from '@mui/material';

const POWER_LEVELS = {
  I: 0,
  II: 1,
  III: 2,
  IV: 3,
  V: 4,
  VI: 5,
  VII: 6,
  VIII: 7,
  IX: 8,
  X: 9,
};

const TIME_LEVELS = {
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

const CartEffect = ({
  effect, changeEffectPower, changeEffectTime, removeFromCart,
}) => {
  console.log(effect);
  return (
    <span className="cart-item">
      <div className="cart-item-description">
        <p className="cart-item-header">{effect.name}</p>
        <p className="cart-item-price">
          $
          {(((effect.power + 1) * (effect.time / 30 * effect.price))).toFixed(2)}
        </p>
      </div>
      <div className="cart-item-brand bg-csh-primary-gradient">
        <img className="cart-item-icon" src={effect.icon} alt={effect.name} />
        <img className="cart-item-image" src={effect.img} alt={effect.name} />
      </div>
      <div className="cart-effect-stats bg-csh-tertiary">
        <Select value={effect.power} onChange={(e) => changeEffectPower(effect, e.target.value)}>
          {Object.keys(POWER_LEVELS).map((lvl) => (
            <MenuItem value={POWER_LEVELS[lvl]} key={effect.name}>
              {lvl}
            </MenuItem>
          ))}
        </Select>
        <Select value={effect.time} onChange={(e) => changeEffectTime(effect, e.target.value)}>
          {Object.keys(TIME_LEVELS).map((lvl) => (
            <MenuItem value={TIME_LEVELS[lvl]} key={effect.name}>
              {lvl}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div tabIndex={0} role="button" className="cart-item-remove" onClick={() => removeFromCart(effect)} onKeyPress={() => removeFromCart(effect)}>
        <span className="material-icons md-18">close</span>
      </div>
    </span>
  );
};

CartEffect.propTypes = {
  effect: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,
    power: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  changeEffectPower: PropTypes.func.isRequired,
  changeEffectTime: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
};

export default CartEffect;
