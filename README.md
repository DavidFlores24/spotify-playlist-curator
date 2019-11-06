This is the JS version of the Spotify playlist curator developed using ReactJS

## Features
- Get playlists from user
- Create new playlist based on selected playlist and specific duration
- Export to Spotify

## Requirements
- Register a new application on the Spotify Developer Dashboard https://developer.spotify.com/dashboard/login
- Whitelist the following uri <YOUR_LOCAL_IP>:3000/home
- Copy the Client ID for your new registered app from the dashboard

## Required Code Changes
- On `src/containers/Login/index.js` change the following lines:
`10 const localIp = <YOUR_LOCAL_IP>`
`11 const client_id = <YOUR_CLIENT_ID>`

## Installing
```
yarn
yarn start
```
The app will now be running on `http://localhost:3000`
