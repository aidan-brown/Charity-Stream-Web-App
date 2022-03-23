import React from 'react';
import PropTypes from 'prop-types';
import { BACKENDURL } from '../../../App/constants';

const StoreEffect = ({ effect, addItemToCart }) => (
  <span tabIndex={0} role="button" className="store-item bg-csh-tertiary" onClick={addItemToCart} onKeyDown={addItemToCart} data-disabled={effect.disabled}>
    <div className="store-item-header bg-csh-primary-gradient">
      <img className="store-item-image" src={`${BACKENDURL}/assets/effects/${effect.id}-full.jpg`} alt={effect.displayName} />
      <img className="store-item-icon" src={`${BACKENDURL}/assets/effects/${effect.id}.png`} alt={effect.displayName} />
      <p className="store-item-displayName">{effect.displayName}</p>
      <p className="store-item-price">
        $
        {effect.price.toFixed(2)}
        /30sec * Power Level
      </p>
    </div>
    <div className="store-item-description">
      <dl className="store-item-stats">
        <span>
          <dt>Description</dt>
          <dd>{effect.description}</dd>
        </span>
      </dl>
    </div>

    <span className="add-cart material-icons md-36">add_shopping_cart</span>
  </span>
);

StoreEffect.propTypes = {
  effect: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
  }).isRequired,
  addItemToCart: PropTypes.func.isRequired,
};

export default StoreEffect;
