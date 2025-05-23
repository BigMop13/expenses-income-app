import { Workbox } from 'workbox-window';

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');

  wb.addEventListener('installed', (event) => {
    if (event.isUpdate) {
      if (confirm('Nowa wersja aplikacji jest dostępna. Czy chcesz ją zainstalować?')) {
        window.location.reload();
      }
    }
  });

  wb.addEventListener('activated', () => {
    console.log('Aplikacja jest gotowa do pracy offline');
  });

  // Register the service worker
  wb.register().catch((err) => {
    console.error('Nie udało się zarejestrować service workera:', err);
  });
} 