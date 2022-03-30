import React from 'react';
import PropTypes from 'prop-types';
import { mdiCartPlus } from '@mdi/js';
import Icon from '@mdi/react';
import { getUrl } from '../../../../Utils';

const StoreMob = ({
  mob, addItemToCart, isStore, className,
}) => (
  <span tabIndex={0} role="button" className={`store-item bg-csh-tertiary ${className || ''}`} onClick={addItemToCart} onKeyDown={addItemToCart} data-disabled={mob.disabled}>
    <div className="store-item-header bg-csh-primary-gradient">
      <img className="store-item-image" src={`${getUrl()}/images/mobs/${mob.id}-full.png`} alt={mob.displayName} />
      <img className="store-item-icon" src={`${getUrl()}/images/mobs/${mob.id}.png`} alt={mob.displayName} />
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
    {isStore && <Icon path={mdiCartPlus} className="add-cart" />}
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
