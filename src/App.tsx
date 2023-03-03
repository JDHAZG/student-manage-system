import React, { Component } from 'react'
import {Route,Redirect, Switch} from 'react-router-dom'
import Check from './pages/Check'
import Index from './pages/Index'
import Login from './pages/Login'
export default class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path='/log' component={Login}/>
          <Route path='/index' component={Index}/>
          <Route path='/check/:name/:major/:grade/:gender/:tele/:mail/:path' component={Check}/>
          <Redirect to='/log'/>
        </Switch>
      </div>
    )
  }
}
