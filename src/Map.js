import React, {useEffect, useRef, useState} from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import {useDispatch, useSelector} from 'react-redux';
import {update} from './gallery/gallerySlice'
import convertFeaturesToImages from "./converter/FeaturesToImagesConverter";
import nearestPoint from "@turf/nearest-point";
import * as turf from "@turf/helpers";

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
            const width = 40;
            const bytesPerPixel = 4;
            const data = new Uint8Array(width * width * bytesPerPixel);
            map.current.addImage('gradient', {width: width, height: width, data: data});

            map.current.addLayer({
                id: "clusters",
                type: "symbol",
                source: "photos",
                filter: ['==', 'cluster', true],
                layout: {
                    'icon-image': 'gradient'
                }
            });
            map.current.addLayer({
                id: "unclustered-point",
                type: "symbol",
                source: "photos",
                filter: ['!=', 'cluster', true],
                layout: {
                    'icon-image': 'gradient',
                    'icon-allow-overlap': true
                }
            });
        }

        function handleClusterClick() {
            map.current.on('click', 'clusters', function (e) {
                let features = map.current.queryRenderedFeatures(e.point, {layers: ['clusters']});
                let clusterId = features[0].properties.cluster_id,
                    point_count = features[0].properties.point_count,
                    clusterSource = map.current.getSource('photos');

                clusterSource.getClusterLeaves(clusterId, point_count, 0, function (err, leaves) {
                    dispatch(update(convertFeaturesToImages(leaves)));
                });
            });
            map.current.on('click', 'unclustered-point', function (e) {
                dispatch(update(convertFeaturesToImages(e.features)));
            });
        };

        const markers = {};
        let markersOnScreen = {};

        function updateMarkers() {
            const newMarkers = {};
            const features = map.current.querySourceFeatures('photos');
            for (const feature of features) {
                const props = feature.properties;
                const coords = feature.geometry.coordinates;
                let id;
                let iconThumbUrl;
                if (props.cluster) {
                    id = props.cluster_id;
                    iconThumbUrl = nearestPoint(turf.point(coords), geo)
                        .properties.iconThumbUrl;
                } else {
                    id = props.title;
                    iconThumbUrl = props.iconThumbUrl;
                }
                let marker = markers[id];
                if (!marker) {
                    marker = markers[id] = new mapboxgl.Marker({
                        element: createImageIconHtml(iconThumbUrl, props.point_count)
                    }).setLngLat(coords);
                }
                newMarkers[id] = marker;
                if (!markersOnScreen[id]) marker.addTo(map.current);
            }
            // for every marker we've added previously, remove those that are no longer visible
            for (const id in markersOnScreen) {
                if (!newMarkers[id]) {
                    markersOnScreen[id].remove();
                }
            }
            markersOnScreen = newMarkers;
        }

        function createImageIconHtml(iconThumbUrl, pointsAmount) {
            let html = `<div class="marker-icon"
                             style="background-image: url('${iconThumbUrl}');">`
                + (pointsAmount ? `<div class="cluster-foot">
                                       <span class="cluster-count">${pointsAmount}</span>
                                   </div>` : "")
            + `</div>`;
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
