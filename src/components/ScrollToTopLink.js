import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

const ScrollToTopLink = ({ children, to, ...props }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    // Если это якорная ссылка (начинается с #)
    if (to.startsWith('#')) {
      e.preventDefault();
      
      // Если мы уже на главной странице
      if (window.location.pathname === '/') {
        const element = document.querySelector(to);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Если не на главной - переходим на главную с хэшем
        navigate(`/${to}`);
      }
    } else {
      // Обычная навигация
      window.scrollTo(0, 0);
    }
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default ScrollToTopLink;