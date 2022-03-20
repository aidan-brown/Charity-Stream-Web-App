import React, { useEffect, useState } from 'react';
import {
  EmptyArmor,
  EmptyHeart,
  EmptyHunger,
  FullArmor,
  FullHeart,
  FullHunger,
  HalfArmor,
  HalfHeart,
  HalfHunger,
} from './Images';
import {BACKENDURL} from '../App/constants';
import { getReq } from '../../Utils';
import './PlayerData.css';

const PlayerData = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlayers = () => {
      getReq(`${BACKENDURL}/data`)
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          setPlayers([{
            armor: 0,
            health: 12.3333,
            hunger: 17,
            level: 0,
            username: 'awesomesauce6767',
          },
          {
            armor: 0,
            health: 12.3333,
            hunger: 17,
            level: 0,
            username: 'awesomesauce6767',
          },
          {
            armor: 0,
            health: 12.3333,
            hunger: 17,
            level: 0,
            username: 'awesomesauce6767',
          },
          {
            armor: 0,
            health: 12.3333,
            hunger: 17,
            level: 0,
            username: 'awesomesauce6767',
          },
          {
            armor: 0,
            health: 12.3333,
            hunger: 17,
            level: 0,
            username: 'awesomesauce6767',
          },
          {
            armor: 0,
            health: 12.3333,
            hunger: 17,
            level: 0,
            username: 'awesomesauce6767',
          },
          {
            armor: 0,
            health: 12.3333,
            hunger: 17,
            level: 0,
            username: 'awesomesauce6767',
          }]);
        })
        .catch(() => {
          setLoading(false);
        });
    };

    getPlayers();

    const playersPoll = setInterval(getPlayers, 2000);
    return () => clearInterval(playersPoll);
  }, []);

  if (loading) return null;

  return (
    <div className="flavor-text bg-csh-secondary-gradient">
      {players.length === 0 && (
      <div className="player-data">
        <h1 className="username">There are currently no players online</h1>
      </div>
      )}
      <div className="player-data">
        {players.map((player) => {
          const {
            username, health, armor, hunger,
          } = player;
          const barFunc = (images, alt, currentLevel, reverse = false) => {
            const rounded = Math.ceil(currentLevel);
            const bar = [];
            const empty = Math.floor((20 - rounded) / 2);
            const half = rounded % 2;
            const full = 10 - empty - half;

            /* eslint-disable no-plusplus */
            if (reverse) {
              for (let i = 0; i < empty; i++) bar.push(<img height="27px" width="27px" src={images[2]} alt={`Empty ${alt}`} />);
              if (half === 1) bar.push(<img height="27px" width="27px" src={images[1]} alt={`Half ${alt}`} />);
              for (let i = 0; i < full; i++) bar.push(<img height="27px" width="27px" src={images[0]} alt={`Full ${alt}`} />);
            } else {
              for (let i = 0; i < full; i++) bar.push(<img height="27px" width="27px" src={images[0]} alt={`Full ${alt}`} />);
              if (half === 1) bar.push(<img height="27px" width="27px" src={images[1]} alt={`Half ${alt}`} />);
              for (let i = 0; i < empty; i++) bar.push(<img height="27px" width="27px" src={images[2]} alt={`Empty ${alt}`} />);
            }
            /* eslint-enable no-plusplus */

            return bar;
          };

          const healthBar = barFunc([FullHeart, HalfHeart, EmptyHeart], 'Heart', health);
          const armorBar = barFunc([FullArmor, HalfArmor, EmptyArmor], 'Armor', armor * 2);
          const hungerBar = barFunc([FullHunger, HalfHunger, EmptyHunger], 'Hunger', hunger, true);

          return (
            <div>
              <h1 className="username">{username}</h1>
              <div className="stats">
                <div className="armor">
                  {armorBar}
                </div>
                <div>
                  <div className="health">
                    {healthBar}
                  </div>
                  <div className="hunger">
                    {hungerBar}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default PlayerData;
