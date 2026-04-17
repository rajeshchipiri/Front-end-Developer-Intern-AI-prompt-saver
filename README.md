# AI Prompt Library Application

A full-stack web application for storing and managing AI image generation prompts. Built as part of a technical assignment to demonstrate proficiency in Django, Angular, Redis, and Docker.

## 🚀 Tech Stack

- **Frontend:** Angular 15
- **Backend:** Python 3.12 with Django (Plain views, no DRF)
- **Database:** PostgreSQL 15
- **Cache/Counter:** Redis 7
- **Containerization:** Docker & Docker Compose

## ✨ Features

- **Prompt Management:** View a list of saved prompts with complexity indicators.
- **Detailed View:** Open any prompt to see its full content and a live view count.
- **Dynamic Counter:** Redis-powered view counter that increments on every detail view.
- **Smart Forms:** Reactive Angular forms with real-time validation for adding new prompts.
- **Modern UI:** Glassmorphism-inspired dark theme with responsive card layouts and smooth transitions.
- **Containerized:** Run the entire stack with a single command.

## 🛠 Prerequisites

Ensure you have the following installed:
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## 🏃 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ai-prompt-library
   ```

2. **Start the application with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - **Frontend:** [http://localhost:4200](http://localhost:4200)
   - **Backend API:** [http://localhost:8000](http://localhost:8000)

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/prompts/` | List all prompts |
| POST | `/prompts/` | Create a new prompt |
| GET | `/prompts/:id/` | Retrieve a prompt + increment view count |

## 📐 Architectural Decisions

- **Plain Django Views:** Implemented standard Django views using `JsonResponse` as requested, avoiding Django Rest Framework to keep the core logic visible and lightweight.
- **Redis for View Count:** Redis is used as the source of truth for prompt views. This ensures fast, atomic increments that don't burden the primary PostgreSQL database.
- **Modern Angular:** Utilized Angular 15 with Reactive Forms for robust client-side validation and a service-based architecture for clean API interactions.
- **Glassmorphism Design:** Focused on a premium "Rich Aesthetic" using custom CSS, avoiding traditional frameworks to show flexibility in design implementation.

## 📸 Screenshots

*(Add screenshots here after running the app)*

## 🤝 Submission Information

- **GitHub Repository:** [Your Link Here]
- **Screen Recording:** [Your Link Here]
