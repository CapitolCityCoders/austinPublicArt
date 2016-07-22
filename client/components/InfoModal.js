import React from 'react'
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import ReactSpinner from 'react-spinjs';
import NavBar from './NavBar'
import Slider from 'react-slick'
import * as auth from '../models/auth'
import * as art from '../models/art'
import {Link} from 'react-router';
import App from './App'

export default class InfoModal extends React.Component {
  constructor() {
    super()
    this.state = {
      userFavs: [],
      userId: null,
      address: '',
    }
  }

  componentWillMount() {
    if(document.cookie) {
      this.findFavs()
      this.getUserId()
    }
    console.log(this.props.currentArt)
    this.state.address = this.props.currentArt['Art Location Street Address'].replace(/ /g, '+').replace(/;/g, '+')
  }

  findFavs() {
    auth.fetchFavs()
    .then((res) => {
      this.setState({userFavs : res.map((obj) => obj.artId)})
    })
  }

  getUserId() {
    auth.fetchUser()
    .then((res) => {
      this.setState({userId: res})
    })
  }

  //The info modal that pops up with the props currentArt set as the object of the work of art you clicked on
  render() {
    let images = this.props.parseImageUrl(this.props.currentArt.Images);
    let settings = {
      dots: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true
    };
    if(images.length === 1) settings.arrows = false
    return (

      <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="info">

            <h2>{this.props.currentArt['Art Title']}</h2>
            <p>
              Artist: 
                <Link to={`/${this.props.currentArt['Artist Full Name']}`}>
                  {'' + this.props.currentArt['Artist Full Name']}
                </Link>
            </p>
            <p>Location: {this.props.currentArt['Art Location Name']}</p>
            {this.props.currentArt.likeCount ? 
              <p> Likes: {this.props.currentArt.likeCount.length}</p> : 
              null}

            <div className="slideContainer" >
              <Slider {...settings}>
                {images.map((x) => <div key={images.indexOf(x)}><img className="slideshowPicture" src={x} /></div>)}
              </Slider>
            </div>
              
              {this.props.currentArt.likeCount ? 
                <button className="btn btn-primary btn-sm" onClick={() => auth.likePhoto(this.props.currentArt._id)
                  .then((x) => {
                    return art.getLikes(this.props.currentArt._id)
                  })
                  .then((likeCount) => {
                    this.props.updateCurrent(likeCount)
                  })
                }>
                {/*Change button text based upon if the user has already liked an image*/}
                {this.props.currentArt.likeCount.includes(this.state.userId) ? "Unlike" : "Like"}
                </button> :
                null}
              

                <button className="btn btn-secondary btn-sm" onClick={() => auth.favoritePhoto(this.props.currentArt._id)
                  .then((x) => {
                    this.findFavs()
                  })
                }>{this.state.userFavs.includes(this.props.currentArt._id) ? "Unfav!" : "Fav!"}
                </button>
            <div className="mapContainer">
              <iframe
                width="600"
                height="450"
                frameBorder="0"
                src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyASx8uyd5unDD_nox3grraxCR0hi2L9ZYg&q="+this.state.address+",Austin+TX"} allowFullScreen>
              </iframe>
            </div>
          {/* Check if logged in (document.cookie?), if true display Like and Favorite button */}
            {document.cookie ?
              <div className="userFeatures">


              </div>
              : ''}

        </ModalDialog>
      </ModalContainer>
    )
  }
}
