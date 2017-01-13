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
    path: '/signup',
    handler: require('./controllers/signup'),
  },
];