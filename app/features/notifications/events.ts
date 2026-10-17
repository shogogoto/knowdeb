export const NOTIFICATIONS_CHANGED_EVENT = "tanbunism:notifications-changed";

export function notifyNotificationsChanged() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}
