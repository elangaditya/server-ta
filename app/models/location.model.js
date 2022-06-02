module.exports = (sequelize, Sequelize) => {
  const Location = sequelize.define('Location', {
    mode: {
      type: Sequelize.STRING,
    },
    lat: {
      type: Sequelize.STRING,
    },
    long: {
      type: Sequelize.STRING,
    },
    auth: {
      type: Sequelize.STRING,
    },
    device_imei: {
      type: Sequelize.STRING,
    },
  });

  return Location;
};
