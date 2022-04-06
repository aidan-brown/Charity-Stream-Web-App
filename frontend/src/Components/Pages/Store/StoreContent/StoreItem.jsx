import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@mdi/react';
import { mdiCartPlus } from '@mdi/js';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getUrl, ItemSymbols } from '../../../../Utils';

const StoreItem = ({
  item, addItemToCart, isStore, className,
}) => {
  const ItemSymbols = (type, rating = 1) => {
    const symbols = [];
    let count = rating;
    for (let i = 0; i < Math.floor(count / 2); i += 1) {
      symbols.push(<img key={i + type} src={itemSymbols[type]} alt={type} />);
    }
    count %= 2;
    if (count > 0) symbols.push(<img key={`half-${type}`} src={itemSymbols[`${type}Half`]} alt={type} />);
    return (
      <>
        {symbols}
      </>
    );
  };

  return (
    <span tabIndex={0} role="button" className={`store-item bg-csh-tertiary ${className || ''}`} onClick={addItemToCart} onKeyDown={addItemToCart} data-disabled={item.disabled}>
      <div className="store-item-header bg-csh-primary-gradient">
        <LazyLoadImage className="store-item-image" src={`${getUrl()}/images/items/${item.id}-full.webp`} alt={item.displayName} effect="blur" />
        <LazyLoadImage className="store-item-icon" src={`${getUrl()}/images/items/${item.id}.webp`} alt={item.displayName} effect="blur" />
        <p className="store-item-displayName">{item.displayName}</p>
        <p className="store-item-price">
          $
          {item.price.toFixed(2)}
        </p>
      </div>
      <div className="store-item-text">
        <span className="store-item-description">
          <h3>Description</h3>
          <p>{item.description}</p>
          {item.effects && (
          <>
            <h3>Special Effects</h3>
            <p>{item.effects}</p>
          </>
          )}
        </span>
        {(item.durability || item.hungerFill)
        && (
        <div className="store-item-stats">
          {item.speed && (
          <span key={0}>
            <h3>Speed Rating</h3>
            <p>{item.speed}</p>
          </span>
        )}
        {item.damage && (
          <span key={1}>
            <h3>Damage Rating</h3>
            <p>
              {item.damage}
              {' '}
              (
              {ItemSymbols('health', item.damage)}
              )
            </p>
          </span>
        )}
        {item.protection && (
          <span key={2}>
            <h3>Armor Rating</h3>
            <p>
              {item.protection}
              {' '}
              (
              {ItemSymbols('armor', item.protection)}
              )
            </p>
          </span>
        )}
        {item.hungerFill && (
          <span key={4}>
            <h3>Food Rating</h3>
            <p>
              {item.hungerFill}
              {' '}
              (
              {ItemSymbols('hunger', item.hungerFill)}
              )
            </p>
          </span>
          )}
          {item.durability && (
          <span key={7}>
            <h3>Durability</h3>
            <p>{item.durability}</p>
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
    hungerFill: PropTypes.number,
    speed: PropTypes.number,
    durability: PropTypes.number,
    effects: PropTypes.string,
    damage: PropTypes.number,
    protection: PropTypes.number,
    displayName: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
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
