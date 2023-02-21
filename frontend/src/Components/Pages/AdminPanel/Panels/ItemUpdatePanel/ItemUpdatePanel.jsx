import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  IconButton,
  InputLabel,
  FormControl,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import { TabPanel } from '@mui/lab';
import { Clear, Check, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import StoreItem from '../../../Store/StoreContent/StoreItem';
import {
  checkoutDisable,
  disableItem,
  pricesOverride,
  getCheckoutStatus,
  getMinecraftData,
} from '../../../../../api';
import './ItemUpdatePanel.scss';

const ItemUpdatePanel = ({ setAlert }) => {
  const navigate = useNavigate();

  const [toDisable, setToDisable] = useState([]);
  const [toPriceChange, setToPriceChange] = useState([]);
  const [filter, setFilter] = useState('');
  const [gameMode, setGameMode] = useState('select');
  const [overrideToggle, setOverrideToggle] = useState('mass');
  const [massPriceOverride, setMassPriceOverride] = useState(0);
  const [items, setItems] = useState([]);
  const [checkoutStatus, setCheckoutStatus] = useState(false);

  useQuery(
    ['checkout-status'],
    () => getCheckoutStatus(),
    {
      onSuccess: (status) => {
        setCheckoutStatus(status);
      },
      onError: () => {
        setAlert({
          message: 'Could not get checkout status',
          severity: 'error',
        });
      },
    },
  );

  useQuery(
    ['minecraft-items'],
    () => getMinecraftData(),
    {
      onSuccess: (newItems) => {
        setItems(newItems);
      },
      onError: () => {
        setAlert({
          message: 'Could not get items from backend',
          severity: 'error',
        });
      },
    },
  );

  const disableItems = async () => {
    try {
      if (await disableItem(toDisable)) {
        setToDisable([]);
        setAlert({
          message: 'Successfully toggled those items on/off',
          severity: 'success',
        });
      } else {
        setAlert({
          message: 'Failed to toggle those items on/off',
          severity: 'error',
        });
      }
    } catch (err) {
      if (err === 'REDIRECT_TO_LOGIN') {
        navigate('/login');
      }
    }
  };

  const changePrices = async (prices) => {
    try {
      if (await pricesOverride(prices)) {
        setToPriceChange([]);
        setAlert({
          message: 'Success',
          severity: 'success',
        });
      } else {
        setAlert({
          message: 'Failed to change price',
          severity: 'error',
        });
      }
    } catch (err) {
      if (err === 'REDIRECT_TO_LOGIN') {
        navigate('/login');
      }
    }
  };

  const disableCheckout = async (status) => {
    try {
      if (!await checkoutDisable(status)) {
        setAlert({
          message: 'Failed to Disable Checkout',
          severity: 'error',
        });
        setCheckoutStatus(!status);
      }
    } catch (err) {
      if (err === 'REDIRECT_TO_LOGIN') {
        navigate('/login');
      }
    }
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

  const priceOverride = (item) => (item.priceOverride !== null || toPriceChange.find(
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
            if (item.priceOverride !== null) return item.priceOverride;
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

            const newPrice = toPriceChange[priceChangeIndex].price < 0
              ? 0 : Number(toPriceChange[priceChangeIndex].price);

            changePrices([{
              id: item.id,
              type: item.type,
              price: newPrice,
            }]);
            setToPriceChange([
              ...toPriceChange.slice(0, priceChangeIndex),
              {
                ...toPriceChange[priceChangeIndex],
                price: newPrice,
              },
              ...toPriceChange.slice(priceChangeIndex + 1),
            ]);

            setItems(
              items.map((i) => {
                if (i.id === item.id) {
                  return {
                    ...i,
                    priceOverride: newPrice === Number(item.price) ? null : newPrice,
                  };
                }
                return i;
              }),
            );
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
            setItems(
              items.map((i) => {
                if (i.id === item.id) {
                  return {
                    ...i,
                    priceOverride: null,
                  };
                }
                return i;
              }),
            );
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
    <TabPanel value="update-items">
      <div className="disabled-items">
        <div className="top-bar">
          <TextField
            className="search"
            variant="filled"
            placeholder="Search Items...."
            sx={{ width: '20%' }}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            label="Search Items"
            value={filter}
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
            <Select
              value={overrideToggle}
              label="Type"
              onChange={(e) => {
                setOverrideToggle(e.target.value);
              }}
            >
              <MenuItem value="mass">Mass</MenuItem>
              <MenuItem value="percent">Percent</MenuItem>
            </Select>
            <Button
              className="mass-price-button"
              variant="contained"
              color="secondary"
              onClick={() => {
                setItems(items.map((item) => ({
                  ...item,
                  priceOverride: overrideToggle === 'mass'
                    ? massPriceOverride
                    : (Number(item.price) * ((100 - massPriceOverride) / 100)).toFixed(2),
                })));
                changePrices(items.map((item) => ({
                  id: item.id,
                  type: item.type,
                  price: overrideToggle === 'mass'
                    ? massPriceOverride
                    : (Number(item.price) * ((100 - massPriceOverride) / 100)).toFixed(2),
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
          <FormControl>
            <InputLabel id="gamemode-select-label">Gamemode</InputLabel>
            <Select
              labelId="gamemode-select-label"
              value={gameMode}
              label="Game Mode"
              onChange={(e) => {
                setGameMode(e.target.value);
                switch (e.target.value) {
                  case 'select': break;
                  case 'hunger-games': {
                    const newToDisabled = [];
                    setItems(items.map((item) => {
                      let disabledToggle = false;
                      const { id, type, disabled } = item;

                      if (id === 'mining_fatigue') disabledToggle = true;
                      else if (id === 'haste') disabledToggle = true;
                      else if (id.includes('_pickaxe')) disabledToggle = true;
                      else if (id.includes('_shovel') && type === 'tool') disabledToggle = true;

                      if (disabled || disabledToggle) {
                        newToDisabled.push({
                          id,
                          disabled: disabledToggle,
                          type,
                        });
                      }

                      return {
                        ...item,
                        disabled: disabledToggle,
                      };
                    }));

                    setFilter('true');
                    setToDisable(newToDisabled);
                    break;
                  }
                  case 'bed-wars': {
                    const newToDisabled = [];
                    setItems(items.map((item) => {
                      let disabledToggle = false;
                      const { id, type, disabled } = item;

                      if (type === 'material') disabledToggle = true;
                      else if (type === 'mob' && id !== 'lightning_bolt') disabledToggle = true;
                      if (disabled || disabledToggle) {
                        newToDisabled.push({
                          id,
                          disabled: disabledToggle,
                          type,
                        });
                      }

                      return {
                        ...item,
                        disabled: disabledToggle,
                      };
                    }));

                    setFilter('true');
                    setToDisable(newToDisabled);
                    break;
                  }
                  default: {
                    const newToDisabled = [];
                    setItems(items.map((item) => {
                      const { disabled, id, type } = item;
                      if (disabled) {
                        newToDisabled.push({ id, disabled: false, type });
                      }

                      return {
                        ...item,
                        disabled: false,
                      };
                    }));

                    setFilter('');
                    setToDisable(newToDisabled);
                    break;
                  }
                }
              }}
            >
              <MenuItem value="select">No Game Mode</MenuItem>
              <MenuItem value="none">Reset</MenuItem>
              <MenuItem value="hunger-games">Hunger Games</MenuItem>
              <MenuItem value="sky-wars">Sky Wars</MenuItem>
              <MenuItem value="bed-wars">Bed Wars</MenuItem>
            </Select>
          </FormControl>
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
            .map((item) => (
              <div key={`${item.type}-${item.id}`} className="item">
                <StoreItem
                  className={toDisable.find((d) => d.id === item.id && d.type === item.type) ? 'selected' : null}
                  isStore={false}
                  item={item}
                  addItemToCart={() => toggleDisabled(item)}
                  key={item.id}
                />
                {priceOverride(item)}
              </div>
            ))}
        </div>
      </div>
    </TabPanel>
  );
};

ItemUpdatePanel.propTypes = {
  setAlert: PropTypes.func.isRequired,
};

export default ItemUpdatePanel;
