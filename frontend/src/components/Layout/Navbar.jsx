import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaDumbbell, FaUtensils, FaBullseye, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.active ? '#667eea' : '#666'};
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  transition: all 0.3s ease;

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const LogoutButton = styled(motion.button)`
  background: transparent;
  color: #666;
  border: 2px solid #e1e5e9;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: #ff4757;
    border-color: #ff4757;
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FaDumbbell /> },
    { path: '/workouts', label: 'Workouts', icon: <FaDumbbell /> },
    { path: '/nutrition', label: 'Nutrition', icon: <FaUtensils /> },
    { path: '/goals', label: 'Goals', icon: <FaBullseye /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
  ];

  return (
    <Nav>
      <NavContent>
        <Logo to="/">
          <FaDumbbell />
          FitTrack
        </Logo>

        {user && (
          <NavLinks>
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                active={location.pathname === item.path ? 1 : 0}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
            <LogoutButton
              onClick={logout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignOutAlt />
              Logout
            </LogoutButton>
          </NavLinks>
        )}
      </NavContent>
    </Nav>
  );
};

export default Navbar;