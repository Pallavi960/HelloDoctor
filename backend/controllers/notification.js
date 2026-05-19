const notification = require("../models/notification");


// =========================================
// GET USER NOTIFICATIONS
// =========================================
async function newNotificationUser(req, res) {

    const userId = req.user?.id;

    try {

        // fetch all user notifications
        const notifyUser = await notification
            .find({

                recipientId: userId,

                model: "users"

            })
            .sort({ createdAt: -1 });

        // no notifications found
        if (notifyUser.length === 0) {

            return res.json({

                success: true,

                message: "No notifications found!",

                data: []

            });

        }

        return res.json({

            success: true,

            message: "All notifications fetched successfully!",

            data: notifyUser

        });

    }
    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Something went wrong!",

            data: []

        });

    }

}



// =========================================
// GET DOCTOR NOTIFICATIONS
// =========================================
async function newNotificationDoctor(req, res) {

    const doctorId = req.user?.id;

    try {

        // fetch all doctor notifications
        const notifyDoctor = await notification
            .find({

                recipientId: doctorId,

                model: "doctors"

            })
            .sort({ createdAt: -1 });

        // no notifications found
        if (notifyDoctor.length === 0) {

            return res.json({

                success: true,

                message: "No notifications found!",

                data: []

            });

        }

        return res.json({

            success: true,

            message: "All notifications fetched successfully!",

            data: notifyDoctor

        });

    }
    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Something went wrong!",

            data: []

        });

    }

}



// =========================================
// MARK NOTIFICATION AS READ
// =========================================
async function markAsRead(req, res) {

    try {

        const notificationId = req.params.id;

        // update notification
        const updateNotification =
            await notification.findByIdAndUpdate(

                notificationId,

                {

                    // mark notification as read
                    isRead: true,

                    // save read time
                    readAt: new Date()

                },

                {

                    new: true

                }

            );

        // notification not found
        if (!updateNotification) {

            return res.json({

                success: false,

                message: "Notification not found!"

            });

        }

        return res.json({

            success: true,

            message: "Notification marked as read!",

            data: updateNotification

        });

    }
    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Something went wrong!"

        });

    }

}



module.exports = {

    newNotificationUser,

    newNotificationDoctor,

    markAsRead

};