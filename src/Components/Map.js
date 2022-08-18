import React, {useState, useRef, useEffect } from 'react'
import GoogleMapReact from 'google-map-react';
import useSuperCluster from 'use-supercluster';
import LocationMarker from './LocationMarker';

const Map = ({ center, eventData }) => {
    const mapRef = useRef();
    const [zoom, setZoom] = useState(1);
    const [bounds, setBounds] = useState(null);

    // Index for reference
    const eventDataIndex = {
        'wildfires': "Wildfires",
        'severeStorms': "Severe Storms",
        'volcanoes': "Volcanoes",
        'seaLakeIce': "Sea and Lake Ice"
    }
    //Create an Array of its keys
    let eventDataIndexNum = Object.keys(eventDataIndex);
    eventDataIndexNum = eventDataIndexNum.map(index => Number(index));
    //Set up the geo-features
    const points = eventData.map(event => ({
        "type": "Feature",
        "properties": {
            "cluster": false,
            "eventKey": event.id,
            "eventTitle": event.title,
            "eventType": event.categories[0].id
        },
        "geometry": {"type": "Point", "coordinates": [event.geometries[0].coordinates[0], event.geometries[0].coordinates[1]]}
    }));

    //Get clusters
    const {clusters, supercluster} = useSuperCluster({
        points,
        bounds,
        zoom,
        options: {radius: 75, maxZoom: 20}
    })

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
                ])
            }}>
            {cluster.map(cluster => {
                const [longitude, latitude] = clust.geometry.coordinates;
                const {cluster: isCluster, point_count} = cluster.properties;
                //Used for icon type
                const clusterId = cluster.properties.eventType;
                if(isCluster){
                    let changeSize = Math.round(pointCount / point.length * 100);
                    //cant exceed 40 px
                    let addSize = Math.min(changeSize * 10, 40);
                    return(
                        <section lat={latitude} lng={longitude} key={cluster.id}>
                            <div className="cluster-marker" style={{
                                width: addSize + changeSize + "px",
                                height: addSize + changeSize + "px"
                            }}>
                                {pointCount}
                            </div>
                        </section>
                    )
                }
            })}
        </GoogleMapReact>
    </div>
  );
}

Map.defaultProps = {
    center: {
        lat: 40.7608,
        lng: 111.8910
    }
}

export default Map;