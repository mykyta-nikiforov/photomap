import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import {useDispatch, useSelector} from 'react-redux';
import {update} from './gallery/gallerySlice'
import convertFeaturesToImages from "./converter/FeaturesToImagesConverter";

mapboxgl.accessToken =
    'pk.eyJ1IjoibmlraWZvcm92cGl6emEiLCJhIjoiY2o5ajE2dDVmMHpqOTJxcDd4MHJ5YW5rbSJ9.mIuGjdr5w1vXbyTshvHcww';

const Map = () => {
    const dispatch = useDispatch();
    const geo = useSelector((state) => state.geo.gson);
    const filtered = useSelector((state) => state.geo.filtered);

    const mapContainerRef = useRef(null);

    const [lng, setLng] = useState(30.3377);
    const [lat, setLat] = useState(46.1852);
    const [zoom, setZoom] = useState(12);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const map = useRef(null);

    // Initialize map when component mounts
    useEffect(() => {
        if (map.current) return;
        const bounds = [
            [29.1220, 45.6851], // Southwest coordinates
            [31.2959, 46.5145] // Northeast coordinates
        ];


        map.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/nikiforovpizza/ckr165cpu7egu18m46f8qg4tq',
            center: [lng, lat],
            zoom: zoom,
            maxBounds: bounds
        });
        // Add navigation control (the +/- zoom buttons)
        addControlPanel();
        onLoad();

        function addControlPanel() {
            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
            map.current.addControl(new mapboxgl.FullscreenControl(
                {container: document.querySelector('body')}
            ));
            map.current.addControl(new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true
            }));
        }

        function onLoad() {
            map.current.on('load', function () {
                let source = {
                    type: 'geojson',
                    data: geo,
                    cluster: true,
                    clusterMaxZoom: 23,
                    clusterRadius: 50
                };
                map.current.addSource('photos', source);
                setClusterLayers(map);
                handleClusterClick();
                setIsMapLoaded(true);
            });

            map.current.on('render', () => {
                if (!map.current.isSourceLoaded('photos')) return;
                updateMarkers();
            });
        }

        function setClusterLayers() {
            map.current.addLayer({
                id: "clusters",
                type: "circle",
                source: "photos",
                filter: ["has", "point_count"],
                paint: {
                    "circle-color": [
                        "step",
                        ["get", "point_count"],
                        "#51bbd6",
                        20,
                        "#f1f075",
                        50,
                        "#f28cb1"
                    ],
                    "circle-radius": [
                        "step",
                        ["get", "point_count"],
                        20,
                        100,
                        30,
                        750,
                        40
                    ]
                }
            });
            const width = 40;
            const bytesPerPixel = 4;
            const data = new Uint8Array(width * width * bytesPerPixel);
            map.current.addImage('gradient', { width: width, height: width, data: data });
            map.current.addLayer({
                id: "unclustered-point",
                type: "symbol",
                source: "photos",
                filter: ["!", ["has", "point_count"]],
                layout: {
                    'icon-image': 'gradient',
                    'icon-allow-overlap': true
                }
            });
            map.current.addLayer({
                id: "cluster-count",
                type: "symbol",
                source: "photos",
                filter: ["has", "point_count"],
                layout: {
                    "text-field": "{point_count_abbreviated}",
                    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                    "text-size": 12
                }
            });
        }

        function handleClusterClick() {
            map.current.on('click', 'clusters', function (e) {
                let features = map.current.queryRenderedFeatures(e.point, {layers: ['clusters']});
                let clusterId = features[0].properties.cluster_id,
                    point_count = features[0].properties.point_count,
                    clusterSource = map.current.getSource('photos');

                clusterSource.getClusterLeaves(clusterId, point_count, 0, function (err, features) {
                    let coordinates = features[0].geometry.coordinates.slice();

                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    let images = convertFeaturesToImages(features);
                    dispatch(update(images));
                });
            });
            map.current.on('click', 'unclustered-point', function (e) {
                let coordinates = e.features[0].geometry.coordinates.slice();
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                let images = convertFeaturesToImages(e.features);
                dispatch(update(images));
            });
        };

        const markers = {};
        let markersOnScreen = {};

        function updateMarkers() {
            const newMarkers = {};
            const features = map.current.querySourceFeatures('photos');

            for (const feature of features) {
                const props = feature.properties;
                if (props.cluster) continue;
                const coords = feature.geometry.coordinates;
                const id = props.title;

                let marker = markers[id];
                if (!marker) {
                    const el = createImageIcon(props);
                    marker = markers[id] = new mapboxgl.Marker({
                        element: el
                    }).setLngLat(coords);
                }
                newMarkers[id] = marker;

                if (!markersOnScreen[id]) marker.addTo(map.current);
            }
            // for every marker we've added previously, remove those that are no longer visible
            for (const id in markersOnScreen) {
                if (!newMarkers[id]) markersOnScreen[id].remove();
            }
            markersOnScreen = newMarkers;
        }
        function createImageIcon(props) {
            let html = `<div style="width: 40px; 
                height: 40px; 
                background-position: center center;
                background-repeat: no-repeat;
                background-size: cover;
                background-image: url('${props.thumbUrl}');
                border: 1px solid #C3C7DD;
                box-shadow: 0 0 0 1px #000, 0 2px 4px 0px #222;
                "></div>`;
            const el = document.createElement('div');
            el.innerHTML = html;
            return el.firstChild;
        }

        // Clean up on unmount
        return () => map.current.remove();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isMapLoaded) {
            map.current.getSource('photos').setData(filtered);
        }
    }, [filtered])

    return (
        <div>
            <div className='map-container' ref={mapContainerRef}/>
        </div>
    );
};

export default Map;
