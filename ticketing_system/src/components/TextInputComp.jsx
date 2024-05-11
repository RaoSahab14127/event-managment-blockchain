import React from 'react'

export default function TextInputComp({ type = "text", placeholder = "", className = "", value, onChange, inputLabel = "", isDisable = false }) {
    return (
        <div className={`form-group ${className} `}>
            {inputLabel && <label className='text-input-label'>{inputLabel}</label>}
            <input
                disabled={isDisable}
                className={`form-control `}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(
                    type == "file" ? e.target.files[0] : e.target.value
                )}
            />
        </div>
    )
}
