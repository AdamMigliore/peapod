import React from 'react'
import './Activities.css';
import { useHistory } from "react-router-dom";
import redux from "../index";
import {Activities2} from './components/Activities2'


export const Activities = () => {
    let history = useHistory();

    const initialSetupActivities = () => {
        setTimeout(function() {
            document.getElementById('wrapper2-activities').style.opacity = 1;
            document.getElementById('button-titlebar-activities').style.opacity = 1;
            document.getElementById('button-back-titlebar-activities').style.opacity = 1;
        },100)       
    }

    const goLogout = () => {
        redux.store.dispatch(redux.setUser(undefined));
        document.getElementById('wrapper2-activities').style.opacity = 0;
        document.getElementById('button-titlebar-activities').style.opacity = 0;
        document.getElementById('wrapper-button-activities').style.height = '25vh';
        document.getElementById('wrapper-button-activities').style.width = '40vw';
        document.getElementById('wrapper2-activities').style.height = '25vh';
        document.getElementById('wrapper2-activities').style.width = '40vw';
        setTimeout(function() {
            history.push("/login");
        },500)
    }

    const goBack = () => {
        document.getElementById('wrapper2-activities').style.opacity = 0;
        document.getElementById('button-titlebar-activities').style.opacity = 0;
        document.getElementById('button-back-titlebar-activities').style.opacity = 0;
        setTimeout(function() {
            history.push("/");
        },500)
    }

    const goAddActivity = () => {
        document.getElementById('wrapper2-activities').style.opacity = 0;
        document.getElementById('button-titlebar-activities').style.opacity = 0;
        document.getElementById('button-back-titlebar-activities').style.opacity = 0;
        setTimeout(function() {
            history.push("/addactivity");
        },500)
    }

    return (
        <div>
            <div className = 'activities' onLoad = {initialSetupActivities()}>
            <div className = 'titlebar-activities'>
                <button onClick = {goBack} className = 'button-titlebar-activities' id = 'button-back-titlebar-activities'>Back</button>
                <p className = 'title-titlebar-activities'>Peapod</p>
                <button onClick = {goLogout} className = 'button-titlebar-activities' id = 'button-titlebar-activities'>Logout</button>
            </div>
            <div className = 'body-activities'>
                    <div className = 'wrapper-button-activities' id = 'wrapper-button-activities' >
                        <div id = 'wrapper2-activities'>
                            <button className = 'button-activities' onClick = {goAddActivity}>Add an Activity</button>
                            <ul className="list-activities-activities">
                                {redux.store.getState().activities.map((activity, index) => (
                                    <Activities2 props={index} key={index} />
                                ))}
                            </ul>
                        </div>
                    </div>
            </div>
        </div>
        </div>
    )
}
