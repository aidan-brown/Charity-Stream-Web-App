import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import { mdiCartPlus } from '@mdi/js';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { isSafari } from 'react-device-detect';
import { getApiUrl, ItemSymbols } from '../../../../Utils';

const StoreItem = ({
  item, addItemToCart, isStore, className,
}) => {
  const {
    id,
    description,
    displayName,
    type,
    price,
    priceOverride,
    disabled,
    effects,
    durability,
    hungerFill,
    speed,
    damage,
    protection,
  } = item;

  const isOverridden = priceOverride !== null && priceOverride !== undefined;

  return (
    <span
      tabIndex={0}
      role="button"
      className={`store-item bg-csh-tertiary ${className || ''}`}
      onClick={addItemToCart}
      onKeyDown={addItemToCart}
      data-disabled={disabled}
    >
      <div className="store-item-header bg-csh-primary-gradient">
        {!isSafari
          ? (
            <>
              <LazyLoadImage className="store-item-image" src={`${getApiUrl()}/images/${type}/${id}-full.webp`} alt={displayName} effect="blur" />
              <LazyLoadImage className="store-item-icon" src={`${getApiUrl()}/images/${type}/${id}.webp`} alt={displayName} effect="blur" />
            </>
          )
          : (
            <>
              <img
                className="store-item-image"
                src={`${getApiUrl()}/images/${type}/${id}-full.webp`}
                alt={displayName}
              />
              <img
                className="store-item-icon"
                src={`${getApiUrl()}/images/${type}/${id}.webp`}
                alt={displayName}
              />
            </>
          )}
        <p className="store-item-displayName">{displayName}</p>
        <span className="store-item-price">
          <p className={`original-price ${isOverridden ? 'overrided' : ''}`}>
            {`$${Number(price).toFixed(2)}`}
          </p>
          {isOverridden && (
            <p>
              {`$${Number(priceOverride).toFixed(2)}`}
            </p>
          )}
          {type === 'effect' && '/30sec x Power Level'}
        </span>
      </div>
      <div className="store-item-text">
        <span className="store-item-description">
          <h3>Description</h3>
          <p>{description}</p>
          {effects && (
            <>
              <h3>Special Effects</h3>
              <p>{effects}</p>
            </>
          )}
        </span>
        {(durability || hungerFill) && (
          <div className="store-item-stats">
            {speed && (
              <span key={0}>
                <h3>Speed Rating</h3>
                <p>{speed}</p>
              </span>
            )}
            {damage && (
              <span key={1}>
                <h3>Damage Rating</h3>
                <p>
                  {damage}
                  {' '}
                  (
                  {ItemSymbols('health', damage)}
                  )
                </p>
              </span>
            )}
            {protection && (
              <span key={2}>
                <h3>Armor Rating</h3>
                <p>
                  {protection}
                  {' '}
                  (
                  {ItemSymbols('armor', protection)}
                  )
                </p>
              </span>
            )}
            {hungerFill && (
              <span key={4}>
                <h3>Food Rating</h3>
                <p>
                  {hungerFill}
                  {' '}
                  (
                  {ItemSymbols('hunger', hungerFill)}
                  )
                </p>
              </span>
            )}
            {durability && (
              <span key={7}>
                <h3>Durability</h3>
                <p>{durability}</p>
              </span>
            )}
          </div>
        )}
      </div>
      {isStore && <Icon path={mdiCartPlus} className="add-cart" />}
    </span>
  );
};
StoreItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    priceOverride: PropTypes.number,
    disabled: PropTypes.bool,

    // Item Specific
    hungerFill: PropTypes.number,
    speed: PropTypes.number,
    durability: PropTypes.number,
    effects: PropTypes.string,
    damage: PropTypes.number,
    protection: PropTypes.number,
  }).isRequired,
  addItemToCart: PropTypes.func.isRequired,
  isStore: PropTypes.bool,
  className: PropTypes.string,
};

StoreItem.defaultProps = {
  isStore: true,
  className: '',
};

export default StoreItem;
