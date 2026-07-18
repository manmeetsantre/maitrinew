# Maitri 🧠

**Revolutionizing Mental Health Support for Indian Higher Education Students**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

---

## 🚀 Quick Start (For Judges)

### Step 1: Clone the Repository
```bash
git clone https://github.com/SHREESH-git/ASTRONOMY.git
cd ASTRONOMY
```

### Step 2: Start Everything (One Command!)
```bash
npm start
```

**That's it!** The script will automatically:
- ✅ Check and install all dependencies (Node.js, Python, ffmpeg)
- ✅ Install all npm and pip packages
- ✅ Start all 5 services
- ✅ Verify everything is running

### Step 3: Access the Application
Open your browser and go to: **http://localhost:8080**

### Service URLs
- **Main Application**: http://localhost:8080
- **Backend API**: http://localhost:4000
- **TARS (AI Chat)**: http://localhost:5173
- **Mood Tracker**: http://localhost:5002
- **Voice Analysis**: http://localhost:5000

### Prerequisites (Auto-checked by script)
- Node.js (v18+) - [Download](https://nodejs.org/)
- Python 3.8+ - [Download](https://www.python.org/)
- ffmpeg - Auto-installed on Windows
- Ollama (optional) - [Download](https://ollama.ai/download) for TARS offline mode

### Troubleshooting
If `npm start` doesn't work, see [HACKATHON_SETUP.md](HACKATHON_SETUP.md) for detailed setup instructions.

---

## 📋 Table of Contents
- [About the Project](#-about-the-project)
- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Deployment](#-deployment)
- [Team](#-team)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

## 🎯 About the Project

Maitri is a comprehensive digital mental health platform specifically designed for Indian higher education students. Our platform leverages cutting-edge AI and machine learning technologies to provide accessible, anonymous, and effective mental health support, addressing the critical gap in mental health services for India's student population.

**Target Users**: Undergraduate and postgraduate students in Indian universities and colleges
**Impact Goal**: Provide 24/7 mental health support to millions of students nationwide

## 🚨 Problem Statement

In India, mental health challenges among students have reached epidemic proportions:
- **37%** of students experience depression and anxiety during exam periods
- Only **0.75 psychologists** per 100,000 people nationwide
- **80%** of students hesitate to seek help due to cultural stigma
- Limited access to professional counseling in remote areas
- Lack of scalable mental health infrastructure in educational institutions

Traditional mental health services are insufficient to meet the growing demand, creating an urgent need for innovative digital solutions.

## 💡 Solution Overview

Maitri bridges the mental health gap through:
- **AI-Powered Support**: 24/7 intelligent conversational AI for immediate assistance
- **Predictive Analytics**: ML models that detect early warning signs of mental health issues
- **Community Building**: Safe peer support networks and mentorship programs
- **Cultural Adaptation**: Content and interfaces tailored for Indian cultural contexts
- **Accessibility First**: Universal design ensuring support for all students regardless of abilities

## 🌟 Key Features

### 🤖 AI & ML Capabilities
- **Intelligent Chat Assistant**: NLP-powered conversations with therapeutic techniques
- **Mood Prediction**: TensorFlow models forecasting mental health trends
- **Sentiment Analysis**: Real-time emotion detection in journals and chats
- **Personalized Recommendations**: AI-driven wellness suggestions

### 📊 Mental Health Tools
- **Digital Journaling**: Secure, private journaling with mood correlation analysis
- **Mood Tracking**: Visual mood charts with pattern recognition
- **Wellness Activities**: Guided meditation, breathing exercises, and mindfulness sessions
- **Assessment Tools**: Comprehensive mental health evaluations with detailed reports

### 🌍 Community & Support
- **Peer Support Network**: Verified community for sharing experiences
- **Mentorship Program**: Connecting students with trained peer mentors
- **Professional Counseling**: Session booking with qualified therapists
- **Anonymous Support Groups**: Topic-based discussion forums

### 🛡️ Security & Privacy
- **End-to-End Encryption**: Zero-knowledge architecture for user data
- **GDPR Compliance**: International privacy standards implementation
- **Multi-Factor Authentication**: Advanced security protocols
- **Audit Trails**: Comprehensive logging for accountability

### 🎯 Accessibility Features
- **Multi-language Support**: Hindi and English interfaces
- **WCAG 2.1 AAA Compliance**: Full accessibility for users with disabilities
- **Offline Capability**: Core features available without internet
- **Voice Interface**: Natural language processing for hands-free interaction

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern component-based UI framework
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **React Router** - Client-side routing
- **React Query** - Server state management

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Server-side type safety
- **SQLite** - Lightweight relational database
- **JWT** - Secure authentication tokens
- **Socket.io** - Real-time bidirectional communication

### AI & Machine Learning
- **Python 3.8+** - ML development environment
- **TensorFlow/Keras** - Deep learning frameworks
- **BERT Models** - Natural language processing
- **Scikit-learn** - Traditional ML algorithms
- **Gemini AI** - Advanced conversational AI

### Additional Tools
- **Chart.js/Recharts** - Data visualization libraries
- **Spline** - 3D interactive graphics
- **bcryptjs** - Password hashing
- **date-fns** - Date utility functions

## 📦 Installation & Setup

> **👆 See [Quick Start](#-quick-start-for-judges) section above for the fastest way to run the project!**

### Prerequisites
- Node.js (v18 or higher) - [Download](https://nodejs.org/)
- npm or bun package manager
- Python 3.8+ (for ML components) - [Download](https://www.python.org/)
- ffmpeg (for voice analysis) - Auto-installed on Windows
- Ollama (optional, for TARS offline mode) - [Download](https://ollama.ai/download)
- Git

### Manual Setup (If Quick Start Doesn't Work)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/SHREESH-git/Techfiesta.git
   cd Techfiesta
   ```

2. **Install All Dependencies**
   ```bash
   # Main dependencies
   npm install
   
   # TARS dependencies
   cd TARS && npm install && cd ..
   
   # Python dependencies
   pip install -r moodtracker/requirements.txt
   pip install -r Voice/requirements.txt
   ```

3. **Set Up Environment Variables (Optional)**

   Create a `.env` file in the root directory:
   ```env
   VITE_MINDCARE_BASE_URL=http://localhost:4000
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Start All Services**

   **Option 1: One Command (Recommended)**
   ```bash
   npm start
   ```

   **Option 2: Individual Services**
   ```bash
   # Terminal 1: Frontend + Backend
   npm run dev:full

   # Terminal 2: TARS (AI Chat)
   cd TARS && npm run dev

   # Terminal 3: Mood Tracker
   cd moodtracker && python main.py

   # Terminal 4: Voice Analysis
   cd Voice && python voice_assistant.py
   ```

### Service URLs

After starting, access services at:
- **Main Application**: http://localhost:8080
- **Backend API**: http://localhost:4000
- **TARS (AI Chat)**: http://localhost:5173
- **Mood Tracker**: http://localhost:5002
- **Voice Analysis**: http://localhost:5000

## 🚀 Usage

### For Students
1. **Sign Up/Login**: Create account with university email verification
2. **Complete Assessment**: Initial mental health evaluation
3. **Access Features**: Use AI chat, journal, mood tracker, and community
4. **Book Sessions**: Schedule counseling with professionals
5. **Track Progress**: Monitor mental health journey with analytics

### For Administrators
1. **Dashboard Access**: Login to admin panel
2. **User Management**: Monitor student engagement and support needs
3. **Analytics Review**: Access institution-wide mental health trends
4. **Content Management**: Update resources and assessment tools

### API Usage Examples

**Authentication:**
```javascript
POST /api/auth/login
{
  "email": "student@university.edu",
  "password": "securepassword"
}
```

**AI Chat:**
```javascript
POST /api/chat
{
  "message": "I'm feeling anxious about exams",
  "userId": "user123"
}
```

## 📁 Project Structure

```
Maitri/
├── public/                    # Static assets and favicons
├── src/                       # Frontend source code
│   ├── components/           # Reusable UI components
│   ├── pages/               # Page components and routes
│   ├── contexts/            # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and configurations
│   └── data/                # Static data and constants
├── server/                   # Backend server
│   └── src/
│       ├── routes/          # API route handlers
│       ├── data/            # Database seeds and configurations
│       └── middleware/      # Express middleware
├── mindcare-chatbot/        # AI chatbot service
├── moodtracker/             # ML mood tracking service
├── Voice/                   # Voice assistant components
└── package.json
```

## 🤝 Contributing

We welcome contributions from developers, mental health professionals, and students!

### Development Guidelines
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Follow** TypeScript best practices and accessibility standards
4. **Test** your changes thoroughly
5. **Commit** with clear messages: `git commit -m 'Add: feature description'`
6. **Push** to your branch: `git push origin feature/your-feature-name`
7. **Open** a Pull Request with detailed description

### Code Standards
- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Maintain WCAG 2.1 AAA accessibility standards
- Write comprehensive tests for new features
- Document API endpoints and components

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run preview
```

### Deployment Options
- **Vercel/Netlify**: Frontend deployment with serverless functions
- **Railway/Render**: Full-stack deployment with database
- **AWS/DigitalOcean**: Cloud infrastructure for scalability

### Environment Setup for Production
```env
NODE_ENV=production
JWT_SECRET=your_production_secret
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_production_api_key
```

## 👥 Team

### Core Development Team
- **Project Lead && Project Architect**: [Ayush Shevde] - Full-stack Development & AI Integration
- **Frontend Developer**: [Manmeet Santre] - React/TypeScript & UI/UX
- **Backend Developer**: [Anvit Panhalkar] - Node.js/Express & Database Design
- **ML Engineer**: [Shreesh Jugade] - AI Models & Data Science

### Advisors
- **Mental Health Experts**: Clinical psychologist, psychiatrist and counsellor (more details in ppt)
- **Academic Advisors**: Professor H.B. Mali
- **Technical Mentors**: Industry professionals in healthcare technology

**Contact**: Maitri.2025@gmail.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

### Technical References
- **React Documentation** - Frontend framework guidance
- **TensorFlow Documentation** - Machine learning implementation
- **WCAG Guidelines** - Accessibility standards
- **Mental Health Research Papers** - Domain knowledge and best practices

### Inspiration
- **Indian Mental Health Initiatives** - National health programs
- **Global Digital Health Solutions** - International best practices

### Special Thanks
- **Participating Universities** - For pilot testing and feedback
- **Mental Health Organizations** - For expert guidance and validation
- **Open Source Community** - For tools and libraries that made this possible

---

**Maitri** - Empowering India's future leaders with accessible mental health support. 🧠💙

*Built with ❤️*
