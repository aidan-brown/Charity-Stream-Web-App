import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import StoreItem from './StoreItem';
import { getMinecraftData } from '../../../../api';
import { getApiUrl } from '../../../../Utils';
import './StoreContent.scss';

const StoreContent = ({
  filterTag, addItemToCart, className,
}) => {
  const { data: { data: items = [] } = {}, refetch } = useQuery(['item_data'], () => getMinecraftData(filterTag));

  useEffect(() => refetch(), [filterTag]);

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
