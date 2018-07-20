const expect = require('expect');
const {Users} = require('./users');

describe('Users Class', function () {

  var users;
  //Don't have to use this instance; can redefine in a given case.
  //This wouldn't work because I had passed an argument ('users') to beforeEach.
  //Not only no need, but beforeEach interpreted the arg as "done."
  //Since I never called done, it kept timing out. Stupid.
  beforeEach(function () {
    users = new Users();
    users.users = [{
      id: 1,
      name: 'Ryan',
      room: 'Fun Palace'
    }, {
      id: 2,
      name: 'Sarah',
      room: 'Fun Palace'
    }, {
      id: 3,
      name: 'Anna',
      room: 'Really Fun Palace'
    }];
  });

  it('should add a new user', function () {
    var person = {
      id: 4,
      name: 'Bill',
      room: 'Really Fun Palace'
    };
    var added = users.addUser(person.id, person.name, person.room);
    expect(added).toMatchObject(person);
    expect(users.users).toContainEqual(person);
    expect(users.getUserList('Really Fun Palace')).toContain('Bill');
  });

  it('should delete a user by ID', function () {
    var person = users.removeUser(1);
    expect(person.name).toBe('Ryan');
    expect(users.users).not.toContainEqual(person);
    expect(users.getUserList('Fun Palace').length).toBe(1);
  });

  it('should not delete user if fed invalid ID', function () {
    var person = users.removeUser(5);
    expect(person).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it('should get a user by ID', function () {
    //Works ONLY because of double equals in getUser() function.
    var person = users.getUser('2');
    expect(person.name).toBe('Sarah');
    expect(person.room).toBe('Fun Palace');
    expect(typeof person).toBe('object');
  });

  it('should not get a user with invalid ID', function () {
    var person = users.getUser('abc');
    expect(person).toBeFalsy();
  });

  it('should return a list of all users in a given room', function () {
    var list = users.getUserList('Fun Palace');
    expect(list).toContain('Ryan');
    expect(list).toContain('Sarah');
    expect(list.length).toBe(2);
    //Can't use toBe, since its own unique object.
    expect(list).toEqual(['Ryan', 'Sarah']);
  });
});
