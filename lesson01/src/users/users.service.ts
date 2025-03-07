import { Injectable, Query } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: 'John', email: 'john@gmail.com', role: 'ADMIN' },
    { id: 2, name: 'Jane', email: 'jane@gmail.com', role: 'ENGINEER' },
    { id: 3, name: 'Jim', email: 'jim@gmail.com', role: 'INTERN' },
    { id: 4, name: 'Jill', email: 'jill@gmail.com', role: 'ENGINEER' },
    { id: 5, name: 'Jack', email: 'jack@gmail.com', role: 'INTERN' },
  ];

  findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    if (role) {
      return this.users.filter((user) => user.role === role);
    }
    return this.users;
  }

  findOne(id: number) {
    return this.users.find((user) => user.id === id);
  }

  create(user: {
    name: string;
    email: string;
    role: 'INTERN' | 'ENGINEER' | 'ADMIN';
  }) {
    const usersByHighestId = [...this.users].sort((a, b) => (b.id = a.id));
    const newUser = { ...user, id: usersByHighestId[0].id + 1 };
    return this.users.push(newUser);
  }

  update(
    id: number,
    updatedUser: {
      name?: string;
      email?: string;
      role?: 'INTERN' | 'ENGINEER' | 'ADMIN';
    },
  ) {
    this.users = this.users.map((user) => {
      if (user.id === id) {
        return { ...user, ...updatedUser };
      }
      return user;
    });
  }

  delete(id: number) {
    const removedUser = this.findOne(id);
    this.users = this.users.filter((user) => user.id !== id);

    return removedUser;
  }
}
