import React from 'react'
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import ReactSpinner from 'react-spinjs';
import SearchInput, {createFilter} from 'react-search-input'
import NavBar from './NavBar'
import Slider from 'react-slick'
import * as auth from '../models/auth'
import * as art from '../models/art'


const KEYS_TO_FILTERS = ['Artist Full Name', 'Art Title']

export default class ArtGallery extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showInfo: false,
      searchTerm: ''
    }
  }
  parseImageUrl(imgUrl) {
    imgUrl = imgUrl.split(';')
    return imgUrl.filter((x) => x !== '')
  }
  openInfo(art) {
    this.setState({showInfo: true});
    this.setState({currentArt: art})
  }
  closeInfo() {
    this.setState({showInfo: false});
  }
  searchUpdated (term) {
    this.setState({searchTerm: term})
  }
  updateCurrent(likeCount) {
    this.setState({currentArt: Object.assign(this.state.currentArt, {likeCount: likeCount.likeCount})})
  }

  render() {
    const filteredArt = this.props.gallery.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    return (
      <div>
    {/*If the gallery state is not populated, show the loading div. Else diaplay gallery*/}
      {!this.props.gallery[0] ?
        <div className="loadingDiv">
          <div className="animated infinite swing">
            <img src="http://images.clipartpanda.com/artist-paint-brush-vector-artist__s_paint_brush_by_rildraw-d4a5ogt.png" height="150px" width="150px"/>
          </div>
          <p>Drawing pictures...</p>
          <ReactSpinner config={{color: "red"}}/>
        </div>
        :
        <div>
        <br></br>
        <SearchInput className="search-input" onChange={this.searchUpdated.bind(this)} />
          <div className="artGallery">
            <NavBar />
            {this.state.showInfo ?
              <Info onClose={this.closeInfo.bind(this)} loggedIn={this.props.loggedIn}  updateCurrent={this.updateCurrent.bind(this)} currentArt={this.state.currentArt} parseImageUrl={this.parseImageUrl.bind(this)}/>
            : null}
            {filteredArt.map((art) => {
              return (
                  <div className="artwork" key={art._id}>
                    <a href="javascript:void(0)" onClick={(e) => this.openInfo(art)} className="artImage"> <img className="artImage" src={this.parseImageUrl(art.Images)[0]} /> </a>
                  </div>
                )
            })}
          </div>
        </div>}
      </div>
    )
  }
}
//Create the info modal
class Info extends React.Component {
  constructor() {
    super()
    this.state = {
      userFavs: [],
      userId: null,
      address: '',
      mapStatus: 'show'
    }
  }
  componentWillMount() {
    if(document.cookie) {
      this.findFavs()
      this.getUserId()
    }
    var deets = this.props.currentArt['Art Location Street Address'].replace(/ /g, '+').replace(/;/g, '+')
    if (deets){
      console.log(true, deets)
      this.state.address = deets
    }else{
      console.log(false, deets)
      this.state.mapStatus = 'none'
    }
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
            <p>By: {this.props.currentArt['Artist Full Name']}</p>
            <p>Location: {this.props.currentArt['Art Location Name']}</p>
            <p> Likes: {this.props.currentArt.likeCount.length}</p>
            <div className="slideContainer" >
              <Slider {...settings}>
                {images.map((x) => <div key={images.indexOf(x)}><img className="slideshowPicture" src={x} /></div>)}
              </Slider>
            </div>
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
                </button>

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
