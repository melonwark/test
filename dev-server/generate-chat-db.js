import fs from 'fs';

function generateChatData(messagesCount = 10, dialogsCount = 10, usersCount = 10) {
  const messagesItems = [];
  const dialogsItems = [];
  const usersItems = [];
  const authors = [
    { id: 1000774, name: 'Support', role_id: 2 },
    { id: 1000876, name: null, role_id: 3 },
  ];

  for (let i = 1; i <= dialogsCount; i++) {
    const creator = {
      id: 18000 + i,
      external_id: `pa${18000 + i}`,
      login: `user${i}`,
      email: `user${i}@example.com`,
      name: null,
      role_id: 2,
      role: 'Super admin',
      status_id: 0,
      status: 'Active'
    };

    const recipient = {
      id: 15000 + i,
      external_id: `pa${15000 + i}`,
      login: `partner${i}`,
      email: `partner${i}@example.com`,
      name: '',
      role_id: 3,
      role: 'Partner',
      status_id: 2,
      status: 'Blocked'
    };

    dialogsItems.push({
      id: 1000 + i,
      partner_external_id: recipient.external_id,
      created_at: new Date().toISOString(),
      unread_messages_count: 10,
      creator,
      recipient,
      last_message: {
        id: 52000 + i,
        text: `Last message ${i}`,
        author_id: creator.id,
        author_name: null,
        author_role_id: creator.role_id,
        current_user_is_author: false,
        created_at: new Date().toISOString()
      }
    });
  }

  for (let i = 1; i <= messagesCount; i++) {
    const author = authors[Math.floor(Math.random() * authors.length)];
    messagesItems.push({
      id: 65920 - i,
      text: `Test message ${i}`,
      author_id: author.id,
      author_name: author.name,
      author_role_id: author.role_id,
      current_user_is_author: author.name !== 'Support',
      is_read_by_current_user: true,
      created_at: new Date().toISOString(),
    });
  }

  for (let i = 1; i <= usersCount; i++) {
    usersItems.push({
      id: 1 + i,
      name: `partner${100 + i}`
    });
  }

  return {
    messages: {
      data: messagesItems,
      meta: {
        current_page: 1,
        last_page: 5,
      },
    },
    dialogs: {
      data: dialogsItems,
      meta: {
        current_page: 1,
        last_page: 2,
        per_page: 50,
      },
    },
    users: usersItems,
  };
}

const jsonData = generateChatData(50, 95, 10);
fs.writeFileSync('dev-server/chat_db.json', JSON.stringify(jsonData, null, 2), 'utf8');

console.log('Generate Chat Data Success');
