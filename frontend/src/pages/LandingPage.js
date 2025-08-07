import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Avatar,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  useScrollTrigger,
  Slide,
  Fab,
  Zoom
} from '@mui/material';
import {
  Psychology,
  AutoAwesome,
  Favorite,
  Security,
  Language,
  VolumeUp,
  KeyboardArrowUp,
  MenuBook,
  EmojiObjects,
  SelfImprovement,
  Star,
  PlayArrow
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

// Custom components
import SplineAnimation from '../components/3d/SplineAnimation';
import TwistedText from '../components/animations/TwistedText';
import InteractiveDroplets from '../components/animations/InteractiveDroplets';
import CountUp from 'react-countup';

// Scroll to top component
function ScrollTop() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={trigger}>
      <Fab
        onClick={handleClick}
        color="primary"
        size="small"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
      >
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  );
}

// Hide app bar on scroll
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [particlesLoaded, setParticlesLoaded] = useState(false);

  const particlesInit = async (engine) => {
    await loadFull(engine);
    setParticlesLoaded(true);
  };

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      role: "Mental Health Advocate",
      content: "MindVerse has been a game-changer for my daily mindfulness practice. The AI-powered guidance feels so personal and relevant.",
      rating: 5
    },
    {
      name: "Dr. Raj Patel",
      avatar: "/avatars/raj.jpg", 
      role: "Therapist",
      content: "I recommend MindVerse to my clients. The integration of ancient wisdom with modern technology is brilliant.",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      avatar: "/avatars/maria.jpg",
      role: "Yoga Instructor", 
      content: "The personalized spiritual guidance has helped me connect deeper with my practice and my students.",
      rating: 5
    }
  ];

  // Features data
  const features = [
    {
      icon: <Psychology />,
      title: "AI-Powered Analysis",
      description: "Advanced NLP analyzes your emotions and problems to provide personalized guidance"
    },
    {
      icon: <MenuBook />,
      title: "Ancient Wisdom",
      description: "Access profound teachings from Bhagavad Gita, Quran, Bible, and other sacred texts"
    },
    {
      icon: <Language />,
      title: "Multi-Language Support", 
      description: "Get guidance in your preferred language with accurate translations"
    },
    {
      icon: <VolumeUp />,
      title: "Voice Interaction",
      description: "Speak your problems and listen to guidance with our voice AI assistant"
    },
    {
      icon: <Security />,
      title: "Private & Secure",
      description: "Your personal journey is completely private and securely encrypted"
    },
    {
      icon: <AutoAwesome />,
      title: "Karma System",
      description: "Earn and spend Karma points for a gamified wellness experience"
    }
  ];

  // Stats data
  const stats = [
    { label: "Users Helped", value: 10000, suffix: "+" },
    { label: "Wisdom Texts", value: 15, suffix: "" },
    { label: "Languages", value: 7, suffix: "" },
    { label: "Success Rate", value: 95, suffix: "%" }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <>
      <Helmet>
        <title>MindVerse - AI-Powered Mental Wellness Guide</title>
        <meta name="description" content="Find peace, wisdom, and guidance through ancient spiritual texts and modern AI technology. Your personal journey to mental wellness starts here." />
      </Helmet>

      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: { value: "transparent" }
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 200, duration: 0.4 },
            },
          },
          particles: {
            color: { value: "#4f46e5" },
            links: {
              color: "#4f46e5",
              distance: 150,
              enable: true,
              opacity: 0.1,
              width: 1,
            },
            collisions: { enable: true },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "bounce" },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 80,
            },
            opacity: { value: 0.2 },
            shape: { type: "circle" },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />

      {/* Navigation */}
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            color: 'text.primary'
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}>
              MindVerse
            </Typography>
            <Button color="inherit" component={Link} to="/about">About</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button variant="contained" component={Link} to="/register" sx={{ ml: 2 }}>
              Get Started
            </Button>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* Interactive Droplets */}
        <InteractiveDroplets />
        
        {/* 3D Spline Animation */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        >
          <SplineAnimation />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <TwistedText 
                  text="MindVerse"
                  className="hero-title"
                  style={{
                    fontSize: '4rem',
                    fontWeight: 700,
                    color: 'white',
                    marginBottom: '1rem',
                    fontFamily: '"Playfair Display", serif'
                  }}
                />
                
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    mb: 3,
                    fontWeight: 300
                  }}
                >
                  Your AI-Powered Mental Wellness Guide
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    mb: 4,
                    lineHeight: 1.6
                  }}
                >
                  Find peace, wisdom, and guidance through ancient spiritual texts 
                  and modern AI technology. Your personal journey to mental wellness starts here.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                      },
                      px: 4,
                      py: 1.5
                    }}
                  >
                    Start Your Journey
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                      px: 4,
                      py: 1.5
                    }}
                  >
                    Watch Demo
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, background: 'background.default' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h2" align="center" sx={{ mb: 2 }}>
              Why Choose MindVerse?
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
              Combining ancient wisdom with cutting-edge AI technology
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          width: 64,
                          height: 64,
                          mx: 'auto',
                          mb: 2
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Box textAlign="center">
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        color: 'white', 
                        fontWeight: 700,
                        mb: 1
                      }}
                    >
                      <CountUp end={stat.value} duration={2.5} />
                      {stat.suffix}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 10, background: 'background.paper' }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h2" align="center" sx={{ mb: 6 }}>
              What Our Users Say
            </Typography>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Avatar
                  src={testimonials[currentTestimonial].avatar}
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                />
                <Box sx={{ mb: 2 }}>
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} sx={{ color: '#f59e0b' }} />
                  ))}
                </Box>
                <Typography variant="h6" sx={{ mb: 2, fontStyle: 'italic' }}>
                  "{testimonials[currentTestimonial].content}"
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {testimonials[currentTestimonial].name}
                </Typography>
                <Typography color="text.secondary">
                  {testimonials[currentTestimonial].role}
                </Typography>
              </Card>
            </motion.div>
          </AnimatePresence>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
            {testimonials.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: index === currentTestimonial ? 'primary.main' : 'grey.300',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box textAlign="center">
              <Typography variant="h2" sx={{ color: 'white', mb: 2 }}>
                Ready to Begin Your Journey?
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 4 }}>
                Join thousands of users who have found peace and guidance through MindVerse
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
              >
                Start Free Today
              </Button>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 2 }}>
                Get 150 free Karma points • No credit card required
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <ScrollTop />
    </>
  );
};

export default LandingPage;