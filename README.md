# MediTrack Healthcare System

MediTrack is a high-performance, modern, and intelligent healthcare management platform. It uses cutting-edge technologies to provide seamless appointment booking, AI-powered symptom routing, instant digital prescriptions, and real-time notifications for both patients and doctors.

## 🚀 Architecture Overview

MediTrack follows **Clean Architecture** principles, ensuring separation of concerns, scalability, and testability. 

### Backend (.NET 8)
- **Domain Layer**: Contains enterprise-wide logic and entity definitions (`User`, `Doctor`, `Appointment`, `MedicalRecord`).
- **Application Layer**: Implements **MediatR (CQRS)** for business use cases.
- **Infrastructure Layer**: Implements external concerns like **Entity Framework Core (PostgreSQL)**, **RabbitMQ**, **MailKit (SMTP)**, **StackExchange.Redis**, and **Google Gemini API** for symptom analysis.
- **WebAPI Layer**: Exposes secure REST endpoints protected by **JWT Authentication**, and includes **SignalR** hubs for real-time WebSocket communication.

### Frontend (Next.js 16)
- Built on the modern **Next.js App Router** with **TypeScript**.
- Styled using **Tailwind CSS** with premium glassmorphism tokens and dynamic gradients.
- State management powered by **Zustand**.
- API data fetching and caching optimized with **@tanstack/react-query**.
- Micro-animations handled via **Framer Motion**.

## ✨ Key Features
1. **AI Symptom Router**: Patients type their symptoms, and the Google Gemini LLM API instantly routes them to the correct specialist.
2. **High-Speed Booking**: Doctor schedules are cached using Redis, reducing database load and speeding up read operations by 10x.
3. **Background Email Processing**: RabbitMQ and MailKit process email confirmations asynchronously, avoiding blocked HTTP requests.
4. **Digital Prescriptions**: QuestPDF generates beautifully formatted, downloadable PDF prescriptions automatically.
5. **Live Notifications**: SignalR pushes real-time updates directly to patients' and doctors' screens.

## 🛠️ Local Development & Setup

### Prerequisites
- Docker & Docker Compose
- .NET 8 SDK
- Node.js 20+

### Step 1: Start Infrastructure Services
Use Docker Compose to spin up PostgreSQL, Redis, and RabbitMQ:
```bash
docker-compose up -d postgres redis rabbitmq
```

### Step 2: Configure Environment Variables
Update `appsettings.json` in `MediTrack.WebAPI`:
- Add your `GeminiAi:ApiKey`.
- Ensure connection strings match your local Docker instance (default provided).

### Step 3: Run the Backend
```bash
cd MediTrack.WebAPI
dotnet run
```
The Swagger UI will be available at `http://localhost:5000/swagger`.

### Step 4: Run the Frontend
```bash
cd meditrack-ui
npm install
npm run dev
```
The application will start on `http://localhost:3000`.

## 🧪 Testing
The solution includes xUnit test coverage ensuring core CQRS application logic functions as expected.
```bash
dotnet test
```

## 📦 Deployment
The project includes a multi-stage `Dockerfile` for the backend and a complete `docker-compose.yml` to orchestrate the entire platform. A GitHub Actions CI workflow (`ci.yml`) is also included for continuous integration.
