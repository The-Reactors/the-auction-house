import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './Components/header';
import Home from './pages/Home';
import Wow from './pages/Wow'
function App() {
  return (
    <BrowserRouter>
    <Header/>
      <main className="py-3">
            <Container>
              <Switch>
                <Route exact={true} path='/' component={Home} />
                
              </Switch>
        </Container>
      </main>  
    </BrowserRouter>
    
  );
}

export default App;
