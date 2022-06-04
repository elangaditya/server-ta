/* eslint-disable no-console */
if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.skipWaiting();
  navigator.serviceWorker.register('../worker.js').then((registration) => {
    console.log('SW Registered');
    console.log(registration);
  }).catch((error) => {
    console.log('SW Registration Failed!');
    console.log(error);
  });
}
