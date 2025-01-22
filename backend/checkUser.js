/* eslint-env node */
/* eslint-disable no-undef */

const User = require('./models/User');

User.findOne({ $or: [{ email: 'parent-1@gmail.com' }, { username: 'parent_test' }] })
  .then(user => {
    console.log(user ? 'Utilisateur trouvé:' : 'Aucun utilisateur trouvé');
    console.log(user);
    process.exit(0);
  })
  .catch(err => {
    console.error('Erreur:', err);
    process.exit(1);
  });