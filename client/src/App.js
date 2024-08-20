import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { DataProvider } from './GlobalState'
import Header from './components/headers/Header'
import MainPages from './components/mainpages/Pages'
import Footer from './components/footer/footer'


function App() {
    return (
        <DataProvider>
            <Router>
                <div className="App">
                    <Header />
                    <div className='grid min-h-screen	content-between flex-wrap	'>
                        <MainPages />
                        <Footer />
                    </div>
                </div>
            </Router>
        </DataProvider>
    );
}

export default App;
