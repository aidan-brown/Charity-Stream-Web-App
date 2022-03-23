import React from 'react';
import PropTypes from 'prop-types';
import { BACKENDURL } from '../../../App/constants';

const StoreItem = ({ item, addItemToCart }) => {
  const additionalDescriptors = [];
  switch (item.type) {
    case 'tool':
      additionalDescriptors.push(
        <span key={0}>
          <dt>Speed Rating</dt>
          <dd>{item.speed}</dd>
        </span>,
      );
      additionalDescriptors.push(
        <span key={7}>
          <dt>Durability</dt>
          <dd>{item.durability}</dd>
        </span>,
      );
      break;

    case 'weapon':
      additionalDescriptors.push(
        <span key={1}>
          <dt>Damage Rating</dt>
          <dd>{item.damage}</dd>
        </span>,
      );
      additionalDescriptors.push(
        <span key={6}>
          <dt>Durability</dt>
          <dd>{item.durability}</dd>
        </span>,
      );
      break;

    case 'armor':
      additionalDescriptors.push(
        <span key={2}>
          <dt>Armor Rating</dt>
          <dd>{item.protection}</dd>
        </span>,
      );
      additionalDescriptors.push(
        <span key={5}>
          <dt>Durability</dt>
          <dd>{item.durability}</dd>
        </span>,
      );
      break;

    case 'food':
      additionalDescriptors.push(
        <span key={3}>
          <dt>Special Effects</dt>
          <dd>{item.effects}</dd>
        </span>,
      );
      additionalDescriptors.push(
        <span key={4}>
          <dt>Food Rating</dt>
          <dd>{item.hungerFill}</dd>
        </span>,
      );
      break;

    default:
      break;
  }

  return (
    <span tabIndex={0} role="button" className="store-item bg-csh-tertiary" onClick={addItemToCart} onKeyDown={addItemToCart} data-disabled={item.disabled}>
      <div className="store-item-header bg-csh-primary-gradient">
        <img className="store-item-image" src={`${BACKENDURL}/assets/items/${item.id}-full.jpg`} alt={item.displayName} />
        <img className="store-item-icon" src={`${BACKENDURL}/assets/items/${item.id}.png`} alt={item.displayName} />
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
          {additionalDescriptors}
        </dl>
      </div>
      <span className="add-cart material-icons md-36">add_shopping_cart</span>
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
};

export default StoreItem;
