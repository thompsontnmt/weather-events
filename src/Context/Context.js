import React, {useContext, useState } from 'react';

const mainContext = React.createContext();

export function useMainContext() {
    return useContext(mainContext);
}

export function ContextProvider({children}) {
    // All of the data from NASA EONET
    const [eventData, setEventData] = useState([]);
    // used to store the event that the user wants to go to 
    const [selectedEvent, setSelectedEvent] = useState(null);
    // need to re render markers because user has changed filter option
    const [reRenderMarkers, setReRenderMarkers] = useState(null);

    const value = {
        eventData,
        setEventData,
        selectedEvent,
        setSelectedEvent,
        reRenderMarkers,
        setReRenderMarkers
    }

    return(
        <mainContext.Provider value={value}>
            {children}
        </mainContext.Provider>
    )
}