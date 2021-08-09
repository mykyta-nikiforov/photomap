import React from 'react';
import Map from './Map';
import Gallery from "./gallery/Gallery";
import LeftPanel from "./leftPanel/LeftPanel";

function App() {
    return (
        <div>
            <Map/>
            <LeftPanel/>
            <Gallery/>
        </div>
    );
}

export default App;
