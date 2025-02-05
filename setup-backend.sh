# Create and setup backend directory
cd ..
mkdir backend
cd backend

# Initialize npm project
npm init -y

# Install required dependencies
npm install express socket.io mongoose bcrypt jsonwebtoken cors dotenv
npm install --save-dev typescript ts-node @types/express @types/node @types/socket.io
npm install --save-dev @types/bcrypt @types/jsonwebtoken @types/cors nodemon
