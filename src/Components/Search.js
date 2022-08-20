import React, {useRef} from 'react';

const Search = (props) => {
  
  const searchBox = useRef();
  const optionBox = useRef();

    return (
        <>
            <section className="search-container">
                <p>Search</p>
                <input type="text" ref={searchBox} />
            </section>
            <table className="search-table">
                <tr>
                    <th style={{width: "60%"}}>Title</th>
                    <th>Type</th>
                    <th>Location</th>
                </tr>
            </table>
        </>
  );
}

export default Search;