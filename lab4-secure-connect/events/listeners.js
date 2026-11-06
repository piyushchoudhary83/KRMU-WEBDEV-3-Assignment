const appEvents = require('./appEvents');

appEvents.on('UserRegistered', ({ id, username, email }) => {
  console.log(`[event] UserRegistered: ${username} <${email}> (id: ${id})`);
});

appEvents.on('UserLoggedIn', ({ id, username }) => {
  console.log(`[event] UserLoggedIn: ${username} (id: ${id})`);
});

appEvents.on('NoteCreated', ({ id, owner }) => {
  console.log(`[event] NoteCreated: ${id} by user ${owner}`);
});