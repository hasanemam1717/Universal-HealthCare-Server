# 🏥Universal Health Care Backend

This is the **backend API** for the 🏥Universal Health Care system.  
It manages patient data, appointments, medical records, and authentication.

---

## 📋 Features

- **Patient Management** – CRUD operations for patient information.
- **Appointment Scheduling** – Create, update, cancel appointments.
- **Medical Records** – Store and retrieve patient history, prescriptions, reports.
- **Authentication & Authorization** – Secure JWT-based authentication with role-based access.
- **RESTful API** – Well-structured and easy-to-use endpoints.
- **Database Integration** – Prisma / PostgreSQL support.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Prisma / PostgreSQL
- **Authentication:** JWT (JSON Web Token)
- **Validation:** Zod / Joi
- **Environment:** dotenv

---

## 📂 Project Structure

```plaintext
server/
│
├── config/          # DB connection, environment configs
├── modules/     # Request handlers
├── middleware/      # Error handling
├── prisma/          # Database schemas
├── routes/          # API endpoints
├── helpers/           # Helper functions
├── .env.example     # Environment variables example
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/hasanemam1717/Universal-HealthCare-Server
   cd Universal-HealthCare
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Copy `.env.example` to `.env`
   - Fill in the required values:
     ```env
     PORT=3000
     DATABASE_URL="postgresql://postgres:...
     ```

4. **Run the server**
   ```bash
   npm run dev
   ```

---

## 🧪 Testing

```bash
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint             | Description            | Auth Required |
| ------ | -------------------- | ---------------------- | ------------- |
| POST   | `/api/v1/user`       | Register a new user    | ❌            |
| POST   | `/api/v1/auth/login` | Login and get token    | ❌            |
| GET    | `/api/patients`      | Get all patients       | ✅            |
| POST   | `/api/patients`      | Create new patient     | ✅ (Admin)    |
| GET    | `/api/appointments`  | List all appointments  | ✅            |
| POST   | `/api/appointments`  | Create new appointment | ✅            |

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Contact

- **Author:** Hasan Emam
- **Email:** hasanemam1717@gmail.com
- **GitHub:** [hasanemam1717](https://github.com/hasanemam1717)
