import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { DataProvider } from './GlobalState'
import Dashboard from './components/dashboard/dashboard';


function App() {
    return (
        <DataProvider>
            <Router>
                <div className="App">
                    <div className='grid min-h-screen	content-between flex-wrap	'>
                        <Dashboard />
                    </div>
                </div>
            </Router>
        </DataProvider>
    );
}

export default App;
