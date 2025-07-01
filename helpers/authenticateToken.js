const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];

    console.log(authHeader,"dddddddd");
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    next();
  };

module.exports={authenticateToken}