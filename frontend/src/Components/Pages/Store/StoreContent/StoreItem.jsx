import React from 'react';
import PropTypes from 'prop-types';
import { getUrl } from '../../../../Utils';
import { itemSymbols } from '../../../../assets/images';

const StoreItem = ({
  item, addItemToCart, isStore, className,
}) => {
  const ItemSymbols = (type, rating = 1) => {
    const symbols = [];
    let count = rating;
    for (let i = 0; i < Math.floor(count / 2); i += 1) {
      symbols.push(<img src={itemSymbols[type]} alt={type} />);
    }
    count -= Math.floor(count / 2);
    if (count > 0) symbols.push(<img src={itemSymbols[`${type}Half`]} alt={type} />);
    return (
      <>
        {symbols}
      </>
    );
  };

  return (
    <span tabIndex={0} role="button" className={`store-item bg-csh-tertiary ${className || ''}`} onClick={addItemToCart} onKeyDown={addItemToCart} data-disabled={item.disabled}>
      <div className="store-item-header bg-csh-primary-gradient">
        <img className="store-item-image" src={`${getUrl()}/images/items/${item.id}-full.png`} alt={item.displayName} />
        <img className="store-item-icon" src={`${getUrl()}/images/items/${item.id}.png`} alt={item.displayName} />
        <p className="store-item-displayName">{item.displayName}</p>
        <p className="store-item-price">
          $
          {item.price.toFixed(2)}
        </p>
      </div>
      <div className="store-item-description">
        <dl className="store-item-stats">
          <span>
            <dt>Description</dt>
            <dd>{item.description}</dd>
          </span>
          {item.speed && (
          <span key={0}>
            <dt>Speed Rating</dt>
            <dd>{item.speed}</dd>
          </span>
          )}
          {item.damage && (
          <span key={1}>
            <dt>Damage Rating</dt>
            <dd>
              {item.damage}
              {' '}
              (
              {ItemSymbols('health', item.damage)}
              )
            </dd>
          </span>
          )}
          {item.protection && (
          <span key={2}>
            <dt>Armor Rating</dt>
            <dd>
              {item.protection}
              {' '}
              (
              {ItemSymbols('armor', item.protection)}
              )
            </dd>
          </span>
          )}
          {item.durability && (
          <span key={7}>
            <dt>Durability</dt>
            <dd>{item.durability}</dd>
          </span>
          )}
          {item.effects && (
          <span key={3}>
            <dt>Special Effects</dt>
            <dd>{item.effects}</dd>
          </span>
          )}
          {item.hungerFill && (
          <span key={4}>
            <dt>Food Rating</dt>
            <dd>
              {item.hungerFill}
              {' '}
              (
              {ItemSymbols('hunger', item.hungerFill)}
              )
            </dd>
          </span>
          )}
        </dl>
      </div>
      {isStore && <span className="add-cart material-icons md-36">add_shopping_cart</span>}
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
