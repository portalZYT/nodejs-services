'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  constructor(ctx) {
    super(ctx);
    // Mock data store - in a real app, this would be a database
    this.users = [
      { id: '1', name: 'Alice', email: 'alice@example.com' },
      { id: '2', name: 'Bob', email: 'bob@example.com' },
      { id: '3', name: 'Charlie', email: 'charlie@example.com' },
    ];
  }

  async list() {
    return this.users;
  }

  async find(id) {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    return user;
  }

  async create({ name, email }) {
    const id = String(this.users.length + 1);
    const user = { id, name, email };
    this.users.push(user);
    return user;
  }
}

module.exports = UserService;
