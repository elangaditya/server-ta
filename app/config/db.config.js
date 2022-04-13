module.exports = {
    HOST: process.env.NODE_ENV !== 'production' ? 'localhost' : '/cloudsql/tugas-akhir-344812:asia-southeast2:database-tugas-akhir',
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
