import React, { Component } from 'react';
import All from './StoreTabs/All';

class StoreLanding extends Component{
    constructor(props){
        super(props);
        this.items = [{
            "id": 1,
            "name": "Iron Ingot",
            "description": "An ingot full of potential. Can be used to craft iron armor, weapons, and tools.",
            "price": 0.25,
            "type": {
                "name": "material"
            }
        },
        {
            "id": 2,
            "name": "Gold Ingot",
            "description": "An ingot full of potential. Can be used to craft gold armor, weapons, and tools.",
            "price": 0.20,
            "type": {
                "name": "material"
            }
        },
        {
            "id": 3,
            "name": "Diamond",
            "description": "A shiny gem. Can be used to craft powerful diamond armor, weapons, and tools.",
            "price": 1.00,
            "type": {
                "name": "material"
            }
        }
        ];
        this.weapons = [
            {
                "id": 17,
                "name": "Stone Sword",
                "description": "The basic weapon for combat. Help your favorite player triump in battle!",
                "price": 0.30,
                "type": {
                    "name": "weapon",
                    "damage": 5,
                    "durability": 131
                }
            },
            {
                "id": 18,
                "name": "Iron Sword",
                "description": "An upgraded sword for combat. Help your favorite player triump in battle!",
                "price": 0.50,
                "type": {
                    "name": "weapon",
                    "damage": 6,
                    "durability": 250
                }
            },
            {
                "id": 19,
                "name": "Diamond Sword",
                "description": "The ultimate sword for combat. Help your favorite player triump in battle with style!",
                "price": 2.00,
                "type": {
                    "name": "weapon",
                    "damage": 7,
                    "durability": 1561
                }
            },
            {
                "id": 20,
                "name": "Bow",
                "description": "Minecraft's signature ranged weapon. Can take out foes at a distance!",
                "price": 1.50,
                "type": {
                    "name": "weapon",
                    "damage": 6,
                    "durability": 384
                }
            }
        ]
    }
    

    render(){
        return(
            <div className="StoreLanding">
                <All items={this.items} weapons={this.weapons}/>
            </div>
        )
    }
}

export default StoreLanding;