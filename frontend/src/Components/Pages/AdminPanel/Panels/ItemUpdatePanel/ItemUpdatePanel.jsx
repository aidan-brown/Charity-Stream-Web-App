import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  IconButton,
  TextField,
} from '@mui/material';
import { TabPanel } from '@mui/lab';
import { Clear, Check, Delete } from '@mui/icons-material';
import StoreEffect from '../../../Store/StoreContent/StoreEffect';
import StoreMob from '../../../Store/StoreContent/StoreMob';
import StoreItem from '../../../Store/StoreContent/StoreItem';
import { getUrl, getReq } from '../../../../../Utils';
import './ItemUpdatePanel.scss';

const ItemUpdatePanel = ({ authHeader, setAlert }) => {
  const [toDisable, setToDisable] = useState([]);
  const [toPriceChange, setToPriceChange] = useState([]);
  const [filter, setFilter] = useState('');
  const [massPriceOverride, setMassPriceOverride] = useState(0);
  const [items, setItems] = useState([]);
  const [checkoutStatus, setCheckoutStatus] = useState(false);

  useEffect(() => {
    const getCheckoutStatus = () => {
      getReq(`${getUrl()}/checkout/status`)
        .then((res) => res.text())
        .then((res) => {
          setCheckoutStatus(res === 'true');
        }).catch(() => {
          setAlert({
            message: 'Could not get checkout status',
            severity: 'error',
          });
        });
    };

    getCheckoutStatus();
  }, []);

  useEffect(() => {
    const getElements = () => {
      getReq(`${getUrl()}/minecraft/all`)
        .then((res) => res.json())
        .then((res) => {
          setItems(res);
        }).catch(() => {
          setAlert({
            message: 'Could not get items from backend',
            severity: 'alert',
          });
        });
    };

    getElements();
  }, []);

  const disableItems = () => {
    fetch(`${getUrl()}/disable`, {
      method: 'PUT',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toDisable),
    }).then((res) => {
      if (res.status !== 200) {
        setAlert({
          message: 'Failed to toggle those items on/off',
          severity: 'error',
        });
      } else {
        setToDisable([]);
        setAlert({
          message: 'Successfully toggled those items on/off',
          severity: 'success',
        });
      }
    }).catch(() => {
      setAlert({
        message: 'Failed to toggle those items on/off',
        severity: 'error',
      });
    });
  };

  const changePrices = (prices) => {
    fetch(`${getUrl()}/price-overrides`, {
      method: 'PUT',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prices),
    }).then((res) => {
      if (res.status !== 200) {
        setAlert({
          message: 'Failed to change price',
          severity: 'error',
        });
      } else {
        setToPriceChange([]);
        setAlert({
          message: 'Success',
          severity: 'success',
        });
      }
    }).catch(() => {
      setAlert({
        message: 'Failed to change price',
        severity: 'error',
      });
    });
  };

  const disableCheckout = (status) => {
    fetch(`${getUrl()}/disable/checkout`, {
      method: 'PUT',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    }).then((res) => {
      if (res.status !== 200) {
        setAlert({
          message: 'Failed to Disable Checkout',
          severity: 'error',
        });
        setCheckoutStatus(!status);
      }
    }).catch(() => {
      setAlert({
        message: 'Failed to Disable Checkout',
        severity: 'error',
      });
      setCheckoutStatus(!status);
    });
  };

  const toggleDisabled = (item) => {
    setItems(items.map((el) => {
      if (el.id === item.id && el.type === item.type) {
        if (toDisable.find((i) => (i.id === item.id && i.type === item.type))) {
          setToDisable(toDisable.filter((i) => !(i.id === item.id && item.type === i.type)));
        } else {
          setToDisable([
            ...toDisable,
            {
              id: item.id,
              disabled: !item.disabled,
              type: item.type,
            },
          ]);
        }
        return {
          ...el,
          disabled: !item.disabled,
          type: item.type,
        };
      }
      return el;
    }));
  };

  const priceOverride = (item, index) => (item.priceOverride || toPriceChange.find(
    (p) => p.id === item.id && p.type === item.type,
  )
    ? (
      <div className="price-disable">
        <TextField
          className="price-input"
          label="Price Override"
          variant="outlined"
          size="small"
          type="number"
          value={(() => {
            const priceChange = toPriceChange.find(
              (p) => p.id === item.id && p.type === item.type,
            );

            if (priceChange) return priceChange.price;
            if (item.priceOverride) return item.priceOverride;
            return 0;
          })()}
          onChange={(e) => {
            const priceChangeIndex = toPriceChange.findIndex(
              (p) => p.id === item.id && p.type === item.type,
            );

            if (priceChangeIndex !== -1) {
              setToPriceChange([
                ...toPriceChange.slice(0, priceChangeIndex),
                {
                  ...toPriceChange[priceChangeIndex],
                  price: e.target.value,
                },
                ...toPriceChange.slice(priceChangeIndex + 1),
              ]);
            } else {
              setToPriceChange([
                ...toPriceChange,
                {
                  id: item.id,
                  type: item.type,
                  price: e.target.value,
                },
              ]);
            }
          }}
        />
        <Button
          className="price-update"
          variant="contained"
          disabled={!toPriceChange.find(
            (p) => p.id === item.id && p.type === item.type,
          )}
          onClick={() => {
            const priceChangeIndex = toPriceChange.findIndex(
              (p) => p.id === item.id && p.type === item.type,
            );

            changePrices([{
              id: item.id,
              type: item.type,
              price: toPriceChange[priceChangeIndex].price,
            }]);
            setToPriceChange([
              ...toPriceChange.slice(0, priceChangeIndex),
              {
                ...toPriceChange[priceChangeIndex],
                price: toPriceChange[priceChangeIndex].price,
              },
              ...toPriceChange.slice(priceChangeIndex + 1),
            ]);
            const newPrice = Number(toPriceChange[priceChangeIndex].price);

            setItems([
              ...items.slice(0, index),
              {
                ...items[index],
                priceOverride: newPrice === item.price ? null : newPrice,
              },
              ...items.slice(index + 1),
            ]);
          }}
        >
          Apply
        </Button>
        <IconButton
          className="price-delete"
          aria-label="delete"
          onClick={() => {
            changePrices([{
              id: item.id,
              type: item.type,
            }]);
            setToPriceChange(toPriceChange.filter(
              (p) => p.id !== item.id && p.type !== item.type,
            ));
            setItems([
              ...items.slice(0, index),
              {
                ...items[index],
                priceOverride: null,
              },
              ...items.slice(index + 1),
            ]);
          }}
        >
          <Delete />
        </IconButton>
      </div>
    )
    : (
      <Button
        className="price-disable-add"
        onClick={() => {
          setToPriceChange([
            ...toPriceChange,
            {
              id: item.id,
              price: item.price,
              type: item.type,
            },
          ]);
        }}
        color="success"
        variant="contained"
      >
        Add Price Override
      </Button>
    ));

  return (
    <TabPanel value="disabling-items">
      <div className="disabled-items">
        <div className="top-bar">
          <TextField
            className="search"
            variant="filled"
            placeholder="Search Items...."
            sx={{ width: '30%' }}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            label="Search Items"
          />
          <div className="mass-price-override">
            <TextField
              variant="filled"
              placeholder="Mass Price Override"
              label="Mass Price Override"
              type="number"
              onChange={(e) => {
                setMassPriceOverride(e.target.value);
              }}
            />
            <Button
              className="mass-price-button"
              variant="contained"
              color="secondary"
              onClick={() => {
                setItems(items.map((item) => ({ ...item, priceOverride: massPriceOverride })));
                changePrices(items.map((item) => ({
                  id: item.id,
                  type: item.type,
                  price: massPriceOverride,
                })));
              }}
            >
              Set Mass Override
            </Button>
            <Button
              className="mass-price-button"
              variant="contained"
              color="error"
              onClick={() => {
                setItems(items.map((item) => ({ ...item, priceOverride: null })));
                changePrices(items.map((item) => ({
                  id: item.id,
                  type: item.type,
                  price: null,
                })));
              }}
            >
              Clear Price Overrides
            </Button>
          </div>
          <Button
            className="toggle-button"
            disabled={toDisable.length === 0}
            variant="contained"
            color="secondary"
            onClick={disableItems}
          >
            Toggle Selected
          </Button>
          <Button
            className="toggle-button"
            variant="contained"
            color={checkoutStatus ? 'inherit' : 'secondary'}
            endIcon={checkoutStatus ? <Clear /> : <Check />}
            onClick={() => {
              setCheckoutStatus(!checkoutStatus);
              disableCheckout(!checkoutStatus);
            }}
          >
            Checkout
            {checkoutStatus ? ' Disabled' : ' Enabled'}
          </Button>
        </div>
        <div className="StoreContent">
          {items
            .filter((i) => (JSON.stringify(Object.values(i)).includes(filter)))
            .filter(({ type }) => type !== 'mob' && type !== 'effect')
            .map((item, index) => (
              <div key={`${item.type}-${item.id}`} className="item">
                <StoreItem
                  className={toDisable.find((d) => d.id === item.id) ? 'selected' : null}
                  isStore={false}
                  item={item}
                  addItemToCart={() => toggleDisabled(item)}
                  key={item.id}
                />
                {priceOverride(item, index)}
              </div>
            ))}
          {items
            .filter((i) => (JSON.stringify(Object.values(i)).includes(filter)))
            .filter(({ type }) => type === 'mob')
            .map((mob, index) => (
              <div key={`${mob.type}-${mob.id}`} className="item">
                <StoreMob
                  isStore={false}
                  mob={mob}
                  addItemToCart={() => toggleDisabled(mob)}
                  key={mob.id}
                />
                {priceOverride(mob, index)}
              </div>
            ))}
          {items
            .filter((i) => (JSON.stringify(Object.values(i)).includes(filter)))
            .filter(({ type }) => type === 'effect')
            .map((effect, index) => (
              <div key={`${effect.type}-${effect.id}`} className="item">
                <StoreEffect
                  isStore={false}
                  effect={effect}
                  addItemToCart={() => toggleDisabled(effect)}
                  key={effect.id}
                />
                {priceOverride(effect, index)}
              </div>
            ))}
        </div>
      </div>
    </TabPanel>
  );
};

ItemUpdatePanel.propTypes = {
  authHeader: PropTypes.string.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default ItemUpdatePanel;
