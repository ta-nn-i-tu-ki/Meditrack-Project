<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=30&pause=1000&color=6366F1&center=true&vCenter=true&width=700&lines=MediTrack+%F0%9F%A9%BA;Next-Gen+AI+Healthcare+Platform;Consult+%C2%B7+Diagnose+%C2%B7+Prescribe" alt="MediTrack Typing SVG" />

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![.NET](https://img.shields.io/badge/.NET_8-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NVIDIA](https://img.shields.io/badge/NVIDIA_NIM-76B900?style=for-the-badge&logo=nvidia&logoColor=white)](https://www.nvidia.com/en-us/ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br/>

> **MediTrack** is a full-stack, production-grade AI healthcare platform that connects patients to specialist AI doctors, conducts structured clinical consultations powered by **NVIDIA's LLaMA 3.1 405B**, auto-generates professional prescriptions and appointment letters, and provides a 24/7 disease encyclopedia — all in one seamlessly designed platform.

<br/>

[🩺 Patient Portal](#-patient-portal) • [🏥 Doctor Portal](#-doctor-portal) • [📚 Disease Guide](#-disease-encyclopedia) • [🚀 Quick Start](#-quick-start) • [🏗️ Architecture](#%EF%B8%8F-architecture)

</div>

---

## 📸 Platform Overview

| Patient Portal | Doctor Portal | Disease Encyclopedia |
|---|---|---|
| 12 specialist AI doctors | Rich clinical dashboards | 8+ disease treatment guides |
| 7-stage clinical interview | Real-time consultation inbox | Downloadable PDF care guides |
| Prescription & appointment PDFs | Tabbed patient records | Symptom → medicine search |

---

## ✨ Key Features

### 🤖 AI-Powered Doctor Consultation
- Patients choose from **12 specialist AI doctors** (Cardiologist, Neurologist, Gynaecologist, Paediatrician, Psychiatrist, and more)
- The AI conducts a structured **7-stage clinical interview** before prescribing — just like a real doctor:
  1. Chief Complaint
  2. Onset & Duration
  3. Severity (1–10 scale)
  4. Associated Symptoms
  5. Medical History
  6. Current Medications
  7. Allergies & Lifestyle
- Powered by **NVIDIA NIM (LLaMA 3.1 405B)** — a 405-billion-parameter open-source model for intelligent, contextual, empathetic medical responses
- Intelligent **fallback rule engine** activates automatically if the API is unavailable — zero downtime
- Vital signs (BP, Heart Rate, Temperature) are captured and factored into the AI's clinical assessment

### 📄 Automated Document Generation
- **Prescription PDF**: Patient name, vitals, symptoms, medicines (with dosage + duration), clinical advice, and AI disclaimer
- **Appointment Letter PDF**: Assigned doctor, department, appointment date, hospital, and reference number — generated with a single click
- All documents generated **instantly in-browser**, no backend PDF server required

### 🏥 Doctor Portal — Clinical Workstation
- **12 switchable doctor profiles** — each with degree, hospital, rating, patient count, and experience
- **Rich profile banner** with verification badge and availability indicator
- **AI Consultation Inbox**: Automatically receives patient consultations from the Patient Portal (via shared Zustand persistent store)
- **Today's Schedule** with patient status (waiting / in-session / completed)
- **Patient record drawer** with 4 clinical tabs:
  - 📝 Consultation Notes + live prescription builder
  - 🏛️ Medical History timeline
  - 🧪 Lab Results with normal/abnormal flagging
  - 💓 Vital Signs display
- Doctor can **issue and download official prescriptions** directly from the portal

### 📚 Disease Encyclopedia (Always-On)
- 24/7 access to a comprehensive disease guide — available when no doctor is online
- **8 fully detailed conditions** across specialties: Flu, Migraine, Hypertension, Diabetes, Asthma, Gastritis, UTI, Anxiety Disorder
- Each disease includes: description, symptoms, causes, medicines (with dosage), home remedies, red-flag warnings, and when to see a doctor
- **Searchable and filterable** by specialty category
- **Downloadable care guide** per disease

### 🔐 Security & Architecture
- **JWT Authentication** for secure patient and doctor sessions
- API key stored in `.env.local` — **never exposed to the browser**
- Server-side Next.js API route proxies all NVIDIA NIM calls
- **CORS** configured on the .NET backend
- `.gitignore` ensures secrets are never committed

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        MediTrack Platform                       │
├──────────────────────────┬──────────────────────────────────────┤
│      Frontend            │           Backend                    │
│   Next.js 16 (App Router)│        .NET 8 WebAPI                 │
│   TypeScript + Tailwind  │        Clean Architecture            │
│   Framer Motion (UI)     │        MediatR (CQRS)                │
│   Zustand (State)        │        Entity Framework Core         │
│   TanStack Query         │        JWT Authentication            │
│                          │        SignalR (WebSockets)          │
├──────────────────────────┴──────────────────────────────────────┤
│                        AI Layer                                 │
│   NVIDIA NIM → LLaMA 3.1 405B (via /api/consult route)         │
│   Local Rule Engine (Fallback — zero downtime)                  │
├─────────────────────────────────────────────────────────────────┤
│                     Infrastructure                              │
│   PostgreSQL (Primary DB)  │  Redis (Caching)                  │
│   RabbitMQ (Email Queue)   │  QuestPDF (Server PDF)            │
│   Docker Compose           │  GitHub Actions CI/CD             │
└─────────────────────────────────────────────────────────────────┘
```

### Project Structure

```
Meditrack-Project/
│
├── MediTrack.Application/          # Business logic, commands, interfaces
│   ├── Documents/Models/           # PDF request models
│   ├── Interfaces/                 # IAiSymptomRoutingService, IPdfGeneratorService
│   └── Symptoms/Commands/          # ChatWithAiDoctorCommand, AnalyzeSymptomsQuery
│
├── MediTrack.Domain/               # Core entities (Patient, Doctor, Appointment)
│
├── MediTrack.Infrastructure/       # External integrations
│   ├── Services/
│   │   ├── GeminiSymptomRoutingService.cs
│   │   └── PdfGeneratorService.cs  # QuestPDF engine
│   ├── Workers/EmailWorker.cs      # RabbitMQ background service
│   └── Data/                       # EF Core DbContext & migrations
│
├── MediTrack.WebAPI/               # REST API + SignalR hubs
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── SymptomsController.cs
│   │   └── DocumentsController.cs
│   └── Program.cs
│
├── meditrack-ui/                   # Next.js 16 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── patient/dashboard/  # Patient portal (doctor selection + AI chat)
│   │   │   ├── doctor/             # Doctor portal (clinical workstation)
│   │   │   ├── admin/              # Disease Encyclopedia
│   │   │   └── api/consult/        # Server-side NVIDIA NIM proxy
│   │   ├── lib/
│   │   │   ├── aiDoctor.ts         # AI engine (LLM + fallback)
│   │   │   └── doctors.ts          # 12 specialist doctor profiles
│   │   ├── store/useAppStore.ts    # Zustand global + consultation store
│   │   └── components/Navbar.tsx
│   └── .env.local                  # 🔐 API keys (gitignored)
│
├── docker-compose.yml              # PostgreSQL + Redis + RabbitMQ + API
├── .github/workflows/ci.yml        # GitHub Actions CI pipeline
└── README.md
```

---

## 👩‍⚕️ Meet the AI Doctors

| Doctor | Specialty | Experience | Fee |
|--------|-----------|------------|-----|
| Dr. Sarah Jenkins | General Medicine | 12 years | ₹500 |
| Dr. Rajiv Mehta | Cardiology | 18 years | ₹1,200 |
| Dr. Ananya Sharma | Neurology | 14 years | ₹1,000 |
| Dr. Priya Nair | Orthopedics | 10 years | ₹900 |
| Dr. Meera Patel | Gynecology & Obstetrics | 15 years | ₹1,100 |
| Dr. Arun Gupta | Pulmonology | 11 years | ₹800 |
| Dr. Neha Kapoor | Gastroenterology | 9 years | ₹950 |
| Dr. Kiran Reddy | Pediatrics | 13 years | ₹700 |
| Dr. Sameer Joshi | Dermatology | 8 years | ₹850 |
| Dr. Rahul Verma | ENT | 10 years | ₹750 |
| Dr. Meenakshi Rao | Ophthalmology | 16 years | ₹1,000 |
| Dr. Faisal Khan | Psychiatry | 12 years | ₹1,300 |

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| .NET SDK | 8.0 |
| PostgreSQL | 15+ |
| Git | Latest |

### 1. Clone the Repository

```bash
git clone https://github.com/ta-nn-i-tu-ki/Meditrack-Project.git
cd Meditrack-Project
```

### 2. Configure the Backend

```bash
# Navigate to the WebAPI project
cd MediTrack.WebAPI

# Edit appsettings.json — update your PostgreSQL connection string
# "DefaultConnection": "Host=localhost;Database=meditrack_db;Username=postgres;Password=yourpassword"
```

### 3. Run Database Migrations

```bash
dotnet ef database update --project ../MediTrack.Infrastructure
```

### 4. Start the Backend

```bash
dotnet run
# API will be live at: http://localhost:5154
# Swagger UI: http://localhost:5154/swagger
```

### 5. Configure the Frontend

```bash
cd ../meditrack-ui

# Create the environment file
echo "NVIDIA_API_KEY=your_nvidia_nim_api_key_here" > .env.local
```

> **Get a free NVIDIA NIM API key at:** [https://build.nvidia.com](https://build.nvidia.com)

### 6. Start the Frontend

```bash
npm install
npm run dev
# App will be live at: http://localhost:3000
```

### 7. (Optional) Start Infrastructure with Docker

```bash
# From the project root
docker compose up -d
# Starts: PostgreSQL, Redis, RabbitMQ
```

---

## 🌐 Live URLs

| Service | URL |
|---------|-----|
| 🏠 Home | `http://localhost:3000` |
| 🩺 Find a Doctor | `http://localhost:3000/patient/dashboard` |
| 🏥 Doctor Portal | `http://localhost:3000/doctor` |
| 📚 Disease Guide | `http://localhost:3000/admin` |
| 📡 API (Swagger) | `http://localhost:5154/swagger` |

---

## 🩺 Patient Portal

**How a consultation works:**

```
1. Enter optional vitals (BP, HR, Temperature)
2. Browse & select a specialist doctor
3. Start AI consultation chat
4. AI asks 7 detailed clinical questions:
   ① Chief complaint
   ② Onset & duration
   ③ Severity rating
   ④ Associated symptoms
   ⑤ Medical history
   ⑥ Current medications
   ⑦ Allergies & lifestyle
5. Receive full clinical assessment + specialist referral
6. Download Prescription PDF + Appointment Letter
7. Consultation auto-appears in the Doctor Portal inbox
```

---

## 💻 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** (App Router) | Full-stack React framework |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations & transitions |
| **Zustand** | Global state + persisted consultation store |
| **TanStack Query** | Server state, caching, and data fetching |
| **Lucide React** | Icon system |

### Backend
| Technology | Purpose |
|------------|---------|
| **.NET 8 WebAPI** | REST API server |
| **MediatR** | CQRS pattern (Commands & Queries) |
| **Entity Framework Core** | ORM & database migrations |
| **PostgreSQL** | Primary relational database |
| **Redis** | High-speed caching (appointments, schedules) |
| **RabbitMQ + MailKit** | Async email notification queue |
| **SignalR** | Real-time WebSocket notifications |
| **QuestPDF** | Server-side PDF generation |
| **JWT Bearer** | Secure authentication |

### AI & Infrastructure
| Technology | Purpose |
|------------|---------|
| **NVIDIA NIM** | Managed LLM inference API |
| **LLaMA 3.1 405B** | Core AI model for consultations |
| **Docker Compose** | Local infrastructure orchestration |
| **GitHub Actions** | CI/CD pipeline |

---

## 🔌 API Reference

### Symptoms

```http
POST /api/symptoms/consult
Content-Type: application/json

{
  "history": [{ "role": "user", "content": "I have severe chest pain" }],
  "vitals": { "BloodPressure": "140/90", "HeartRate": "95", "Temperature": "98.6" },
  "newMessage": "It started 2 hours ago"
}
```

### Documents

```http
POST /api/documents/prescription
Content-Type: application/json

{
  "PatientName": "John Doe",
  "DoctorName": "Dr. Rajiv Mehta",
  "Symptoms": "Chest pain, shortness of breath",
  "Medicines": [{ "Name": "Aspirin", "Dosage": "75mg", "Duration": "30 days" }],
  "Notes": "Avoid exertion. Monitor BP daily."
}
```

```http
POST /api/documents/appointment
Content-Type: application/json

{
  "PatientName": "John Doe",
  "DoctorName": "Dr. Rajiv Mehta",
  "Department": "Cardiology",
  "AppointmentDate": "2025-05-20T10:00:00Z",
  "ReferenceNumber": "AP-48291"
}
```

---

## 🔐 Environment Variables

### `meditrack-ui/.env.local`
```env
# NVIDIA NIM API Key (server-side only — never exposed to browser)
NVIDIA_API_KEY=nvapi-your-key-here
```

### `MediTrack.WebAPI/appsettings.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=meditrack_db;Username=postgres;Password=yourpassword",
    "Redis": "localhost:6379"
  },
  "JwtSettings": {
    "Secret": "YourSuperSecretJwtKey",
    "ExpirationInMinutes": 60,
    "Issuer": "MediTrack",
    "Audience": "MediTrackUI"
  },
  "GeminiAi": {
    "ApiKey": "your-gemini-api-key-here"
  }
}
```

---

## 🧪 Running Tests

```bash
# Backend unit tests
dotnet test

# Frontend type checking
cd meditrack-ui && npx tsc --noEmit
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Medical Disclaimer

> MediTrack is an educational and demonstration platform. All AI-generated consultations, diagnoses, and prescriptions are **provisional and for informational purposes only**. They do not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for any medical concerns.

---

<div align="center">

**Built with ❤️ by [Tannistha](https://github.com/ta-nn-i-tu-ki)**

*MediTrack — Bridging the gap between patients and healthcare, powered by AI.*

⭐ If you found this project helpful, please give it a star!

</div>
