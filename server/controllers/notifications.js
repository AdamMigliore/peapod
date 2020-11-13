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
const { notifications } = require("../database/tables");
require("express-async-errors");

const getNotification = async (req, res, next) => {
    //  VARIABLES
    const notificationId = req.params.id;
    const userId = req.user.user_uuid;
    const connection = await pool.connect();

    try {
        const getNotificationQuery = await connection.query(
            `SELECT * FROM '${tables.notifications}' WHERE notification_uuid = '${notificationId}' AND user_uuid = '${userId}';`
        );
        await connection.release();
        const notification = getNotificationQuery.rows[0];
        if (notification) {
            return res.status(200).json({
                success: true,
                message: `Get notification successful.`,
                notification: notification
            })
        } else {
            return res.status(404).json({
                success: false,
                message: `Get notification unsuccessful.`,
            })
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: `Bad request`
        })
    }
}

const getNotifications = async (req, res, next) => {
    const userId = req.user.user_uuid;
    const { limit } = req.query;
    const connection = await pool.connect();

    try {
        const queryLimit = limit ? limit : 18446744073709551615;
        const getNotificationsQuery = await connection.query(
            `SELECT * FROM '${tables.notifications}' WHERE user_uuid = '${userId}' ORDER BY created_date DESC LIMIT '${queryLimit}';`
        );
        await connection.release();
        notifications = getNotificationsQuery.rows[0];
        if (notifications) {
            return res.status(200).json({
                success: true,
                message: `Got notifications.`,
                notifications: notifications
            })
        } else {
            return res.status(404).json({
                success: false,
                message: `Got no notifications.`,
            })
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: `Bad request`
        })
    }
}

const putNotification = async (req, res, next) => {
    //  VARIABLES
    const userID = req.user.user_uuid;
    const notificationID = req.params.id;
    const { accepted } = req.body;
    //  DB
    const connection = await pool.connect();
    //  LOGIC
    const updateNotificationQuery = await connection.query(`UPDATE '${tables.notifications}' SET accepted='${accepted}' WHERE notification_uuid='${notificationID}' AND user_uuid='${userID}';`);
    const notificationQuery = await connection.query(`SELECT * FROM '${tables.notifications}' WHERE notification_uuid='${notificationID}' AND user_uuid='${userID}';`);
    const notification = notificationQuery.rows[0];
    const createPodUsers = await connection.query(`INSERT INTO '${tables.pod_users}' (pod_uuid, user_uuid) VALUES ('${notification.pod_uuid}', '${userID}');`);
    await connection.release();
    return res.status(200).json({
        success: true,
        message: `${notificationID} has been updated.`,
        notification: notification
    });
}

module.exports = { getNotifications, putNotification, getNotification };