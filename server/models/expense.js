const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./user");


const Expense = sequelize.define('expense', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User);

sequelize.sync()
    .then(() => {
        console.log('All models were synchronized successfully.');
    })
    .catch((error) => {
        console.error('Unable to synchronize the models:', error);
    });

module.exports = Expense;
