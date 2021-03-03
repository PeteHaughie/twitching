# TWITCHER

A browser-based compositer for twitch streams and overlay control.

Prompted by how resource hungry or just outright broken the alternatives were I decided to move all of the compositing of live streams to the browser. Actual stream capturing goes to an external box (RPi4) but could be a screen capture via anything really if your computer were capable.

My set-up is such that I merely want to see the 1080p output on my screen as I have a capture dongle as a passthrough between the computer and the screen. The laptop main screen is displays the controller but hypothetically you could also connect to it over a network.

Must be run as localhost or the WebRTC security protocols won't allow the cams to display and it will appear to be broken.

It's also worth noting that there is no audio manipulation happening in the browser, you must route and mix your own audio outside of the compositor as I deem this out of scope.

@TODO:

* Add chromakey to video sources with sliders.

## TO think about…

If we add WebSockets the Twitcher won't be as portable as it currently is. If we *don't* add WebSockets it's unlikely we'll be able to interact with chat or add peripheral and remote machine control. If we can find a way of sending messages across a network from machine to machine without a server infrastructure then we'll go for that.

* Add websocket
* Move screen control to websockets
* Add support for chat interaction (via websocket)
* Add support for peripheral control (via websocket)
* Add support for remote machine control (via websocket)
