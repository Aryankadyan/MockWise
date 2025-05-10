<p align="center">
  <img src="/public/assets/log/MockWise.png"   alt="MockWise Logo"  width="200"/>
</p>

<h1 align="center">MockWise 🎯</h1>

<p align="center">
  <b>AI-Powered Mock Interview Platform</b>  
  <br/>
  Practice, Improve, and Get Hired!
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/Aryankadyan/MockWise?style=flat-square" />
  <img src="https://img.shields.io/github/forks/Aryankadyan/MockWise?style=flat-square" />
  <img src="https://img.shields.io/github/deployments/Aryankadyan/MockWise/production?label=deploy&style=flat-square" />
</p>

---

## 🎥 Demo Walkthrough
Experience MockWise in action! Check out our live demo:
👉[Visit Demo](https://mockwise-8888.web.app)

---

## 🚀 Features

- 🎤 AI-powered interview simulations (technical + behavioral)
- 📋 Real-time feedback and scoring
- 📊 Performance analytics dashboard
- 🔐 Secure authentication with **Clerk**
- 💌 Contact & feedback via **EmailJS**
- 💅 Sleek modern UI built with **ShadCN UI + TailwindCSS**

---

## 🧰 Tech Stack

| Layer            | Technology                             |
|------------------|----------------------------------------|
| Frontend         | React, TypeScript, Vite                |
| Styling          | Tailwind CSS, ShadCN UI                |
| Backend          | Firebase (Firestore, Hosting)          |
| Authentication   | Clerk                                  |
| Email Services   | EmailJS                                |
| AI Integration   | (e.g., OpenAI GPT-4 or Custom LLM API)  |

---

## 📦 Getting Started

Get MockWise up and running locally in just a few steps!

### Prerequisites

- **Node.js**: v14 or higher
- **Firebase**: Set up a Firebase project
- **Clerk**: Create a Clerk account for authentication
- **EmailJS**: Set up an EmailJS account for contact forms
- **Gemini API Key**: For AI-powered features


### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Aryankadyan/MockWise.git
   cd MockWise
   ```

- Install dependencies
  ```bash
  npm install
  ```
  

## Environment Variables

### Create a .env file:
```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Run Locally
```bash
npm run dev
```
**Local Development:** [http://localhost:5173](http://localhost:5173)

## Deployment 
### Deploy using Firebase:
```bash
npm run build
firebase login
firebase init
firebase deploy
```

## Contributing
#### We welcome contributions!
```bash
git checkout -b feature/your-feature
git commit -m "Added feature"
git push origin feature/your-feature
```
#### Then open a Pull Request 🙌

## Contact
- GitHub: @Aryankadyan
- Email: kadyanaryan744@gmail.com

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)


