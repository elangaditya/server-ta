module.exports = {
    HOST: process.env.NODE_ENV !== 'production' ? 'localhost' : process.env.DB_HOST,
    USER: process.env.NODE_ENV !== 'production' ? 'root' : process.env.DB_USERNAME,
    PASSWORD: process.env.NODE_ENV !== 'production' ? '123456' : process.env.DB_PASSWORD,
    DB: process.env.NODE_ENV !== 'production' ? 'tugasakhir' : 'tugas_akhir',
    dialect: 'mysql',
    dialectOptions: {
        socketPath: process.env.DB_HOST,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
