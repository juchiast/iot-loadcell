import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.scss';

import Views from './views';

function App() {
    return (
        <Router>
            <div className="App">
                <Views />
            </div>
        </Router>
    );
}

export default App;
