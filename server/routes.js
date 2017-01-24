module.exports = [
  {
    path: '/',
    handler: require('./controllers/home'),
  },
  {
    path: '/login',
    handler: require('./controllers/login'),
  },
  {
    path: '/auth',
    handler: require('./controllers/auth'),
  },
  {
    path: '/signup',
    handler: require('./controllers/signup'),
  },
  {
    path: '/profile',
    handler: require('./controllers/profile'),
    restricted: true
  },
  {
    path: '/logout',
    handler: require('./controllers/logout'),
  }
];