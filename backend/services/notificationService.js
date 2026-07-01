import { Notification } from "../models/Notification.js";

export const createNotification = async ({ recipient, type, title, message, link, metadata }) => {
  try {
    await Notification.create({ recipient, type, title, message, link: link || "/", metadata: metadata || {} });
  } catch (err) {
    console.error("Notification error:", err.message);
  }
};

export const bulkCreateNotifications = async (recipientIds, payload) => {
  try {
    const docs = recipientIds.map((recipient) => ({
      recipient,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      link: payload.link || "/",
      metadata: payload.metadata || {},
    }));
    await Notification.insertMany(docs, { ordered: false });
  } catch (err) {
    console.error("Bulk notification error:", err.message);
  }
};
