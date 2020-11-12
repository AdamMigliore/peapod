/*
 * Copyright (C) 2020 Alix Routhier-Lalonde, Adam Di Re, Ricky Liu
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from 'react'
import './Login.css'

export const Login = () => {
    return (
        <div className = 'login'>
            <div className = 'titlebar-login'>
                <p>Peapod</p>
            </div>
            <div className = 'body-login'>
                <div className = 'wrapper-button-login'>
                <button className = 'button-login'>Sign In</button>
                <button className = 'button-login'>Sign Up</button>
                </div>    
            </div>
        </div>
    )
}