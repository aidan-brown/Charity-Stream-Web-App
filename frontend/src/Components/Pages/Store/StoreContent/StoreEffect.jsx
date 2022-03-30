import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import { mdiCartPlus } from '@mdi/js';
import { getUrl } from '../../../../Utils';

const StoreEffect = ({
  effect, addItemToCart, isStore, className,
}) => (
  <span tabIndex={0} role="button" className={`store-item bg-csh-tertiary ${className || ''}`} onClick={addItemToCart} onKeyDown={addItemToCart} data-disabled={effect.disabled}>
    <div className="store-item-header bg-csh-primary-gradient">
      <img className="store-item-image" src={`${getUrl()}/images/effects/${effect.id}-full.png`} alt={effect.displayName} />
      <img className="store-item-icon" src={`${getUrl()}/images/effects/${effect.id}.png`} alt={effect.displayName} />
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
    {isStore && <Icon path={mdiCartPlus} className="add-cart" />}
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
  isStore: PropTypes.bool,
  className: PropTypes.string,
};

StoreEffect.defaultProps = {
  isStore: true,
  className: '',
};

export default StoreEffect;
