import { AuthContext } from "../../sdk/context/AuthContext"
import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    Form,
    Button,
    Heading,
    Checkbox,
    FormLabel,
    Link,
    InlineNotification,
} from '@carbon/react';
import './MagicLinkPopup.scss'
export const MagicLinkPopup=()=>{
    const authContext = useContext(AuthContext);
    const handleLogout = async (e) => {
        e.preventDefault();
        const logout = await authContext.signout();
      }
    return(
        <>
                            <div className='magiclink-popup-container' >
                                <div className='box-container'>
                                        <div style={{ paddingRight: '20px' }}>
                                            <Heading>User already logged in</Heading>
                                            <p className="register-text body-01"> <Link className="underlined-link" style={{ cursor: 'pointer' }} onClick={handleLogout}> Click here to logout</Link></p>                
                                        </div>
                                </div>
                            </div>
                        
                </>
    )
}