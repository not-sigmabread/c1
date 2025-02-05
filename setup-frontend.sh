# Create project directory
mkdir chat-website
cd chat-website

# Create frontend directory and initialize
mkdir frontend
cd frontend

# Initialize npm project
npm init -y

# Install required dependencies
npm install react react-dom react-router-dom @types/react @types/react-dom typescript
npm install @types/node sass socket.io-client @emotion/react
npm install --save-dev vite @vitejs/plugin-react typescript @types/react @types/react-dom
