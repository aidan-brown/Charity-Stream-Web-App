import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ImageArray from './ImageArray'
import All from './StoreTabs/All';

class StoreLanding extends Component{
    constructor(props){
        super(props);
    }

    render(){

        return (
            <All imgs={ImageArray.images}/>
        );  
    }
}

export default StoreLanding