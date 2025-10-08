"use client"
import React from 'react'

function TestBtn({buttonText,handleClick}: {buttonText:string,handleClick: () => void}) {
  return (
    <button type="button" onClick={handleClick}>
        {buttonText}
    </button>
  )
}

export default TestBtn
