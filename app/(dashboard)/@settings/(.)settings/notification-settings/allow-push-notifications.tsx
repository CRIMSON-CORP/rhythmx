"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { goeyToast } from "goey-toast";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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

function AllowPushNotifications({
  pushNotificationSubscribed,
}: {
  pushNotificationSubscribed: boolean;
}) {
  const [isSubscribed, setIsSubscribed] = useState(pushNotificationSubscribed);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

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
            console.log(e);
            goeyToast.error("Could not retrieve current FCM token for deletion:");
          }

          if (currentToken) {
            try {
              await deleteToken(messaging);
            } catch (e) {
              console.warn("Failed to delete FCM token on Firebase:", e);
            }

            // Call API delete endpoint with token
            await api.delete(`${API_ROUTES.ME.FCM_TOKENS}`, {
              token: encodeURIComponent(currentToken),
            });
          } else {
            await api.delete(API_ROUTES.ME.FCM_TOKENS);
          }

          router.refresh();
          setIsSubscribed(false);
        } else {
          // ALLOW / SUBSCRIBE FLOW
          if (!("Notification" in window)) {
            goeyToast.error("Notification API is not supported in this browser.");
            return;
          }

          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            goeyToast.error("Notification permission was denied.");
            setIsSubscribed(false);
            return;
          }

          if ("serviceWorker" in navigator) {
            await navigator.serviceWorker.register("/firebase-messaging-sw.js").catch(() => {});
          }

          let currentToken: string | undefined;
          try {
            currentToken = await getToken(messaging);
          } catch (e) {
            console.error("Failed to generate FCM token:", e);
          }

          if (currentToken) {
            await api.post(API_ROUTES.ME.FCM_TOKENS, {
              token: currentToken,
            });
            router.refresh();
            setIsSubscribed(true);
          }
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
