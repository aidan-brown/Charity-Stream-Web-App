import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import All from './StoreTabs/All';

class StoreLanding extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <All />
        );  
    }
}

export default StoreLanding