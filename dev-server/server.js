import jsonServer from 'json-server';
import fs from 'fs';
import { json2csv } from 'json-2-csv';


const tableData = JSON.parse(fs.readFileSync('dev-server/table_db.json', 'utf8'));
const chatData = JSON.parse(fs.readFileSync('dev-server/chat_db.json', 'utf8'));
const mergedData = { ...tableData, ...chatData };

const router= jsonServer.router(mergedData);
const middlewares = jsonServer.defaults();
const server = jsonServer.create();

import {
  parseQueryParams,
  getGroupedData,
  sortData,
  paginateData,
  calculateTotals,
} from './datatable-helpers.js';

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get('/datatable', async (req, res) => {

  const {
    sort_by, sort_dir, page, _limit, groups, _parents
  } = parseQueryParams(req);

  const rawData = router.db.get('datatable.items').value();
  const { data: groupedData } = getGroupedData(rawData, groups, _parents);
  const sorted = sortData(groupedData, sort_by, sort_dir);
  const paginated = paginateData(sorted, page, _limit);

  await sleep(2000);

  res.json({
    count: groupedData.length,
    items: paginated,
  });
});

server.get('/datatable/total', (req, res) => {
  const data = router.db.get('datatable.items').value();

  const totals = calculateTotals(data, [
    'income', 'taxes', 'expenses', 'sales', 'profit', 'returns', 'revenue'
  ]);

  res.json(totals);
});


server.get('/get-csv', (req, res) => {
  const {
    sort_by, sort_dir, page, _limit, groups, _parents, columns
  } = parseQueryParams(req);

  const rawData = router.db.get('datatable.items').value();
  const { data: groupedData } = getGroupedData(rawData, groups, _parents);
  const sorted = sortData(groupedData, sort_by, sort_dir);
  const paginated = paginateData(sorted, page, _limit);

  const csvData = paginated.map(row => {
    const result = {};
    columns.forEach(col => result[col] = row[col]);
    return result;
  });

  const totals = calculateTotals(groupedData, columns);
  const totalsRow = columns.reduce((acc, col, idx) => {
    if (idx === 0) acc[col] = 'Total';
    else acc[col] = totals[col] ?? '';
    return acc;
  }, {});

  try {
    const finalCsvRows = [...csvData, totalsRow];
    const fullCsv = json2csv(finalCsvRows, { keys: columns });
    res.setHeader('Content-Type', 'text/csv');
    res.status(200).send(fullCsv);
  } catch (err) {
    console.error('CSV generation error:', err);
    res.status(500).send('Failed to generate CSV');
  }
});

server.get('/support/messages', (req, res) => {
  const { page } = req.query;
  const _limit = 10;

  const { data, meta } = router.db.get('messages').value();

  const startIndex = (page - 1) * _limit;
  const paginatedData = data.slice(startIndex, startIndex + Number(_limit));

  res.json({
    data: paginatedData,
    meta
  });
});

server.post('/support/messages', (req, res) => {
  const { text } = req.body;
  const messages = router.db.get('messages.data').value();

  const newMessage = {
    id: Date.now(),
    text,
    created_at: new Date().toISOString(),
    is_read_by_current_user: false,
    current_user_is_author: true
  };

  const updatedMessages = [newMessage, ...messages];

  router.db.set('messages.data', updatedMessages).write();

  res.status(200).json({ status: 'ok' });
});

server.get('/admin/support/dialogs', (req, res) => {
  const { page, q } = req.query;
  const { data, meta } = router.db.get('dialogs').value();

  const startIndex = (page - 1) * meta.per_page;
  const paginatedData = data.slice(startIndex, startIndex + Number(meta.per_page));

  let dataByQuery;

  if(q) {
    dataByQuery = data.filter(item => item.recipient.login.toLowerCase().includes(q.toLowerCase()));
  }

  res.json({
    data: dataByQuery ? dataByQuery : paginatedData,
    meta: meta
  });
});

