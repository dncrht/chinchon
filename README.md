# What is this?

A web/hybrid application to tally up the scores on card games, specifically crafted for the _chinchón_ spanish card game.

In a broader sense, it's my playground to practise [React](https://facebook.github.io/react/), [node.js](https://nodejs.org/en/) and [cordova](https://cordova.apache.org).

# How to develop?

For a pleasant development experience, launch the following:
```bash
npm start
```
…to run the local web server

```bash
webpack -d --watch
```
…to compile bundle files on every change

```bash
browser-sync start --proxy 'localhost:3000' --files 'www/bundle*'
```
…to automatically reload the browser on every change (you need `npm install -g browser-sync` to be installed beforehand).

# What's needed to deploy?

On production environments (eg: Heroku), it needs the following environmental variables:
```bash
NODE_ENV=production
NPM_CONFIG_PRODUCTION=true
```
