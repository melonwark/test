const parseQueryParams = req => {
  const {
    sort_by,
    sort_dir = 'asc',
    page = 1,
    _limit = 10,
    groups = [],
    _parents = {},
    columns = [],
  } = req.query;

  return {
    sort_by,
    sort_dir,
    page: Number(page),
    _limit: Number(_limit),
    groups: Array.isArray(groups) ? groups : [groups],
    _parents: typeof _parents === 'object' ? _parents : {},
    columns: Array.isArray(columns) ? columns : [columns],
  };
};

const  getGroupedData = (rawData, groups, _parents) => {
  const countGroups = groups.length;
  const countParents = Object.keys(_parents).length;
  const _hasChildren = countGroups - countParents > 1;
  const level = countParents;

  const groupsField = groups.reduce((acc, group, index) => {
    acc[group] = `group_${index + 1}`;
    return acc;
  }, {});

  const data = rawData.map((item, index) => {
    const val = `group_${level + 1}`;
    const key = Object.keys(groupsField).find(k => groupsField[k] === val);
    return {
      ...item,
      _hasChildren,
      level,
      title: key ? `${key}_row_${index + 1}` : index + 1,
      ...groupsField,
    };
  });

  return { data, groupsField, level, _hasChildren };
};

const  sortData = (data, sort_by, sort_dir) => {
  if (!sort_by) return data;

  return [...data].sort((a, b) => {
    const fieldA = a[sort_by];
    const fieldB = b[sort_by];

    if (sort_dir === 'desc') return fieldA < fieldB ? 1 : -1;
    else return fieldA > fieldB ? 1 : -1;
  });
};

const paginateData = (data, page, limit) => {
  const startIndex = (page - 1) * limit;
  return data.slice(startIndex, startIndex + limit);
};

const  calculateTotals = (data, columns) => {
  return columns.reduce((acc, col) => {
    const sum = data.reduce((sum, item) => {
      const val = item[col];
      return typeof val === 'number' ? sum + val : sum;
    }, 0);
    if (!isNaN(sum)) acc[col] = sum;
    return acc;
  }, {});
};

export {
  parseQueryParams,
  getGroupedData,
  sortData,
  paginateData,
  calculateTotals,
};
