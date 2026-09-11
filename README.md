# National Cyber Defense Platform

🌐 **Live Demo:** [https://anuragkannojiya.github.io/NC-Defense/](https://anuragkannojiya.github.io/NC-Defense/)

The **National Cyber Defense (NCD)** platform is a modern, responsive, single-page web application (SPA) designed for national-scale cybersecurity awareness training, incident reporting, and operational readiness tracking. 

Built using lightweight vanilla web technologies, the platform provides an immersive, enterprise-grade learning environment.

## Key Features
- **13 Interactive Training Modules:** Comprehensive curricula ranging from phishing defense to cloud security, Zero Trust architectures, and secure SDLC.
- **Incident Reporting Center:** A central portal allowing simulated personnel to file security incidents and monitor global threat intelligence.
- **Readiness Leaderboards:** Gamified ranking systems assigning points based on module completions and knowledge quiz scores.
- **Simulations & Assessments:** Hands-on phishing detection simulations and comprehensive 20-question cybersecurity exams.
- **Demo & Production Modes:** Fully offline-capable **Demo Mode** leveraging `localStorage` for rapid testing and demonstrations, with drop-in support for real-time Firebase syncing.

## Architecture
The platform is engineered as a zero-dependency vanilla JavaScript SPA, avoiding heavy frameworks to maximize speed, maintainability, and direct DOM control.
- **Frontend Core:** HTML5, CSS3 (with extensive CSS variables and custom atomic classes), and modern ES6 Module JavaScript.
- **State & Routing:** Custom, lightweight client-side hash router with dynamic component rendering.
- **Data Persistence:** 
  - `localStorage` fallback used for Demo Mode.
  - Pluggable infrastructure for Google Firebase (Authentication & Cloud Firestore).

## Quick Start (Local Development)

### Running the App
To run the project locally without running into CORS issues from module imports, start up a lightweight web server. We provide a custom `serve.py` designed to bypass aggressive browser caching during development:

1. Clone the repository.
2. Open your terminal in the root directory.
3. Start the server:
   ```bash
   python3 serve.py
   ```
4. Open your browser and navigate to `http://localhost:8080/`.

### Activating Demo Mode
When you land on the Login Screen, simply click the **"⚡ Enter Demo Mode"** button. This will automatically scaffold a mock user profile and grant you full access to all dashboards and modules offline.

---

## Production / Firebase Configuration
If you wish to deploy this platform to the cloud with real-time analytics and authentication:

1. Create a project in [Firebase](https://console.firebase.google.com/).
2. Enable **Firestore Database** and **Authentication** (Email/Password).
3. Open `js/config-firebase.js`.
4. Update the `firebaseConfig` block with your project's credentials.
5. Change `export const FIREBASE_CONFIGURED = false;` to `true`.
6. The platform will immediately pivot to using cloud infrastructure for all operations.

## Security Practices
Because this is an educational cybersecurity utility, it strives to demonstrate clean code practices:
- Strict CSP (Content Security Policy) compatibility.
- Clean separation of component views and stateless logic.
- Graceful global error and unhandled rejection interceptors.
