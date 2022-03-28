import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TextField,
} from '@mui/material';
import { TabPanel } from '@mui/lab';
import StoreEffect from '../../../Store/StoreContent/StoreEffect';
import StoreMob from '../../../Store/StoreContent/StoreMob';
import StoreItem from '../../../Store/StoreContent/StoreItem';
import { getUrl, getReq } from '../../../../../Utils';
import './ItemDisablePanel.scss';

const ItemDisablePanel = ({ authHeader, setAlert }) => {
  const [toDisable, setToDisable] = useState([]);
  const [filter, setFilter] = useState('');
  const [items, setItems] = useState([]);

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
        message: 'Could not disabled those items',
        severity: 'alert',
      });
    });
  };

  const toggleDisabled = (item) => {
    setItems(items.map((el) => {
      if (el.id === item.id) {
        if (toDisable.find((i) => i.id === item.id)) {
          setToDisable(toDisable.filter((i) => i.id !== item.id));
        } else {
          setToDisable([...toDisable, {
            id: item.id,
            disabled: !item.disabled,
          }]);
        }
        return {
          ...el,
          disabled: !item.disabled,
        };
      }
      return el;
    }));
  };

  return (
    <TabPanel value="disabling-items">
      <div className="disabled-items">
        <div className="search-bar">
          <TextField
            variant="filled"
            placeholder="Search Items...."
            sx={{ width: '30%' }}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          />
        </div>
        <div className="StoreContent">
          {items
            .filter((i) => (JSON.stringify(Object.values(i)).includes(filter)))
            .filter(({ type }) => type !== 'mob' && type !== 'effect')
            .map((item) => (
              <StoreItem
                className={toDisable.find((d) => d.id === item.id) ? 'selected' : null}
                isStore={false}
                item={item}
                addItemToCart={() => toggleDisabled(item)}
                key={item.id}
              />
            ))}
          {items
            .filter((i) => (JSON.stringify(Object.values(i)).includes(filter)))
            .filter(({ type }) => type === 'mob')
            .map((mob) => (
              <StoreMob
                isStore={false}
                mob={mob}
                addItemToCart={() => toggleDisabled(mob)}
                key={mob.id}
              />
            ))}
          {items
            .filter((i) => (JSON.stringify(Object.values(i)).includes(filter)))
            .filter(({ type }) => type === 'effect')
            .map((effect) => (
              <StoreEffect
                isStore={false}
                effect={effect}
                addItemToCart={() => toggleDisabled(effect)}
                key={effect.id}
              />
            ))}
        </div>
        <Button
          className="toggle-button"
          disabled={toDisable.length === 0}
          variant="contained"
          onClick={disableItems}
        >
          Toggle Selected
        </Button>
      </div>
    </TabPanel>
  );
};

ItemDisablePanel.propTypes = {
  authHeader: PropTypes.string.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default ItemDisablePanel;
