import React, { Component } from 'react';
import StoreContent from './StoreContent/StoreContent';
import './Store.css';

let Icon = <svg className="icon" fill="white" enable-background="new 0 0 512 512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m495.891 418.109-70.162-70.162-77.782 77.781 70.163 70.163c21.479 21.479 56.303 21.479 77.782 0 21.478-21.479 21.478-56.303-.001-77.782z"/><path d="m220.622 433.657c3.838 0 7.678-1.465 10.606-4.394 5.858-5.858 5.858-15.355 0-21.213l-17.624-17.624 292.891-239.464c3.484-2.849 5.505-7.112 5.505-11.613v-124.349c0-8.284-6.716-15-15-15h-124.351c-4.501 0-8.764 2.021-11.613 5.505l-239.463 292.89-17.624-17.624c-5.857-5.857-15.355-5.858-21.213 0s-5.858 15.355 0 21.213l127.279 127.279c2.929 2.93 6.767 4.394 10.607 4.394zm197.99-361.482c5.857-5.858 15.355-5.858 21.213 0s5.858 15.355 0 21.213l-261.63 261.63-21.213-21.213z"/><path d="m93.891 495.891 70.162-70.162-77.781-77.782-70.163 70.163c-21.479 21.479-21.479 56.303 0 77.782 21.479 21.478 56.303 21.478 77.782-.001z"/><path d="m5.505 150.963 118.587 96.955 46.157-56.456-98.074-98.074c-5.858-5.857-5.858-15.355 0-21.213s15.355-5.858 21.213 0l95.946 95.946 47.291-57.842-85.662-104.774c-2.849-3.484-7.112-5.505-11.613-5.505h-124.35c-8.284 0-15 6.716-15 15v124.351c0 4.501 2.021 8.763 5.505 11.612z"/><path d="m408.051 280.772-17.624 17.624-6.756-8.263-39.792 32.533 11.139 11.139-21.213 21.213-13.268-13.268-40.839 33.389 18.698 15.287-17.624 17.624c-5.857 5.857-5.858 15.355 0 21.213s15.355 5.858 21.213 0l127.279-127.279c2.929-2.929 4.394-6.767 4.394-10.606 0-3.838-1.465-7.678-4.394-10.606-5.858-5.858-15.355-5.858-21.213 0z"/></svg>


/** Responsible for constructing the store page component **/
class Store extends Component{
    /*
    Handles the rendering of the component - Contains the routes to each of the content pages
    * @return {JSX Element} the store page
    */
    render(){
        return(
            <div className='Store'>
                <div className='store-window'>
                    <nav className='store-nav'>
                        <a id='a-all' className='store-link'>{Icon}All</a>
                        <a id='a-tools' className='store-link'>{Icon}Tools</a>
                        <a id='a-weapons' className='store-link'>{Icon}Weapons</a>
                        <a id='a-armor' className='store-link'>{Icon}Armor</a>
                        <a id='a-armor' className='store-link'>{Icon}Food</a>
                        <a id='a-armor' className='store-link'>{Icon}Buffs</a>
                        <a id='a-armor' className='store-link'>{Icon}Materials</a>
                        <a id='a-armor' className='store-link'>{Icon}Kits</a>
                    </nav>
                    <StoreContent/>
                </div>
            </div>
        );
    }
}

export default Store;