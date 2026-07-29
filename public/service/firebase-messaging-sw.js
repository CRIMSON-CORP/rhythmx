// sw.js

// Listen for the push event
self.addEventListener('push', event => {
    let notify = event.data.json().notification;
    let notificationData = event.data.json().data;
  
    const options = {
        body: notify.body,
        icon: notificationData.icon,
        badge: notificationData.badge,
        image: notificationData.image,
        data: {
            url: notificationData.url,
            body: notify.body,
            icon: notificationData.icon,
            badge: notificationData.badge,
            image: notificationData.image
        }
    };
  
    event.waitUntil(
        self.registration.showNotification(notify.title, options)
    );
  });
  
  // Listen for the notificationclick event
  self.addEventListener('notificationclick', event => {
    event.notification.close();
  
    const urlToOpen = event.notification.data.url;
  
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (let client of windowClients) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
  
            // If not, open a new window/tab with the target URL
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
  });