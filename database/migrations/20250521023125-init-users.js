'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const table = await queryInterface.describeTable('users');
    if (!table.mark) {
      await queryInterface.addColumn('users', 'mark', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '备注',
      });
    }
    if (!table.mark2) {
      await queryInterface.addColumn('users', 'mark2', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: '备注2',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users', 'mark');
  }
};
