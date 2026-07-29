"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyAL38OWDisgESDkbU1f_sPrdqTMSPVkp1E",
  authDomain: "assuredway-ltd.firebaseapp.com",
  projectId: "assuredway-ltd",
  storageBucket: "assuredway-ltd.appspot.com",
  messagingSenderId: "641218294157",
  appId: "1:641218294157:web:70d4c11902b14d74870dc4",
  measurementId: "G-8T1EQ2LP65",
};

function AllowPushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission === "granted";
    }
    return false;
  });
  const [isPending, startTransition] = useTransition();

  const getFirebaseMessaging = async () => {
    const { initializeApp } = await import("@firebase/app");
    const { getMessaging } = await import("@firebase/messaging");

    const app = initializeApp(firebaseConfig);
    return { messaging: getMessaging(app) };
  };

  const handleTogglePushNotification = () => {
    startTransition(async () => {
      try {
        const { getToken, deleteToken } = await import("@firebase/messaging");
        const { messaging } = await getFirebaseMessaging();

        if (isSubscribed) {
          // DISALLOW / UNSUBSCRIBE FLOW
          let currentToken: string | undefined;
          try {
            currentToken = await getToken(messaging);
          } catch (e) {
            console.warn("Could not retrieve current FCM token for deletion:", e);
          }

          if (currentToken) {
            try {
              await deleteToken(messaging);
            } catch (e) {
              console.warn("Failed to delete FCM token on Firebase:", e);
            }

            // Call API delete endpoint with token
            await api.delete(
              `${API_ROUTES.USER.REGISTER_PUSH_NOTIFICATION_TOKEN}?token=${encodeURIComponent(currentToken)}`,
            );
          } else {
            await api.delete(API_ROUTES.USER.REGISTER_PUSH_NOTIFICATION_TOKEN);
          }

          setIsSubscribed(false);
        } else {
          // ALLOW / SUBSCRIBE FLOW
          if (!("Notification" in window)) {
            alert("Notification API is not supported in this browser.");
            return;
          }

          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            alert("Notification permission was denied.");
            setIsSubscribed(false);
            return;
          }

          if ("serviceWorker" in navigator) {
            await navigator.serviceWorker
              .register("/service/firebase-messaging-sw.js")
              .catch(() => {});
          }

          let currentToken: string | undefined;
          try {
            currentToken = await getToken(messaging);
          } catch (e) {
            console.error("Failed to generate FCM token:", e);
          }

          if (currentToken) {
            await api.post(API_ROUTES.USER.REGISTER_PUSH_NOTIFICATION_TOKEN, {
              token: currentToken,
            });
          }

          setIsSubscribed(true);
        }
      } catch (error) {
        console.error("[Push Notification Toggle Error]:", error);
      }
    });
  };

  return (
    <Button
      variant="outline"
      rounded={10}
      onClick={handleTogglePushNotification}
      disabled={isPending}
    >
      <span>
        {isPending
          ? isSubscribed
            ? "Disallowing..."
            : "Allowing..."
          : isSubscribed
            ? "Disallow Push Notification"
            : "Allow Push Notification"}
      </span>
      {isPending ? (
        <Loader2 size={24} className="animate-spin text-default" />
      ) : isSubscribed ? (
        <BellOff size={24} className="text-default" />
      ) : (
        <Bell size={24} className="text-default" />
      )}
    </Button>
  );
}

export default AllowPushNotifications;
