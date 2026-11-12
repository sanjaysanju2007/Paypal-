# 💙 SpendWise AI – Intelligent Money Management Platform

<p align="center">
  <strong>Manage Money Smarter. Save Better. Live Better.</strong>
</p>

<p align="center">
  An AI-powered financial management platform that helps users track expenses, analyze spending habits, manage budgets, and achieve financial goals.
</p>

---

## 🌟 About the Project

**SpendWise AI** is a smart financial management platform designed to make personal finance easier, smarter, and more interactive.

By combining Artificial Intelligence with PayPal integration, SpendWise AI helps users understand their financial behavior, track transactions, manage budgets, and make better financial decisions.

The platform provides personalized AI-powered financial insights and a modern fintech experience with premium blue glassmorphism, smooth animations, and interactive dashboards.

## ✨ Key Features

### 📊 1. Smart Dashboard
- View total balance, income, expenses, and savings.
- Monitor financial activities.
- Visualize monthly income and expenses.
- View recent transactions.
- Get AI-generated financial summaries.

### 🤖 2. AI Financial Advisor
- Analyze spending patterns.
- Automatically categorize expenses.
- Identify unnecessary spending.
- Generate personalized saving suggestions.
- Answer financial questions.
- Provide monthly financial summaries.

### 💳 3. PayPal Payment Integration
- Secure PayPal checkout experience.
- PayPal Sandbox integration.
- Create and capture payment orders.
- Track payment status.
- View payment history.

### 💰 4. Budget Management
- Create monthly budgets.
- Set category-wise spending limits.
- Track expenses against budgets.
- Receive overspending alerts.

### 🎯 5. Savings Goals
- Create personalized savings goals.
- Track saving progress.
- Set target amounts and dates.
- Monitor financial achievements.

### 📈 6. Spending Analytics
- Monthly spending trends.
- Category-wise expense breakdown.
- Income vs expense comparison.
- Interactive financial charts.

### 🔔 7. Smart Spending Alerts
- Detect unusual spending patterns.
- Receive budget notifications.
- Identify recurring expenses.

### 🎨 8. Premium User Interface
- Blue glassmorphism design.
- Light and Dark theme switching.
- Smooth page transitions.
- Interactive animations.
- Responsive layouts.
- Modern fintech dashboard.

---

## 🛠️ Technologies Used

| Category | Technology |
|---|---|
| Frontend | React.js |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Backend | Node.js & Express.js |
| Database | MongoDB |
| Artificial Intelligence | Google Gemini API |
| Payment Gateway | PayPal Developer API |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| Version Control | Git & GitHub |

*Update this list to match the technologies actually implemented in your project.*

---

## 🏗️ System Architecture

```text
              SPENDWISE AI
                    |
          React Frontend (Vite)
                    |
          Node.js / Express API
                    |
        +-----------+-----------+
        |           |           |
      Gemini      PayPal     MongoDB
       API        Sandbox    Database
        |           |           |
        +-----------+-----------+
                    |
          Financial Insights
          Payment Management
          Expense Analytics
```

---

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Install the following:

- Node.js
- npm
- Git
- MongoDB (if using MongoDB locally)
- PayPal Developer Account
- Google Gemini API Key

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd spendwise-ai
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Install Backend Dependencies

Navigate to the backend folder:

```bash
cd backend
npm install
```

### 5. Configure Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key

PAYPAL_CLIENT_ID=your_paypal_client_id

PAYPAL_CLIENT_SECRET=your_paypal_client_secret

PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
```

Do not upload your actual `.env` file to GitHub.

### 6. Start the Backend

```bash
npm run dev
```

### 7. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

*Adjust these commands to match your actual folder structure and package.json scripts.*

---

## 🔐 PayPal Sandbox Configuration

SpendWise AI uses the PayPal Sandbox environment for testing payments.

1. Visit [PayPal Developer Dashboard](https://developer.paypal.com/).
2. Log in to your developer account.
3. Navigate to Apps & Credentials.
4. Select Sandbox.
5. Create or select your Sandbox application.
6. Copy the Client ID and Secret.
7. Add the credentials to your backend `.env` file.

Sandbox payments use virtual money and do not transfer real funds.

**Security:** Never expose your PayPal Client Secret or other private API keys in frontend code or public repositories.

---

## 🧠 AI Integration

SpendWise AI uses an AI model to provide intelligent financial assistance.

The AI analyzes transaction data to:

- Understand spending behavior.
- Categorize expenses.
- Generate savings recommendations.
- Identify unusual spending.
- Provide personalized financial insights.

AI recommendations are informational and should not be treated as professional financial advice.

---

## 🎨 Theme Support

SpendWise AI provides two visual modes:

**Dark Mode**
- Midnight blue backgrounds.
- Electric blue highlights.
- Premium dark glassmorphism.

**Light Mode**
- Clean white backgrounds.
- Soft blue surfaces.
- Frosted glass effects.

Users can switch between themes without refreshing the application.

---

## 🔒 Security

- API credentials are stored in environment variables.
- PayPal payment capture is handled by the backend.
- Sensitive credentials are never committed to GitHub.
- Payment status is verified through PayPal.
- Input validation and error handling are implemented.

---

## 📸 Screenshots

Add your actual application screenshots here.

```text
screenshots/
    dashboard.png
    transactions.png
    ai-advisor.png
    payments.png
    analytics.png
    light-mode.png
```

Example:

```markdown
![Dashboard](screenshots/dashboard.png)
```

---

## 🌐 Live Demo

**Demo URL:** Add your deployed application URL here.

**Demo Video:** Add your public YouTube demo link here.

---

## 🏆 Hackathon

Built for the **PayPal AI Hackathon 2026**.

The project combines PayPal payment capabilities and Artificial Intelligence to explore smarter financial management experiences.

---

## 🔮 Future Enhancements

- Advanced AI financial predictions.
- Smart subscription management.
- Automated savings recommendations.
- Multi-currency financial tracking.
- Advanced fraud detection.
- Personalized financial health scoring.
- Intelligent financial planning.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for details.

---

## 💙 Acknowledgements

- PayPal Developer Platform
- Google Gemini
- Open-source developer community
- Devpost PayPal AI Hackathon

<p align="center">
  <strong>SpendWise AI – Your Money, Your Intelligence, Your Future.</strong>
</p>
