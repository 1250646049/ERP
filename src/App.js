import React,{Component} from "react"
import {BrowserRouter as Router ,Route,Switch,Redirect} from "react-router-dom"
import Login from "./components/login/login"
import Main from "./components/main/main"

import "./App.css"
export default class App extends Component {

  render(){
    return (
      <div className="app">
        <Router>
          <Switch>
            <Route path="/login" component={Login}></Route>
            <Route path="/main" component={Main}></Route>
            <Redirect to="/login"></Redirect>
          </Switch>
          


        </Router>


      </div>
    )
  }


}
