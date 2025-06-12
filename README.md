# AI-Powered Document Chatbot

An intelligent chatbot application that can answer questions based on uploaded documents and general knowledge using Google's Gemini AI.

## Features

- 💬 Interactive chat interface
- 📄 Document upload and processing (PDF, TXT, DOCX)
- 🤖 AI-powered responses using Google's Gemini
- 📚 Document-based Q&A
- 💾 Chat history management
- 🎨 Modern, responsive UI
- 🔒 Secure MongoDB database integration

## Tech Stack

### Frontend
- React.js
- Modern CSS with custom styling
- Vercel deployment

### Backend
- Python Flask
- Google Gemini AI API
- MongoDB Atlas
- Render deployment

## Live Demo

- Frontend: [https://chatbot-frontend-brown.vercel.app/](https://chatbot-frontend-brown.vercel.app/)
- Backend: [https://chatbot-backend-53zw.onrender.com](https://chatbot-backend-53zw.onrender.com)

## Project Structure

```
chatbot-project/
├── frontend-new/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js        # Main application component
│   │   └── config.js     # Configuration settings
│   └── public/           # Static files
│
└── backend/              # Flask backend application
    ├── services/         # Business logic services
    ├── models/          # Data models
    ├── routers/         # API routes
    └── app.py           # Main application file
```

## Getting Started

### Prerequisites
- Node.js (for frontend)
- Python 3.9+ (for backend)
- MongoDB Atlas account
- Google Gemini API key

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend-new
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
4. Start development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create `.env` file:
   ```
   GOOGLE_API_KEY=your_google_api_key
   MONGODB_URI=your_mongodb_uri
   ```
5. Start the server:
   ```bash
   python app.py
   ```

## API Endpoints

- `POST /api/chat` - Send a message to the chatbot
- `POST /api/upload-document` - Upload a document for processing
- `GET /api/sessions` - Get all chat sessions
- `POST /api/sessions` - Create a new chat session
- `PUT /api/sessions/<session_id>` - Update a chat session
- `DELETE /api/sessions/<session_id>` - Delete a chat session

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables
4. Deploy

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service in Render
3. Set environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for the AI capabilities
- MongoDB Atlas for database hosting
- Vercel and Render for hosting services 
