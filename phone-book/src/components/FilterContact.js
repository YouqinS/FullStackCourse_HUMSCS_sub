import React from "react";

const FilterContact = (props) => {

    return (
        <div>
            filter shown with: <input value={props.newSearchTerm} onChange={props.handleSearchTermChange}/>
        </div>
    )
}

export default FilterContact
