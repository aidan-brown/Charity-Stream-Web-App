/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import { mdiCartPlus } from '@mdi/js';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getUrl } from '../../../../Utils';

const StoreEffect = ({
  effect, addItemToCart, isStore, className,
}) => (
  <span tabIndex={0} role="button" className={`store-item bg-csh-tertiary ${className || ''}`} onClick={addItemToCart} onKeyDown={addItemToCart} data-disabled={effect.disabled}>
    <div className="store-item-header bg-csh-primary-gradient">
      <LazyLoadImage className="store-item-image" src={`${getUrl()}/images/effects/${effect.id}-full.webp`} alt={effect.displayName} effect="blur" />
      <LazyLoadImage className="store-item-icon" src={`${getUrl()}/images/effects/${effect.id}.webp`} alt={effect.displayName} effect="blur" />
      <p className="store-item-displayName">{effect.displayName}</p>
      <span className="store-item-price">
        <p className={`original-price ${effect.priceOverride !== null ? 'overrided' : ''}`}>
          $
          {effect.price.toFixed(2)}
        </p>
        {effect.priceOverride !== null && (
        <p>
          $
          {Number(effect.priceOverride).toFixed(2)}
        </p>
        )}
        /30sec x Power Level
      </span>
    </div>
    <div className="store-item-text">
      <span className="store-item-description">
        <h3>Description</h3>
        <p>{effect.description}</p>
      </span>
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
    priceOverride: PropTypes.any,
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
