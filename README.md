# 💊 Pharmacy Management System

A full-stack web application for managing pharmacy operations — built with **Django REST Framework** on the backend and **React + PrimeReact** on the frontend.

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![Django](https://img.shields.io/badge/Django-6.0-green?logo=django)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![DRF](https://img.shields.io/badge/DRF-3.17-red)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## 🚀 Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Backend   | Python, Django, Django REST Framework           |
| Frontend  | React.js, PrimeReact v11                        |
| Auth      | JWT (djangorestframework-simplejwt)             |
| Database  | SQLite (dev) / PostgreSQL (prod)                |
| Admin     | Django Admin                                    |

---

## ✨ Features

- 🔐 **JWT Authentication** — login, signup, and role-based access
- 🧾 **Dynamic Billing** — real-time bill creation with medicine lookup
- 📦 **Inventory Management** — track stock levels and batches
- 📋 **Stock Orders** — order and receive stock from suppliers
- 👨‍⚕️ **Pharmacist Management** — manage pharmacist profiles
- 🏭 **Supplier Management** — track suppliers and order history
- 🛡️ **Django Admin Panel** — master data management for medicines and categories

---

## 📁 Project Structure

```
pharmacy-management-system/
├── .gitignore
├── README.md
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── API/                  # Main Django app
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── permissions.py
│       └── migrations/
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── pages/            # Page-level components
        ├── components/       # Reusable UI components
        ├── context/          # Auth context
        ├── Hooks/            # Custom hooks
        └── assets/
```

---

## ⚙️ Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

---

### 🔧 Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/macOS

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file (see Environment Variables section below)

# 5. Apply migrations
python manage.py migrate

# 6. Create superuser
python manage.py createsuperuser

# 7. Run server
python manage.py runserver
```

Backend runs at: `http://127.0.0.1:8000`  
Admin panel: `http://127.0.0.1:8000/admin`

---

### 🎨 Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file (see Environment Variables section below)

# 4. Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Environment Variables

### `backend/.env`
```env
SECRET_KEY=your-django-secret-key-here
DEBUG=True
```

### `frontend/.env`
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/
```

---

## 👤 Author

**M. Nawaz (NZA)**  
BS Computer Science — FATA University, KPK Pakistan  
📧 nawazasghar.nza@gmail.com  
🐙 [github.com/NawazAsghar](https://github.com/NawazAsghar)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
