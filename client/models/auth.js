import fetch from 'isomorphic-fetch';


export function signUp(userData) {
  console.log(userData)
  let obj = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  }
  return fetch(`api/auth/signUp`, obj)
    .then(function(data){
      console.log(data)
      if (data.status<400){
        window.location.assign('/')
      }
      return data
    })
    // .then(function(data){
    //   console.log(data)
    //   if(data.status < 400) {
    //     window.location('/')
    //     })
    //   } else return data
    // })
}


export function login(userData) {
	let obj = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  }
  return fetch(`api/auth/login`, obj)
    .then(function(data){
      if(data.status < 400) {
        return data.json().then((data) => {
          document.cookie = "sessionId=" + data + ";path=/"
          return "Success"
        })
      } else return data
    })
}

export function likePhoto(artId) {
  let obj = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({cookie: document.cookie})
  }
  return fetch(`api/like/${artId}`, obj)
    .then(function(data){
      return data.json()
    })
}

export function favoritePhoto(artId) {
  let obj = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({cookie: document.cookie})
  }
  return fetch(`api/favorite/${artId}`, obj)
    .then(function(data){
      return data
    })
}

export function fetchFavs() {
  let obj = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'cookieHeader': document.cookie
    }
  }
return fetch(`api/favorite`, obj)
  .then(function(resp) {
    return resp.json()
  })
}

export function fetchUser() {
  let obj = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'cookieHeader': document.cookie
    }
  }
return fetch(`api/auth/user`, obj)
  .then(function(resp) {
    return resp.json()
  })
}

export function fetchUsername() {
  let obj = {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'cookieHeader': document.cookie
    }
  }
return fetch(`api/auth/username`, obj)
  .then(function(resp) {
    return resp.json()
  })
}

