import React, { useEffect, useState } from "react";
import { MdNotifications, MdCheck, MdDoneAll } from "react-icons/md";
import PageWrapper from "../components/layout/PageWrapper";
import api from "../api/axios";

const TYPE_COLORS = {
  ResultPublished: "bg-green-100 text-green-700",
  DriveOpened:     "bg-blue-100 text-blue-700",
  ApplicationUpdate: "bg-yellow-100 text-yellow-700",
  General:         "bg-gray-100 text-gray-600",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  const fetchNotifications = () => {
    api.get("/student/notifications")
      .then((r) => {
        setNotifications(r.data.data);
        setUnread(r.data.unread);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (id) => {
    await api.put(`/student/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    setUnread((u) => Math.max(0, u - 1));
  };

  const markAllRead = async () => {
    await api.put("/student/notifications/read-all");
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
  };

  return (
    <PageWrapper title="Notifications">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{unread} unread</p>
        {unread > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
            <MdDoneAll size={16} /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : !notifications.length ? (
        <div className="text-center py-20 text-gray-400">
          <MdNotifications size={48} className="mx-auto mb-3 opacity-30" />
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n._id}
              className={`relative bg-white rounded-xl border shadow-sm p-4 transition-colors ${
                n.isRead ? "border-gray-100" : "border-blue-200 bg-blue-50/40"
              }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[n.type]}`}>
                      {n.type}
                    </span>
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{n.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.isRead && (
                  <button onClick={() => markRead(n._id)}
                    className="shrink-0 rounded-lg border border-gray-200 p-1.5 hover:bg-gray-100 text-gray-500 transition-colors"
                    title="Mark as read">
                    <MdCheck size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default Notifications;
