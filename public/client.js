/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable no-plusplus */
const isDomReady = function (callback) {
    document.readyState === 'interactive' || document.readyState === 'complete' ? callback() : document.addEventListener('DOMContentLoaded', callback);
};
const publicVapidKey = 'BG3LYBrcCZRQJyH9CfuVjteXWjCrCGBXDC9w8C0hQ9FwGBzcaBejAAcnsKwG-KCwdo5tz2kV62k4nh3B5hIgr0Q';

isDomReady((e) => {
    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    // eslint-disable-next-line no-shadow
    document.getElementById('subscribe').addEventListener('click', async (e) => {
        const registration = await navigator.serviceWorker.register('/worker.js', { scope: '/' });
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });
        console.log('test');
        await fetch('subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'content-type': 'application/json',
            },
        });
    });
});
