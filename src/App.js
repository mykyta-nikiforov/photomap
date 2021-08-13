import React, {useEffect} from 'react';
import Map from './Map';
import Gallery from "./gallery/Gallery";
import LeftPanel from "./leftPanel/LeftPanel";
import {set} from "./geoSlice";
import {useDispatch, useSelector} from "react-redux";

function App() {
    const dispatch = useDispatch();
    const geoGson = useSelector((state) => state.geo.gson);
    useEffect(() => {
        (async () => {
            const response = await fetch('https://wikibilhorod.info/resources/assets/photomap/geo.json');
            const gson = await response.json();
            dispatch(set(gson));
        })();
    }, [])


    return (
        geoGson && <div>
            <Map/>
            <LeftPanel/>
            <Gallery/>
        </div>
    );
}

export default App;
