# 🕹️ Breakoid
### Classic Breakout game in vanilla JavaScript.

## 🔨 Built with
__Breakoid__ has been built using [JavaScript](), [Bootstrap](https://getbootstrap.com/), [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) and [FreeSound audio library](https://freesound.org/).

## 🌟 Features
1. Developed using __JavaScript__.
1. _Dynamic level generator:_ every time a level is completed another Bricks' row is added.
1. _Random Hits:_ every brick has a __hits__ property that sets the amount of hits needed to break the block. It is a random number from from 1 to 3.
1. _Pick Ups:_ every brick has a __pick up__ property that randomly sets a pickup when is broken. The pick ups that can be set in a brick are the following: 
    1. _Extra life:_ an extra life for the player.
    1. _Slow down:_ ball slows down during a few seconds.
    1. _Speed up:_ ball speeds up for a few seconds.
    1. _Double size:_ paddle bar is doubled for a while.
    1. _Extra small:_ ball size is reduced for a few seconds.
    1. _Extra large:_ ball size is doubled during a few seconds. 
    1. _None:_ bricks can be set with a property which doesn't add any pick up.
1. Alerts are dynamically generated depending on the event to show. 
1. Every different event has been assigned with a sound effect. 

## 📝 License
__Breakoid__ is under _MIT License_. You can read the full license file [here](LICENSE).
