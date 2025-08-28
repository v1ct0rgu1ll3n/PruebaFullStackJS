export function getPagination(q: any, defaults = { page: 1, pageSize: 10 }) {
  const page = Math.max(1, parseInt(q.page ?? defaults.page, 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(q.pageSize ?? defaults.pageSize, 10)));
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  return { page, pageSize, skip, take };
}
