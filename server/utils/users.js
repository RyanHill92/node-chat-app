//addUser
//removeUser
//getUser
//userList

//Making a class for the user list which each room will have.
class Users {
  constructor() {
    this.users = [];
  }

  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }

  getUser (id) {
    var user = this.users.filter((user) => user.id == id)[0];
    return user;
  }

  removeUser (id) {
    var user = this.users.filter((user) => user.id == id)[0];
    var newList = this.users.filter((user) => user.id != id);
    this.users = newList;
    return user;
  }

  getUserList (room) {
    var list = this.users.filter((user) => user.room === room);
    list = list.map((user) => user.name);
    return list;
  }
}

var users = new Users();

users.addUser(1, 'Ryan', 'Fun Palace');
users.addUser(2, 'Anna', 'Fun Palace');
users.addUser(3, 'Sarah', 'Really Fun Palace');

module.exports = {Users};
