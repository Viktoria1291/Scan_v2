import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Home from './home/home';
import Error from './error/Error';
import Authorization from './authorization/authorization';
import Search from './search/search';
import ObjectSearch from './ObjectSearch/ObjectSearch';

function Main() {
    return (
        <main>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route path='*' element={<Home />}/>
                <Route exact path="/authorization" element={<Authorization/>}/>
                <Route exact path="/search" element={<Search/>}/>
                <Route exact path="/objectsearch" element={<ObjectSearch/>}/>
                <Route path="*" element={<Error/>}/>
            </Routes>
        </main>
    )
}

export default Main;