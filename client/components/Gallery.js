import React from 'react'
import ReactSpinner from 'react-spinjs';
import SearchInput, {createFilter} from 'react-search-input'
import NavBar from './NavBar'
import Slider from 'react-slick'
import * as auth from '../models/auth'
import * as art from '../models/art'
import InfoModal from './InfoModal'


const KEYS_TO_FILTERS = ['Artist Full Name', 'Art Title']

export default class ArtWindow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showInfo: false,
      searchTerm: '',
    }
  }

  searchUpdated (term) {
    this.setState({searchTerm: term})
  }


  render() {
    const filteredArt = this.props.gallery.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    const divStyle = {
      // color: 'white',
      backgroundImage: '../images/grass_texture',
    };
    return (
      <div className="wallpaper">
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
        <br></br>
        <br></br>
        <SearchInput className="search-input" placeholder="Find Art" onChange={this.searchUpdated.bind(this)} />
        <br></br>
        <br></br>
        <br></br>
        <br></br>
          <div className="artGallery">
            <NavBar />

            {/* Art info modal */}
            {this.props.showInfoModal ?
              <InfoModal 
                onClose={this.props.closeInfoModal} 
                updateCurrent={this.props.updateCurrentArt} 
                currentArt={this.props.currentArt} 
                parseImageUrl={parseImageUrl}
              /> :
              null}

            {filteredArt.map(art =>
              <div className="artwork" key={art._id}>
                <a 
                  href="javascript:void(0)" 
                  onClick={this.props.openInfoModal.bind(null, art)} 
                  className="artImage"
                > 
                  <img className="artImage" src={parseImageUrl(art.Images)[0]} /> 
                </a>
              </div>
            )}
          </div>
        </div>}
      </div>
    )
  }
}

function parseImageUrl(imgUrl) {
  return imgUrl.split(';').filter(e => e !== '');
} 

