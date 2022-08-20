import React, {useRef, useState, useEffect} from 'react';
//Global Context
import {useMainContext} from '../Context/Context';

const Search = (props) => {
  const {eventData, setSelectedEvent, setReRenderMarkers} = useMainContext();
  // Matching Results
  const [matchEvent, setMatchEvent] = useState(eventData);
  //Handle Dropdown
  const [storeSelection, setStoreSelection] = useState("All");
  const searchBox = useRef();
  const optionBox = useRef();

   //Filter event data
   const filterEventData = eventData => {
    //Spread operator so we dont overwrite reference data
    let filteredEventData = [...eventData];
    if(storeSelection !== "All"){
        filteredEventData = filteredEventData.filter(event => event.categories[0].title === storeSelection);
    }
    return filteredEventData;
}

  const userSearch = (searchQuery, eventData) => {
      let eventMatch = [];
      let filterdEventData = filterEventData(eventData);
      if(searchQuery.length > 0 && filterdEventData){
          for(const event in eventData) {
              let eventTitle = filterdEventData[event].title.toLowerCase();
              if(eventTitle.indexOf(searchQuery) !== -1){
                  eventMatch.push(filterdEventData[event]);
              }
          }
          // if they have typed in something that didnt match
          if(eventMatch.length === 0){
              eventMatch = [{title: "No Results Found", categories: [{title:""}]}]
          }
          setMatchEvent(eventMatch);
      } else {
          setMatchEvent(filterdEventData);
      }
  }

  //if changed the filter option, want the markers to change as well
  useEffect(() => {
    let filterdEventData = filterEventData(eventData);
    setReRenderMarkers(filterdEventData);
    userSearch(searchBox.current.value.toLowerCase(), filterdEventData);
    // eslint-disable-next-line
  }, [storeSelection])

    return (
        <>
        <section className="option-container">
            <p>Type:</p>
            <select ref={optionBox}
            onChange={() => {setStoreSelection(optionBox.current.value)
                }}>
                <option value="All">All</option>
                <option value="Wildfires">Wildfires</option>
                <option value="Severe Storms">Severe Storms</option>
                <option value="Volcanoes">Volcanoes</option>
                <option value="Sea and Lake Ice">Sea and Lake Ice</option>
            </select>
            </section>
            <section className="search-container">
                <p>Search</p>
                <input type="text"
                onKeyUp={() => {
                    let searchQuery = searchBox.current.value.toLowerCase();
                    //Want to wait for the user to finish typing before sending method
                    setTimeout(() => {
                        if(searchQuery === searchBox.current.value.toLowerCase()){
                            userSearch(searchQuery, eventData);
                        }
                    }, 300)
                }}
                ref={searchBox} />
            </section>
            <table className="search-table">
                <tbody>
                    <tr>
                        <th style={{width: "60%"}}>Title</th>
                        <th>Type</th>
                        <th>Location</th>
                    </tr>
                {matchEvent.map(ev => {
                    return(<tr key={ev.id}>
                        <td>{ev.title}</td>
                        <td>{ev.categories[0].title}</td>
                        {ev.categories[0].title ? <td><a href="#location"
                        onClick={() => {setSelectedEvent(ev)}}>View on Map</a></td> : <td></td>}
                    </tr>)
                })}
                </tbody>
            </table>
        </>
  );
}

export default Search;