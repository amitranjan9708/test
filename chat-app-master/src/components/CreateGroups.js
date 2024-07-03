import { IconButton } from '@mui/material'
import React from 'react'
import { FaCheck } from "react-icons/fa";
function CreateGroups() {
  return (
    <div className="createGroups-container">
        <input placeholder="Enter Group Name" className="search-box" />
      <IconButton>
      <FaCheck/>
      </IconButton>
    </div>
  )
}

export default CreateGroups
