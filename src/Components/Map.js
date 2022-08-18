import React, {useState, useRef, useEffect } from 'react'
import GoogleMapReact from 'google-map-react';
import useSupercluster from 'use-supercluster';
const Map = ({ center, eventData }) => {

    const [zoom, setZoom] = useState(1);
  return (
    <div className='map-container'>
        <GoogleMapReact
            bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_KEY}}
            center={center}
            zoom={zoom}>

        </GoogleMapReact>
    </div>
  )
}

Map.defaultProps = {
    center: {
        lat: 40.7608,
        lng: 111.8910
    }
}

export default Map;