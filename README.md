# WriteLoop - AI Content Generation SaaS Platform

**🚀 Live Demo:** [https://write-loop-2za90xjjn-pranav-s-projects88.vercel.app](https://write-loop-2za90xjjn-pranav-s-projects88.vercel.app)

A production-ready SaaS application for AI content generation, featuring a modern React frontend and a robust FastAPI backend.

## Architecture

- **Frontend**: React, TypeScript, Tailwind CSS, Vite, Zustand
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, PyJWT, OpenAI API

## Features

- **Authentication**: JWT-based login and registration.
- **AI Generation**: Integrates with OpenAI to generate blogs, emails, social media posts, etc.
- **Templates**: Dynamic prompt templates for different content categories.
- **Content History**: View, search, and copy previously generated content.
- **Usage Analytics**: Dashboard to track tokens used and generations by category.
- **Responsive UI**: Clean, modern, accessible design.

## Project Structure

- `/frontend` - React application (Vite)
- `/backend` - FastAPI Python server

---

## Native Local Setup Instructions

Follow these steps to run the application directly on your host machine (no Docker required).

### 1. Database Setup (PostgreSQL)

You must have PostgreSQL installed and running on your computer.

1. Create a user named `postgres` with the password `postgres`.
2. Create a database named `saas_db`.

*(If you are on macOS using Homebrew, you can do this via:)*
```bash
brew install postgresql@15
brew services start postgresql@15
psql postgres -c "CREATE ROLE postgres WITH LOGIN PASSWORD 'postgres';"
psql postgres -c "ALTER ROLE postgres CREATEDB;"
psql postgres -U postgres -c "CREATE DATABASE saas_db;"
```

*(Note: If you use different database credentials, update the `DATABASE_URL` in `backend/app/core/config.py` or provide it in a `.env` file).*

### 2. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with the default admin and templates
python seed.py

# Start the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
The backend API is now running at **http://localhost:8000**.
API Documentation is available at **http://localhost:8000/api/v1/openapi.json**.

### 3. Frontend Setup

Open a **new** terminal window and navigate to the frontend directory:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend is now running at **http://localhost:3000** and will automatically proxy `/api` requests to your local backend.

## Default Credentials

A default admin user is seeded into the database upon running `seed.py`:
- **Email**: admin@example.com
- **Password**: admin123

## Configuration

To use the actual OpenAI API instead of the simulated fallback, you can create a `.env` file inside the `/backend` directory and add your key:
```env
OPENAI_API_KEY=your-real-api-key-here
SECRET_KEY=your-secure-random-string
```
