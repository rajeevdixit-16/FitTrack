import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaDumbbell, FaHeartbeat, FaChartLine, FaUsers, FaArrowRight, FaPlay, FaStar } from 'react-icons/fa';

// Styled Components
const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  overflow: hidden;
  position: relative;
`;

const BackgroundAnimation = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 5%;
  position: relative;
  z-index: 10;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  
  svg {
    color: #ffd700;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ffd700;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Button = styled(motion.button)`
  background: ${props => props.variant === 'outline' ? 'transparent' : '#ff6b6b'};
  color: white;
  border: ${props => props.variant === 'outline' ? '2px solid white' : 'none'};
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.variant === 'outline' ? 'rgba(255, 255, 255, 0.1)' : '#ff5252'};
    transform: translateY(-2px);
  }
`;

const HeroSection = styled.section`
  padding: 5rem 5%;
  text-align: center;
  position: relative;
  z-index: 5;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #fff, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(motion(Link))`
  background: #ff6b6b;
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
  
  &:hover {
    color: white;
    text-decoration: none;
  }
`;

const SecondaryButton = styled(motion.button)`
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const StatsSection = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 3rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
  
  h3 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    color: #ffd700;
  }
  
  p {
    opacity: 0.8;
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 5%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 3rem;
  margin-bottom: 3rem;
  font-weight: 700;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.2);
  }
  
  svg {
    font-size: 3rem;
    color: #ffd700;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    opacity: 0.8;
    line-height: 1.6;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  backdrop-filter: blur(5px);
`;

const LandingPage = () => {
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <LandingContainer>
      <BackgroundAnimation />
      
      <FloatingElements>
        <FloatingElement
          style={{ width: '100px', height: '100px', top: '10%', left: '10%' }}
          variants={floatingVariants}
          animate="animate"
        />
        <FloatingElement
          style={{ width: '150px', height: '150px', top: '60%', left: '80%' }}
          variants={floatingVariants}
          animate="animate"
        />
        <FloatingElement
          style={{ width: '80px', height: '80px', top: '80%', left: '20%' }}
          variants={floatingVariants}
          animate="animate"
        />
      </FloatingElements>

      <Navbar>
        <Logo>
          <FaDumbbell />
          FitTrack
        </Logo>
        
        <NavLinks>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </NavLinks>
        
        <AuthButtons>
          <Button variant="outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Sign In
            </Link>
          </Button>
          <Button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
              Get Started
            </Link>
          </Button>
        </AuthButtons>
      </Navbar>

      <HeroSection>
        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Transform Your Fitness Journey
        </HeroTitle>
        
        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Track your workouts, monitor your progress, and achieve your fitness goals with our intelligent tracking platform.
        </HeroSubtitle>
        
        <CTAButtons>
          <PrimaryButton
            to="/register"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Free Trial <FaArrowRight />
          </PrimaryButton>
          
          <SecondaryButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlay /> Watch Demo
          </SecondaryButton>
        </CTAButtons>
        
        <StatsSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <StatItem>
            <h3>50K+</h3>
            <p>Active Users</p>
          </StatItem>
          <StatItem>
            <h3>1M+</h3>
            <p>Workouts Logged</p>
          </StatItem>
          <StatItem>
            <h3>95%</h3>
            <p>Success Rate</p>
          </StatItem>
        </StatsSection>
      </HeroSection>

      <FeaturesSection id="features">
        <SectionTitle>Why Choose FitTrack?</SectionTitle>
        
        <FeaturesGrid>
          <FeatureCard
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaChartLine />
            <h3>Progress Tracking</h3>
            <p>Monitor your fitness journey with detailed analytics and progress reports.</p>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDumbbell />
            <h3>Workout Plans</h3>
            <p>Access customized workout plans tailored to your goals and fitness level.</p>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHeartbeat />
            <h3>Health Metrics</h3>
            <p>Track calories, heart rate, and other vital health metrics in one place.</p>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUsers />
            <h3>Community</h3>
            <p>Join a supportive community of fitness enthusiasts and share your progress.</p>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </LandingContainer>
  );
};

export default LandingPage;