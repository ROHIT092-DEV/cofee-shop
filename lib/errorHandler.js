export function handleApiError(error, context = '') {
  console.error(`API Error ${context}:`, error);
  
  if (error.name === 'JsonWebTokenError') {
    return { error: 'Invalid token', status: 401 };
  }
  
  if (error.name === 'TokenExpiredError') {
    return { error: 'Token expired', status: 401 };
  }
  
  if (error.message.includes('JWT_SECRET')) {
    return { error: 'Server configuration error', status: 500 };
  }
  
  return { error: error.message || 'Internal server error', status: 500 };
}