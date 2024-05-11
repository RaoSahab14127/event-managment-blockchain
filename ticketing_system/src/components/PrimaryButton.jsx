import React from 'react'

export default function PrimaryButton({ className = "", btnTitle = "", handleOnClick, bodyClass = "" }) {
    return (
        <div className={`text-center primary-btn ${bodyClass}`}>
            <button className={`${className}`} type="submit" onClick={() => handleOnClick()}>
                {btnTitle}
            </button>
        </div>
    )
}
