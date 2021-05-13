import React, {useState, useEffect} from 'react';
import Placeholder from '../../../../images/placeholder.png';
import {BACKENDURL} from '../../../App/constants';

import './StoreContent.css';

const Store = ({filterTag, addItemToCart}) => {
    const[items, setItems] = useState([]);
    const[itemElem, setItemElem] = useState({});

    useEffect(() => {
        fetch(`${BACKENDURL}/items`)
        .then(res => res.json())
        .then(res => {
            console.log(res)
            setItems(res);
            const counters = {};

            res.forEach((_, index) => {
                counters[index] = 1;
            })
            setItemElem(counters);
        })
        .catch(err => console.error(err))
    }, []);

    return(
        <div className='StoreContent'>
            {items.filter(item => filterTag === 'all' || item.type === filterTag).map((item, index) => {
                return <span key={index} className='store-item bg-csh-primary-gradient'>
                        <p className='item-name'>{item.name}</p>
                        <div className='item-image'>
                            <img src={Placeholder} alt='item placeholder'></img>
                        </div>
                        <dl className='item-stats'>
                            
                        </dl>
                        <div className='item-price'>
                            <p>Amount:</p>
                            <span className='item-amount'>
                                <button disabled={itemElem[index] <= 1} onClick={() => setItemElem({...itemElem, [index]: itemElem[index] - 1})}>-</button>
                                {itemElem[index]}
                                <button onClick={() => setItemElem({...itemElem, [index]: itemElem[index] + 1})}>+</button>
                            </span>
                            <p className='item-price'>Price: ${(itemElem[index] * item.price).toFixed(2)}</p>
                        </div>
                        <span className='add-cart material-icons' onClick={() => addItemToCart({...item, amount: itemElem[index]})}>add_shopping_cart</span>
                    </span>
            })}
        </div>
    );
}

export default Store;