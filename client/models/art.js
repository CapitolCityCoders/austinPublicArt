import fetch from 'isomorphic-fetch';
import secret from '../../secret'

export function getArt() {
  let obj = {
    method: 'GET'
  };
  return fetch('api/art', obj)
    .then((artwork) => {
      return artwork.json()
    })
    .catch(err => console.log(err))
}

export function getLikes(artId) {
  let obj = {
    method: 'GET'
  };
  return fetch(`api/like/${artId}`, obj)
    .then((artwork) => {
      return artwork.json()
    })
    .catch(err => console.log(err))
}

export function getCoords(address) {
  return fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address},+Austin,+TX&key=${secret}`)
    .then((response) => {
      return response.json();
    })
    .catch(err => console.log(err))
}
