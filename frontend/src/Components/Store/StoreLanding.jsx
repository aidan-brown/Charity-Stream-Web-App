import React, { Component } from 'react';
import All from './StoreTabs/All';

class StoreLanding extends Component{
    constructor(props){
        super(props);
        this.items = [];
    }

    render(){
        return(
            <div className="StoreLanding">
                <All items={this.items}/>
            </div>
        )
    }
}

export default StoreLanding;