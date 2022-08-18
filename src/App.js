import React, {useState, useEffect} from 'react';
import Header from './Components/Header';
import Map from './Components/Map';
import Loader from './Components/Loader';
// Main Context
import {useMainContext} from './Context/Context';




const App = () => {
  const {setEventData, reRenderMarkers} = useMainContext();
  const [loading, setLoading] =useState(false);
  //Event to Render
  const [renderEvent, setRenderEvent] = useState([]);

  useEffect(()=> {
    const fetchEvents = async () => {
      setLoading(true);
      const res = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events");
      // Extract the Array contained in the 'events' field
      const {events} = await res.json();
      //Event data is globally accessible but 'renderEvent' is just to render out the MAP with the markers
      setEventData(events);
      setRenderEvent(events);
      setLoading(false);
    }
    fetchEvents();
  }, [])
  return (
    <div>
        <Header />
        {!loading ? <Map eventData={renderEvent} /> :<Loader />}
    </div>
  )
}

export default App