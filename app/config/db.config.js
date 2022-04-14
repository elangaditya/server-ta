module.exports = {
    HOST: process.env.NODE_ENV !== 'production' ? 'localhost' : process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.NODE_ENV !== 'production' ? '123456' : process.env.DB_PASSWORD,
    DB: process.env.NODE_ENV !== 'production' ? 'tugasakhir' : 'data_tugas_akhir',
    dialect: 'mysql',
    dialectOptions: {
        socketPath: process.env.DB_HOST,
    },
};
