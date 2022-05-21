import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/home';
import Wow from "./components/wow"
function App() {
  return (
    <BrowserRouter>
          <Switch>
            <Route exact={true} path='/' component={Home} />
            <Route exact={true} path='/great' component={Wow} />
          </Switch>
    </BrowserRouter>
  );
}

export default App;
