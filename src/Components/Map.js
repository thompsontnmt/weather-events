import React, {useState, useRef, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import useSuperCluster from 'use-supercluster';
import LocationMarker from './LocationMarker';
import LocationInfoBox from './LocationInfoBox';
// Main Context
import {useMainContext} from '../Context/Context';

const Map = ({ center, eventData }) => {

    const {selectedEvent} = useMainContext();

    // const {selectedEvent} = useMainContext();
    const mapRef = useRef();
    const [zoom, setZoom] = useState(1);
    const [bounds, setBounds] = useState(null);

    //InfoBox
    const [locationInfo, setLocationInfo] = useState(null);

    // Index for reference
    const eventDataIndex = {
        "wildfires": "Wildfires",
        "severeStorms": "Severe Storms",
        "volcanoes": "Volcanoes",
        "seaLakeIce": "Sea and Lake Ice"
        // 8: "Wildfires",
        // 10: "Severe Storms",
        // 12: "Volcanoes",
        // 15: "Sea and Lake Ice"
    }
    //Create an Array of its keys
    let eventDataIndexStr = Object.keys(eventDataIndex);
    eventDataIndexStr = eventDataIndexStr.map(index => String(index));
    //Set up the geo-features
    const points = eventData.map(event => ({
        "type": "Feature",
        "properties": {
            "cluster": false,
            "eventKey": event.id,
            "eventTitle": event.title,
            "eventType": event.categories[0].id
        },
        "geometry": { "type": "Point", "coordinates": [event.geometry[0].coordinates[0], event.geometry[0].coordinates[1]] }
    }));

    //Get clusters
    const {clusters, supercluster} = useSuperCluster({
        points,
        bounds,
        zoom,
        options: {radius: 75, maxZoom: 20}
    });

    useEffect(() => {
        if(selectedEvent !== null) {
            const [latitude, longitude] = selectedEvent.geometry[0].coordinates;
            mapRef.current.panTo({lat: latitude, lng: longitude});
            mapRef.current.setZoom(10);

        }
    }, [selectedEvent])

  return (
    <div className='map-container'>
        <GoogleMapReact
            bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_KEY}}
            center={center}
            zoom={zoom}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({map}) => {
                mapRef.current = map;
            }}
            onChange={({zoom, bounds}) => {
                setZoom(zoom);
                setBounds([
                    bounds.nw.lng,
                    bounds.se.lat,
                    bounds.se.lng,
                    bounds.nw.lat
                ]);
            }}
            onClick={() => {setLocationInfo(null)}}
            onDrag={() => {setLocationInfo(null)}}>
            {clusters.map(cluster => {
                const [longitude, latitude] = cluster.geometry.coordinates;
                const {cluster: isCluster, point_count: pointCount} = cluster.properties;
                //Used for icon type
                const clusterId = cluster.properties.eventType;
                if(isCluster){
                    let changeSize = Math.round(pointCount / points.length * 100);
                    //cant exceed 40 px
                    let addSize = Math.min(changeSize * 10, 40);
                    return(
                        <section key={cluster.id} lat={latitude} lng={longitude}>
                            <div className="cluster-marker" style={{
                                width: `${addSize + changeSize}px`,
                                height: `${addSize + changeSize}px`
                            }}
                            onClick={() => {
                                const expansionZoom = Math.min(
                                    supercluster.getClusterExpansionZoom(cluster.id),
                                    20
                                );
                                mapRef.current.setZoom(expansionZoom);
                                mapRef.current.panTo({lat: latitude, lng: longitude});
                            }}
                            >
                                {pointCount}
                            </div>
                        </section>
                    )
                }
                // Not a cluster, just a single point
                if(eventDataIndexStr.indexOf(clusterId) !== -1 && cluster.geometry.coordinates.length === 2){
                    return(
                        <LocationMarker 
                            lat={latitude}
                            lng={longitude}
                            id={clusterId}
                            key={cluster.properties.eventKey}
                            onClick= {() => {
                                setLocationInfo({id: cluster.properties.eventKey, title: cluster.properties.eventTitle})
                            }}
                        />
                    )
                }
            })}
        </GoogleMapReact>
        {locationInfo && <LocationInfoBox info={locationInfo} />}
    </div>
  );
}

Map.defaultProps = {
    center: {
        lat: 29.305561,
        lng: -3.981108
    }
}

export default Map;