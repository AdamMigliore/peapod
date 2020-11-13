/*
 * Copyright (C) 2020 Alix Routhier-Lalonde, Adam Di Re, Ricky Liu
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */


/**
 * Imports
 */
const pool = require("../config/pg-config");
const { v4: uuidv4 } = require("uuid");
const tables = require("../database/tables");
require("express-async-errors");

/**
 * Controller functions
 */
const postActivity = async (req, res, next) => {
    const activity = req.body;
    const connection = await pool.connect();
    const uuid = uuidv4();

    try {
        await connection.query(
            `INSERT INTO '${tables.activities}'(activity_id, name, date, indoor, socialinteraction, proximity, peoplepresent) VALUES ('${uuid}', '${activity.name}', '${activity.date}', '${activity.indoor}', '${activity.socialInteraction}', '${activity.proximity}', '${activity.peoplePresent}');`
        );
        const newActivityQuery = await connection.query(
            `SELECT (name) FROM '${tables.activities}' WHERE activity_id = '${uuid}';`
        );
        /* UPDATE USER'S RISK LEVEL */
        await connection.release();
        const newActivity = newActivityQuery.rows[0];
        if (newActivity) {
            return res.status(200).json({
                success: true,
                message: `${newActivity.name} was created successfully.`
            })
        } else {
            return res.status(404).json({
                success: false,
                message: `${newActivity.name} was not created.`,
            })
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: `Bad request`
        })
    }
}

const getActivity = async (req, res, next) => {
    const uuid = req.params.id;
    const userId = req.user.user_uuid;
    const connection = await pool.connect();

    try {
        const getActivityQuery = await connection.query(
            `SELECT * FROM '${tables.activities}' WHERE activity_id = '${uuid}' AND user_uuid = '${userId}';`
        );
        await connection.release();
        const activity = getActivityQuery.rows[0];
        if (activity) {
            return res.status(200).json({
                success: true,
                message: `Get ${activity.name} successful.`,
                activity: activity
            })
        } else {
            return res.status(404).json({
                success: false,
                message: `Get ${activity.name} unsuccessful.`,
            })
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: `Bad request`
        })
    }
}

const getActivities = async (req, res, next) => {
    const userId = req.user.user_uuid;

    const { limit } = req.query;
    const connection = await pool.connect();

    try {
        const queryLimit = limit ? limit : 18446744073709551615;

        /* PQ LIMIT isnt good */
        const getActivitiesQuery = await connection.query(
            `SELECT * FROM 
            activities
            WHERE user_uuid ='${userId}'
            ORDER BY date DESC
            LIMIT '${queryLimit}';`
        );
        await connection.release();
        activities = getActivitiesQuery.rows[0];
        if (activities) {
            return res.status(200).json({
                success: true,
                message: `Got activities.`,
                activities: activities
            })
        } else {
            return res.status(404).json({
                success: false,
                message: `Got no activities.`,
            })
        }

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: `Bad request`
        })
    }
}

const deleteActivity = async (req, res, next) => {
    const uuid = req.params.id;
    const userId = req.user.user_uuid;
    const connection = await pool.connect();

    try {
        const getActivityQuery = await connection.query(
            `SELECT (name) FROM '${tables.activities}' WHERE activity_id = '${uuid}' AND user_uuid = '${userId}';`
        )
        const deleteActivityQuery = await connection.query(
            `DELETE FROM '${tables.activities}' WHERE activity_id = '${uuid}' AND user_uuid = '${userId}';`
        );
        await connection.release();
        const getActivity = getActivityQuery.rows[0];
        const deleteActivity = deleteActivityQuery.rows[0];
        if (deleteActivity) {
            return res.status(200).json({
                success: true,
                message: `${getActivity.name} was deleted successfully.`
            })
        } else {
            return res.status(404).json({
                success: false,
                message: `Delete ${getActivity.name} unsuccessful.`,
            })
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: `Bad request`
        })
    }
}

module.exports = { postActivity, getActivity, getActivities, deleteActivity };