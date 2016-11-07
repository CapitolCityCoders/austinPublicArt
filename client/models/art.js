import fetch from 'isomorphic-fetch';

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
  let obj = {
    method: 'GET'
  };
  return fetch(`api/coordinates/:${address}`, obj)
    .then(response => response.json() ) // response.json() returns a promise
    .then( response => response )
    .catch(err => console.log(err))
}