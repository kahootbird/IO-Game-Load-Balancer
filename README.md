Websocket Load Balancer

About:

This is for a central server to route users to a connected server until the maximum number of users is reached, then it will proceed to route to other servers. It was coded for a Battle Royale IO game. *It may require some slight manual tweaking/testing to setup properly.

It also makes use of the free NPM maxmind database module to determine if users are from Europe, and if so, they are served a different webpage. This can be useful for implementing ads compliant with GDPR. The NPM database can be found here: https://www.npmjs.com/package/maxmind This portion could be commented out if not desired.


Usage:

The file path to GeoLite2-Country.mmdb from the NPM maxmind database mentioned above needs to work

Run the command "npm install" to setup

For a player to get the server number the "SN" command should be sent. That should then send a server number which should be stored client side as an IP address OR as an https address.

To get the total player count from the load balancer the "P" command should be sent.

A sample "killswitch" command is implemented to manually restart a server. It should be changed to something that cannot be guessed.

The sample command "conn" should be changed to something unguessable so a user cannot pose as a server.

When a server connects, the "conn" command is then sent to the load balancer with a server number and a player count. As it changes, the server should message the load balancer. When the count limit is reached, the server should then disconnect.
*An alternative way to handle this would be to have the load balancer keep track of the player count.
