# Expenses & Income Tracking App

Aplikacja do zarządzania finansami z powiadomieniami push, napisana w Vue.js z wykorzystaniem Node.js i MongoDB.

## Wymagania

- Docker
- Docker Compose

## Uruchomienie

1. Sklonuj repozytorium:
```bash
git clone [url-repozytorium]
cd expenses-income-app
```

2. Uruchom aplikację za pomocą Docker Compose:
```bash
docker-compose up --build
```

Aplikacja będzie dostępna pod następującymi adresami:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- MongoDB: mongodb://localhost:27017

## Funkcjonalności

- Śledzenie wydatków i przychodów
- Kategoryzacja transakcji
- Budżetowanie
- Raporty i analizy finansowe
- Powiadomienia push
- Tryb offline
