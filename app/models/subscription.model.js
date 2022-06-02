module.exports = (sequelize, Sequelize) => {
  const Subscription = sequelize.define('Subscription', {
    endpoint: {
      type: Sequelize.STRING,
    },
    p256dh: {
      type: Sequelize.STRING,
    },
    auth: {
      type: Sequelize.STRING,
    },
  });

  return Subscription;
};
