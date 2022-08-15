/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { mdiCartPlus } from '@mdi/js';
import Icon from '@mdi/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { isSafari } from 'react-device-detect';
import { getApiUrl } from '../../../../Utils';

const StoreMob = ({
  mob, addItemToCart, isStore, className,
}) => (
  <span tabIndex={0} role="button" className={`store-item bg-csh-tertiary ${className || ''}`} onClick={addItemToCart} onKeyDown={addItemToCart} data-disabled={mob.disabled}>
    <div className="store-item-header bg-csh-primary-gradient">
      {!isSafari
        ? (
          <>
            <LazyLoadImage className="store-item-image" src={`${getApiUrl()}/images/mobs/${mob.id}-full.webp`} alt={mob.displayName} effect="blur" />
            <LazyLoadImage className="store-item-icon" src={`${getApiUrl()}/images/mobs/${mob.id}.webp`} alt={mob.displayName} effect="blur" />
          </>
        )
        : (
          <>
            <img className="store-item-image" src={`${getApiUrl()}/images/mobs/${mob.id}-full.webp`} alt={mob.displayName} />
            <img className="store-item-icon" src={`${getApiUrl()}/images/mobs/${mob.id}.webp`} alt={mob.displayName} />
          </>
        )}
      <p className="store-item-displayName">{mob.displayName}</p>
      <span className="store-item-price">
        <p className={`original-price ${mob.priceOverride !== null ? 'overrided' : ''}`}>
          $
          {mob.price.toFixed(2)}
        </p>
        {mob.priceOverride !== null && (
        <p>
          $
          {Number(mob.priceOverride).toFixed(2)}
        </p>
        )}
      </span>
    </div>
    <div className="store-item-text">
      <span className="store-item-description">
        <h3>Description</h3>
        <p>{mob.description}</p>
      </span>
    </div>
    {isStore && <Icon path={mdiCartPlus} className="add-cart" />}
  </span>
);

StoreMob.propTypes = {
  mob: PropTypes.shape({
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

StoreMob.defaultProps = {
  isStore: true,
  className: '',
};

export default StoreMob;
