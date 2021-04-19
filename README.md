# CSH Minecraft Charity Stream Store

[Come check out the site](https://minecraftstream.csh.rit.edu/) for updates, new content, and to donate to charity!

## The Event

CSH's Annual Charity Minecraft Tournament is a competition between any number of players who sign up to fight through a series of Minecraft minigames. The players represent organizations from all over the Rochester Institute of Technology's campus, such as CSH, Engineering House, House of General Sciences, and, as thanks for their contributions on this project, employees of Blackbaud.
***
#### First Annual Tournament (April 12th, 2019)

We hosted our first tournament on April 12th of 2019, and it was broadcast on the [official JustGiving Twitch channel](https://www.twitch.tv/justgiving). With 18 players entering the initial round, our competitors fought through:
* Hunger Games
* The Walls
* Bed Wars
* Race for the Wool
* Spleef
In the end, we had a triumphant winner and had raised $300 for the Mental Health Association of Rochester!
---
#### Second Annual Tournament (TBD, 2020 (Delayed for COVID-19))

The second tournament is being hosted on May 17th, 2021, and will have new and improved features to update the flow of gameplay and make the best viewing/playing experience, including:
* Smoother website experience
* No server crashes
* New interface plugin
* Events in between minigames
* More minigames
* Interactive lobby maps with secrets
* More donation effect variety, including mobs and potion affects

## The Website

#### The Purpose

We developed [this site](https://minecraftstream.csh.rit.edu/), and originally [this website](https://github.com/crigney3/CharityStreamApp) to add a unique twist to a minecraft tournament. We wanted to create something so that donations would automatically change the course of the game. We came up with the idea of having donations grant items to players in the tournament. Thanks to our work on the site and our server, our first tournament resulted in some amazing swings caused by donations. 

#### How it works

The app uses NodeJs and React to generate a website that acts as a store. Once a user has gotten the items they want, they select a player, and then go through the regular, secure process of donating through JustGiving. Then, through a collaboration with JustGiving on the backend, the app checks to see if the user had any items attached to their donation. If they do, and the amount is compatible with the items, it sends a series of commands to listener on the minecraft server, which in turn run the commands.

##### Notes on the JustGiving App
The app I've mentioned in JustGiving's system is owned and created by JustGiving and the code is not FOSS. We helped by guiding functionality and consulting. This app still exists in their system, but you must have certain internal permissions to use/view it, as it is considered in Beta.

