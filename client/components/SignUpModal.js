import React from 'react';
import ReactSpinner from 'react-spinjs';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import * as auth from '../models/auth'


export default class SignUpModal extends React.Component {
  constructor() {
    super()

    this.state = {
      isLoading: false,
      username: null,
      password: null,
      showError: false
    }
  }

  load() {
    this.setState({isLoading: true});
    setTimeout(() => {
      this.setState({isLoading: false});
    }, 1500);
  }

  render() {
    return <ModalContainer onClose={this.props.onClose}>
      {this.state.isLoading ?
        <ReactSpinner color="white"/>
        :
        <ModalDialog onClose={this.props.onClose} className="example-dialog">
          <form name="signUpForm" onSubmit={(e) => {
            e.preventDefault();
            console.log(this.state.username, this.state.password)
            auth.signUp({username: this.state.username, password: this.state.password})
            .then((x) => {
              console.log(x,'line 36')
              if(x === 'Success') {
                this.setState({showError: false})
                this.props.onClose(true)
                this.props.fetchUser()
              } else {
                this.setState({showError: x.statusText})
              }
          })
            this.load.call(this);
          }}>
            <h1>SignUp</h1>
            <p>Username:</p>
            <input type="text" name="username" onChange={(e) => this.setState({username: e.target.value})}/>
            {this.state.showError ? <p className="errorMessage">{this.state.showError}</p> : ''}
            <p>Password:</p>
            <input type="password" name="password" onChange={(e) => this.setState({password: e.target.value})}/>
            <p><button type="submit">Submit</button></p>
          </form>
        </ModalDialog>
      }
    </ModalContainer>;
  }
}
