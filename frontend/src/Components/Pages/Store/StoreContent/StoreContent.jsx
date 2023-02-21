import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import StoreItem from './StoreItem';
import { getMinecraftData } from '../../../../api';
import { getApiUrl } from '../../../../Utils';
import './StoreContent.scss';

const StoreContent = ({
  filterTag, addItemToCart, className,
}) => {
  const { data: { data: items = [] } = {} } = useQuery([`item_data_${filterTag}`], () => getMinecraftData(filterTag));

  return (
    <div className={`StoreContent${className ? ` ${className}` : ''}`}>
      {items.map((item) => {
        const { id, type } = item;

        return (
          <StoreItem
            item={item}
            addItemToCart={() => {
              addItemToCart({
                ...item,
                amount: 1,
                ...(type === 'effect' && { time: 30, power: 0 }),
                icon: `${getApiUrl()}/images/${type}/${id}.webp`,
                img: `${getApiUrl()}/images/${type}/${id}-full.webp`,
              });
            }}
            key={`${id}-${type}`}
          />
        );
      })}
    </div>
  );
};

StoreContent.propTypes = {
  filterTag: PropTypes.string.isRequired,
  className: PropTypes.string,
  addItemToCart: PropTypes.func.isRequired,
};

StoreContent.defaultProps = {
  className: null,
};

export default StoreContent;
