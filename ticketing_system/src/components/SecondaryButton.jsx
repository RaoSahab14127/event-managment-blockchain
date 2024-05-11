import React from 'react'

export default function SecondaryButton({ title = "", handleOnClick = () => { }, bodyClass = "", className = "" }) {
    return (
        <div className={`text-center primary-btn ${bodyClass}`}>
            <button className={`${className}`} type="submit" onClick={() => handleOnClick()}>
            {title}
            </button>
        </div>
    )
}