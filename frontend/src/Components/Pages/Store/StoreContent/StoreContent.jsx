import React, {useState, useEffect} from 'react';
import {BACKENDURL} from '../../../App/constants';
import PLACEHOLDER from '../../../../images/256-full.jpg'

import './StoreContent.css';

const StoreContent = ({filterTag, addItemToCart}) => {
    const[items, setItems] = useState([]);
    const[effects, setEffects] = useState([]);
    const[mobs, setMobs] = useState([]);

    useEffect(() => {
        fetch(`${BACKENDURL}/items`)
        .then(res => res.json())
        .then(res => {
            setItems(res);
        })
        .catch(err => console.error(err))
        fetch(`${BACKENDURL}/mobs`)
        .then(res => res.json())
        .then(res => {
            setMobs(res);
        })
        .catch(err => console.error(err))
        fetch(`${BACKENDURL}/effects`)
        .then(res => res.json())
        .then(res => {
            setEffects(res);
        })
        .catch(err => console.error(err))
    }, []);

    return(
        <div className='StoreContent'>
            {items.filter(item => filterTag === 'all' || item.type === filterTag).map((item, index) => {
                return <StoreItem item={item} addItemToCart={() => addItemToCart({...item, amount: 1, icon: `${BACKENDURL}/images/items/${item.id}.png`, img: `${BACKENDURL}/images/items/${item.id}-full.jpg`})} key={index} />
            })}
            {mobs.filter(mob => filterTag === 'all' || filterTag === 'mobs').map((mob, index) => {
                return <StoreMob mob={mob} addItemToCart={() => addItemToCart({...mob, amount: 1, icon: `${BACKENDURL}/images/mobs/${mob.id}.png`, img: `${BACKENDURL}/images/mobs/${mob.id}-full.jpg`, type: 'mob'})} key={index}/>
            })}
            {effects.filter(effect => filterTag === 'all' || filterTag === 'effects').map((effect, index) => {
                return <StoreEffect effect={effect} addItemToCart={() => addItemToCart({...effect, time: 30, power: 0, icon: `${BACKENDURL}/images/effects/${effect.id}.png`, img: `${BACKENDURL}/images/effects/${effect.id}-full.jpg`, type: 'effect'})} key={index}/>
            })}
        </div>
    );
}

const StoreItem = ({item, addItemToCart}) => {
    let additionalDescriptors = [];
    switch(item.type){
        case 'tool':
            additionalDescriptors.push(
                <span key={0}>
                    <dt>Speed Rating</dt>
                    <dd>{item.speed}</dd>
                </span>);
            additionalDescriptors.push(
                <span key={7}>
                    <dt>Durability</dt>
                    <dd>{item.durability}</dd>
                </span>);
            break;
            
        case 'weapon':
            additionalDescriptors.push(
                <span key={1}>
                    <dt>Damage Rating</dt>
                    <dd>{item.damage}</dd>
                </span>);
            additionalDescriptors.push(
                <span key={6}>
                    <dt>Durability</dt>
                    <dd>{item.durability}</dd>
                </span>);
            break;

        case 'armor':
            additionalDescriptors.push(
                <span key={2}>
                    <dt>Armor Rating</dt>
                    <dd>{item.protection}</dd>
                </span>);
            additionalDescriptors.push(
                <span key={5}>
                    <dt>Durability</dt>
                    <dd>{item.durability}</dd>
                </span>);
            break;

        case 'food':
            additionalDescriptors.push(
                <span key={3}>
                    <dt>Special Effects</dt>
                    <dd>{item.effects}</dd>
                </span>);
            additionalDescriptors.push(
                <span key={4}>
                    <dt>Food Rating</dt>
                    <dd>{item.hungerFill}</dd>
                </span>);
            break;

        default:
            break;
    }

    return (
    <span className='store-item bg-csh-tertiary' onClick={addItemToCart}>
        <div className='store-item-header bg-csh-primary-gradient'>
            <img className='store-item-image' src={`${BACKENDURL}/images/items/${item.id}-full.jpg`} alt={item.name}></img>
            <img className='store-item-icon' src={`${BACKENDURL}/images/items/${item.id}.png`} alt={item.name}></img>
            <p className='store-item-name'>{item.name}</p>
            <p className='store-item-price'>${item.price.toFixed(2)}</p>
        </div>
        <div className='store-item-description'>
            <dl className='store-item-stats'>
                <span>
                    <dt>Description</dt>
                    <dd>{item.description}</dd>
                </span>
                {additionalDescriptors}
            </dl>
        </div>
        <span className='add-cart material-icons md-36'>add_shopping_cart</span>
    </span>
    );
}

const StoreMob = ({mob, addItemToCart}) => {

    return (
    <span className='store-item bg-csh-tertiary' onClick={addItemToCart}>
        <div className='store-item-header bg-csh-primary-gradient'>
            <img className='store-item-image' src={`${BACKENDURL}/images/mobs/${mob.id}-full.jpg`} alt={mob.name}></img>
            <img className='store-item-icon' src={`${BACKENDURL}/images/mobs/${mob.id}.png`} alt={mob.name}></img>
            <p className='store-item-name'>{mob.name}</p>
            <p className='store-item-price'>${mob.price.toFixed(2)}</p>
        </div>
        <div className='store-item-description'>
            <dl className='store-item-stats'>
                <span>
                    <dt>Description</dt>
                    <dd>{mob.description}</dd>
                </span>
            </dl>
        </div>
        <span className='add-cart material-icons md-36'>add_shopping_cart</span>
    </span>
    );
}

const StoreEffect = ({effect, addItemToCart}) => {

    return (
    <span className='store-item bg-csh-tertiary' onClick={addItemToCart}>
        <div className='store-item-header bg-csh-primary-gradient'>
            <img className='store-item-image' src={`${BACKENDURL}/images/effects/${effect.id}-full.jpg`} alt={effect.name}></img>
            <img className='store-item-icon' src={`${BACKENDURL}/images/effects/${effect.id}.png`} alt={effect.name}></img>
            <p className='store-item-name'>{effect.name}</p>
            <p className='store-item-price'>${effect.price.toFixed(2)}</p>
        </div>
        <div className='store-item-description'>
            <dl className='store-item-stats'>
                <span>
                    <dt>Description</dt>
                    <dd>{effect.description}</dd>
                </span>
            </dl>
        </div>

        <span className='add-cart material-icons md-36'>add_shopping_cart</span>
    </span>
    );
}

export default StoreContent;