const Sequelize = require('sequelize');
/*
module.exports = class user extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unigue: false,
            },
            id: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: false,
            },
            email: {
                type: Sequelize.STRING(30),
                allowNull: false,
                unique: true,
            },
        },{
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'user',
            tableName: 'user',
            paranoid: false,
            charset: utf8,
            collate: 'utf8_general_ci',
        });
    }
    static associate(db){}
};*/