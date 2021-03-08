export const buildStucture = (item, id, data) => {
  if (item.id === id) {
    return {
      ...item,
      list: data.getList
    };
  }
  if (item?.list?.length) {
    return {
      ...item,
      list: item.list.map(item => buildStucture(item, id, data))
    };
  }

  return item;
};
