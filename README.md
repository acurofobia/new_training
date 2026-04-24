# new_training

## Запуск в локальной среде (без Docker)

### Требования

- Python 3.10+
- Node.js 18+

### Бэкенд (Flask)

```bash
cd project_backend

# Создать и активировать виртуальное окружение
python3 -m venv myenv
source myenv/bin/activate  # Linux/macOS
# myenv\Scripts\activate   # Windows

# Установить зависимости
pip install -r requirements.txt

# Инициализировать базы данных
flask db upgrade

# Запустить сервер
flask run
```

Бэкенд будет доступен на `http://127.0.0.1:5000`.

### Фронтенд (React + Vite)

```bash
cd project_frontend

# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev
```

Фронтенд будет доступен на `http://localhost:5173`. Запросы к `/api` автоматически проксируются на бэкенд (`http://127.0.0.1:5000`), настройка прокси уже есть в `vite.config.js`.

### Запуск с Docker

```bash
docker-compose up --build
```
