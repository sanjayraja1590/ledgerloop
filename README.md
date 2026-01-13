# LedgerLoop 💸

LedgerLoop is a full-stack expense tracking application that helps you record, organize, and visualize your expenses month-wise with category insights.

---

## 🧱 Tech Stack

### Frontend
- React (CRA)
- Framer Motion
- Chart.js / Recharts
- CSS (custom UI)

### Backend
- Django
- Django REST Framework
- SQLite (local)
- PostgreSQL (production)

### Deployment
- Render (Backend + Frontend)
- Gunicorn (WSGI server)

---

## 📁 Project Structure

ledgerloop/
│
├── backend/
│ ├── manage.py
│ ├── ledgerloop/
│ │ ├── settings.py
│ │ ├── urls.py
│ │ ├── wsgi.py
│ │ └── asgi.py
│ └── expenses/
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── build/
│
├── render.yaml
├── .gitignore
└── README.md