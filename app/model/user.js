'use strict';

module.exports = app => {
    const { STRING, INTEGER, DATE, NOW, ENUM } = app.Sequelize;
    const RoleEnum = ENUM('admin', 'user');
    const User = app.model.define('users', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        avatar: STRING(255),
        role: RoleEnum,
        username: STRING(30),
        mobile: STRING(11),
        email: STRING(30),
        password: STRING(255),
        lastLogied: {
            type: DATE,
            defaultValue: NOW,
            field: 'last_logied', // 映射到数据库中的字段名
        },
        createdAt: {
            type: DATE,
            defaultValue: NOW,
            field: 'created_at', // 映射到数据库中的字段名
        },
        updatedAt: {
            type: DATE,
            defaultValue: NOW,
            field: 'updated_at', // 映射到数据库中的字段名
        },
        mark: STRING(255),
        mark2: STRING(255),
        token: STRING(255),
    }, {
        // 配置表选项
        timestamps: true, // 启用时间戳
        underscored: false, // 不使用下划线命名，但通过field手动映射
        tableName: 'users', // 明确指定表名
    });

    return User;
};
