module.exports = {
    HOST: process.env.NODE_ENV !== 'production' ? 'localhost' : process.env.DB_HOST,
    USER: 'ta-server',
    PASSWORD: process.env.NODE_ENV !== 'production' ? '123456' : process.env.DB_PASSWORD,
    DB: process.env.NODE_ENV !== 'production' ? 'tugasakhir' : 'data_tugas_akhir',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