server.get('/admin/support/dialogs/:dialogId', (req, res) => {
  const { dialogId } = req.params;
  const { data } = router.db.get('dialogs').value();
  const dialog = data.find(({ partner_external_id }) => String(partner_external_id) === String(dialogId));

  res.json({
    data: dialog,
  });
});

server.get('/admin/support/dialogs/:id/messages', async (req, res) => {
  const { data } = router.db.get('messages').value();

  const paginatedData = data.slice(0, 1 + Number(10)).map(el => {
    if(el.author_name === 'Support') {
      el.current_user_is_author = true;
    } else {
      el.current_user_is_author = false;
      el.is_read_by_current_user = false;
    }
    return el;
  });

  await sleep(200);

  res.json({
    data: paginatedData,
    meta: { current_page: 1, last_page: 3 }
  });
});

server.post('/admin/support/dialogs/:id/messages', (req, res) => {
  const { text } = req.body;
  const messages = router.db.get('messages.data').value();

  const newMessage = {
    id: Date.now(),
    text,
    created_at: new Date().toISOString(),
    author_name: 'Support',
    current_user_is_author: true,
  };

  const updatedMessages = [newMessage, ...messages];

  router.db.set('messages.data', updatedMessages).write();

  res.status(200).json({ status: 'ok' });
});

server.post('/admin/support/dialogs', (req, res) => {
  const { partner_id, text } =  req.body;
  const messages = router.db.get('messages.data').value();
  const dialogs = router.db.get('dialogs.data').value();

  const newDialog = {
    id: Date.now(),
    created_at: new Date().toISOString(),
    partner_external_id: partner_id,
    unread_messages_count: 0,
    creator: {
      role_id: 2,
    },
    recipient: {
      login: `partner${partner_id}`,
      email: `partner${Date.now()}@example.com`,
    },
    last_message: {
      id: Date.now(),
      text: text,
      author_id: 1000774,
      author_name: 'Support',
      author_role_id: 2,
      is_read_by_current_user: true,
      current_user_is_author: true,
      created_at: new Date().toISOString()
    }
  };

  const newMessage = {
    id: Date.now(),
    text: text,
    author_id: 1000774,
    author_name: 'Support',
    author_role_id: 2,
    is_read_by_current_user: true,
    current_user_is_author: true,
    created_at: new Date().toISOString()
  };

  const updatedDialogs = [newDialog, ...dialogs];
  const updatedMessages = [newMessage, ...messages];

  router.db.set('dialogs.data', updatedDialogs).write();

  router.db.set('messages.data', updatedMessages).write();

  res.status(200).json({ dialog_id: `${partner_id}` });
});

server.delete('/admin/support/dialogs/:dialogId/messages/:messageId', async (req, res) => {
  const { messageId } = req;
  const messages = router.db.get('messages.data').value();
  const newMessages = messages.filter(el => el.id !== messageId);

  router.db.set('messages.data', newMessages).write();


  await sleep(100);
  res.status(200).json({ status: 'ok' });
});

server.get('/autocomplete/users', (req, res) => {
  const { q } = req.query;
  const data = router.db.get('users').value();

  let dataByQuery = [];

  if(q) {
    dataByQuery = data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(q.toLowerCase())
      )
    );
  }

  res.json(q ? dataByQuery : data);
});

server.post('/form', (req, res) => {
  const queryString = new URLSearchParams(req.body).toString();
  res.redirect(`http://localhost:5173/button?${queryString}`);
});

server.post('/form_hidden_input', (req, res) => {
  const queryString = new URLSearchParams(req.body).toString();
  res.redirect(`http://localhost:5173/inputs/hidden?${queryString}`);
});
server.post('/form_toast', (req, res) => {
  const queryString = new URLSearchParams(req.body).toString();
  res.redirect(`http://localhost:5173/toast?${queryString}`);
});

server.use(router);

server.listen(5174, () => {
  console.log('JSON Server is running at http://localhost:5174');
});
