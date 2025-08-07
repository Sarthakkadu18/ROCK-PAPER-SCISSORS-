import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const SplineAnimation = ({ 
  width = "100%", 
  height = "100%", 
  showFallback = true,
  onLoad = () => {},
  onError = () => {}
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile for performance optimization
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad();
  };

  const handleError = (error) => {
    console.error('Spline animation failed to load:', error);
    setIsLoading(false);
    setHasError(true);
    onError(error);
  };

  // Fallback component for mobile or when Spline fails to load
  const FallbackAnimation = () => (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated gradient orbs as fallback */}
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(180deg)' }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
          animation: 'float 4s ease-in-out infinite reverse',
          left: '60%',
          top: '20%'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
          animation: 'float 5s ease-in-out infinite',
          left: '20%',
          bottom: '20%'
        }}
      />
    </Box>
  );

  // Don't render Spline on mobile devices for better performance
  if (isMobile && showFallback) {
    return <FallbackAnimation />;
  }

  return (
    <Box
      sx={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.1)',
            zIndex: 2
          }}
        >
          <CircularProgress sx={{ color: 'white', mb: 2 }} />
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Loading 3D Experience...
          </Typography>
        </Box>
      )}

      {hasError ? (
        <FallbackAnimation />
      ) : (
        <iframe
          src="https://my.spline.design/particlenebula-QNOpNVeRYRfGpeCKOC3l8uMb/"
          frameBorder="0"
          width="100%"
          height="100%"
          style={{
            border: 'none',
            background: 'transparent',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out'
          }}
          onLoad={handleLoad}
          onError={handleError}
          title="MindVerse 3D Animation"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      )}
    </Box>
  );
};

export default SplineAnimation;