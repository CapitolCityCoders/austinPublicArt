import React from 'react'
import GoogleApiComponent from 'google-map-react'

export class LocationsContainer extends React.Component {
	constructor() {
		super()
	}
  render() {
  	const style = {
  		width: '100vw',
  		height: '100vh'
  	}
    return (
      <div style={style}>
      	<Map google={this.props.google} />
      </div>
    )
  }
}

export class Map extends React.Component {
	componentDidUpdate(prevProps, prevState){
		if (prevProps.google !== this.props.google){
			this.loadMap();
		}
	}
	componentDidMount(){
		this.loadMap();
	}
	loadMap(){
		if (this.props && this.props.google){
			const {google} = this.props;
			const maps = google.maps;

			const mapRef = this.refs.map;
			const node = ReactDOM.findDOMNode(mapRef);

			let zoom = 14;
			let lat = 37.774929
			let lng = 122.419416
			const center = new maps.LatLng(lat, lng);
			const mapConfig = Object.assign({}, {
				center: center,
				zoom: zoom
			})
			this.map = new maps.Map(node, mapConfig)
		}
	}
	render() {
		return (
			<div ref='map'>
				Loading map...
			</div>
		)
	}
}

export GoogleApiComponent({
  apiKey: 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo'
})(Container)