import React from 'react';
import PropTypes from 'prop-types';
import { BACKENDURL } from '../../../App/constants';

const StoreMob = ({
  mob, addItemToCart, isStore, className,
}) => (
  <span tabIndex={0} role="button" className={`store-item bg-csh-tertiary ${className || ''}`} onClick={addItemToCart} onKeyDown={addItemToCart} data-disabled={mob.disabled}>
    <div className="store-item-header bg-csh-primary-gradient">
      <img className="store-item-image" src={`${BACKENDURL}/images/mobs/${mob.id}-full.jpg`} alt={mob.displayName} />
      <img className="store-item-icon" src={`${BACKENDURL}/images/mobs/${mob.id}.png`} alt={mob.displayName} />
      <p className="store-item-displayName">{mob.displayName}</p>
      <p className="store-item-price">
        $
        {mob.price.toFixed(2)}
      </p>
    </div>
    <div className="store-item-description">
      <dl className="store-item-stats">
        <span>
          <dt>Description</dt>
          <dd>{mob.description}</dd>
        </span>
      </dl>
    </div>
    {isStore && <span className="add-cart material-icons md-36">add_shopping_cart</span>}
  </span>
);

StoreMob.propTypes = {
  mob: PropTypes.shape({
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

StoreMob.defaultProps = {
  isStore: true,
  className: '',
};

export default StoreMob;
