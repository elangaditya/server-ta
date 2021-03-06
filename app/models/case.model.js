module.exports = (sequelize, Sequelize) => {
  const Case = sequelize.define('Case', {
    ownerName: {
      type: Sequelize.STRING,
    },
    vehicleName: {
      type: Sequelize.STRING,
    },
    color: {
      type: Sequelize.STRING,
    },
    licensePlate: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      // 0 = not taken, 1 = on progress, 2 = completed
    },
  });

  return Case;
};
