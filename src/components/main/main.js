import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './home/Home';
import Error from './error/Error';
import Authorization from './authorization/Authorization';
import Search from './search/Search';
import ObjectSearch from './object-search/ObjectSearch';
import Registration from './registration/Registration';

function Main() {
    return (
        <main>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/authorization" element={<Authorization />} />
                <Route exact path="/search" element={<Search />} />
                <Route exact path="/objectsearch" element={<ObjectSearch />} />
                <Route path="*" element={<Error />} />
                <Route path="/#:section" element={<Home />} />
                <Route path="/registration" element={<Registration />} />
            </Routes>
        </main>
    )
}

export default Main;