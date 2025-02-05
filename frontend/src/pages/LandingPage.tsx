import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface LoginForm {
  username: string;
  password: string;
}

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, guestLogin } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string>('');
  const [form, setForm] = useState<LoginForm>({
    username: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(form.username, form.password);
      navigate('/chat');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const handleGuestLogin = async () => {
    try {
      await guestLogin();
      navigate('/chat');
    } catch (err) {
      setError('Failed to login as guest');
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <h1>Welcome to ChatApp</h1>
        
        <div className="auth-box">
          <div className="auth-tabs">
            <button 
              className={!isRegistering ? 'active' : ''} 
              onClick={() => setIsRegistering(false)}
            >
              Login
            </button>
            <button 
              className={isRegistering ? 'active' : ''} 
              onClick={() => setIsRegistering(true)}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={form.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-button">
              {isRegistering ? 'Register' : 'Login'}
            </button>

            <div className="separator">
              <span>OR</span>
            </div>

            <button 
              type="button" 
              className="guest-button"
              onClick={handleGuestLogin}
            >
              Continue as Guest
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
