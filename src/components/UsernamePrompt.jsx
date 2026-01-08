import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './UsernamePrompt.css';

export default function UsernamePrompt({ onUsernameSet }) {
  const [username, setUsername] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onUsernameSet(username.trim());
      setIsVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="username-prompt-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="username-prompt-card"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <h1>Welcome to LinkDock</h1>
            <p>What should we call you?</p>
            
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name..."
                autoFocus
                maxLength={30}
              />
              <button type="submit" disabled={!username.trim()}>
                Get Started
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
