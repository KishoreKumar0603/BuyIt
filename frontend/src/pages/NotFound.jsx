import React from 'react'
import '../assets/css/pages/NotFound.css'
import { NavLink } from 'react-router-dom'
export const NotFound = () => {
    return (
        <>
            <div className='not-found-container'>
                <h1>Page Not Found | 404</h1>
                <NavLink to={'/'}>back to Home -{'>'}</NavLink>
            </div>
        </>
    )
}
