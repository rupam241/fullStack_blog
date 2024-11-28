import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import Layout from '../Layout'

function PrivateRoute() {
    const { currentuser } = useSelector(state => state.user)
    const location = useLocation() // Get the current location

    // If the user is authenticated, render the Layout with Outlet
    if (currentuser) {
        return (
          
                <Outlet /> 
          
        )
    } else {
        // Redirect to sign-in if the user is not authenticated
        return <Navigate to='/signin' state={{ from: location }} />
    }
}

export default PrivateRoute
