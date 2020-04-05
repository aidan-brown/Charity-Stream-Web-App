import React, { Component } from 'react';
import arrow from '../../images/arrow.png'
import bow from '../../images/Bow.png'
import bread from '../../images/Bread.png'
import diamond_axe from '../../images/diamond_axe.png'
import diamond_boots from '../../images/diamond_boots.png'
import diamond_leggings from '../../images/diamond_leggings.png'
import diamond_chest from '../../images/diamond_chestplate.png'
import diamond_helm from '../../images/diamond_helmet.png'
import diamond_pick from '../../images/diamond_pickaxe.png'
import diamond_shovel from '../../images/diamond_shovel.png'
import diamond_sword from '../../images/diamond_sword.png'
import diamond from '../../images/diamond.png'
import gold_ingot from '../../images/gold_ingot.png'
import golden_apple from '../../images/golden_apple.png'
import golden_axe from '../../images/golden_axe.png'
import golden_boots from '../../images/golden_boots.png'
import golden_chestplate from '../../images/golden_chestplate.png'
import golden_god_apple from '../../images/golden_god_apple.png'
import golden_helmet from '../../images/golden_helmet.png'
import golden_leggings from '../../images/golden_leggings.png'
import golden_pickaxe from '../../images/golden_pickaxe.png'
import golden_shovel from '../../images/golden_shovel.png'
import iron_axe from '../../images/iron_axe.png'
import iron_boots from '../../images/iron_boots.png'
import iron_chestplate from '../../images/iron_chestplate.png'
import iron_helmet from '../../images/iron_helmet.png'
import iron_ingot from '../../images/iron_ingot.png'
import iron_leggings from '../../images/iron_leggings.png'
import iron_pickaxe from '../../images/iron_pickaxe.png'
import iron_shovel from '../../images/iron_shovel.png'
import iron_sword from '../../images/iron_sword.png'
import leather_boots from '../../images/leather_boots.png'
import leather_chestplate from '../../images/leather_chestplate.png'
import leather_helmet from '../../images/leather_helmet.png'
import leather_leggings from '../../images/leather_leggings.png'
import steak from '../../images/steak.png'
import stone_sword from '../../images/stone_sword.png'

class ImageArray extends Component{
    constructor(props){
        super(props)
        let images = {
            "Bow": bow,
            "Iron Ingot": iron_ingot,
            "Gold Ingot": gold_ingot,
            "Diamond": diamond,
            "Iron Pickaxe": iron_pickaxe,
            "Gold Pickaxe": golden_pickaxe,
            "Diamond Pickaxe": diamond_pick,
            "Iron Shovel": iron_shovel,
            "Gold Shovel": golden_shovel,
            "Diamond Shovel": diamond_shovel,
            "Iron Axe": iron_axe,
            "Gold Axe": golden_axe,
            "Diamond Axe": diamond_axe,
            "Bread": bread,
            "Steak": steak,
            "Golden Apple": golden_apple,
            "Golden 'God' Apple": golden_god_apple,
            "Stone Sword": stone_sword,
            "Iron Sword": iron_sword,
            "Diamond Sword": diamond_sword,
            "10x Arrows": arrow,
            "Leather Helmet": leather_helmet,
            "Leather Chestplate": leather_chestplate,
            "Leather Leggings": leather_leggings,
            "Leather Boots": leather_boots,
            "Gold Helmet": golden_helmet,
            "Gold Chestplate": golden_chestplate,
            "Gold Leggings": golden_leggings,
            "Gold Boots": golden_boots,
            "Iron Helmet": iron_helmet,
            "Iron Chestplate": iron_chestplate,
            "Iron Leggings": iron_leggings,
            "Iron Boots": iron_boots,
            "Diamond Helmet": diamond_helm,
            "Diamond Chestplate": diamond_chest,
            "Diamond Leggings": diamond_leggings,
            "Diamond Boots": diamond_boots
        }       
    }
            
}
  
export default ImageArray;

