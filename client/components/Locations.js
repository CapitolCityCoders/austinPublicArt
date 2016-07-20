import React from 'react'
import GoogleApiComponent from 'google-map-react'

export default class Locations extends React.Component {
	constructor() {
		super()
	}
  render() {
    if (!this.props.loaded) {
      return <div>Loading...</div>
    }
    return (
      <div>Map will go here</div>
    )
  }
}

// export default GoogleApiComponent({
//   apiKey: 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo'
// })(Container)