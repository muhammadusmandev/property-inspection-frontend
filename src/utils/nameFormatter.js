export default function routeNameFormat(name) {
  if (!name) return '';

  let parts = name.split('.');

  // remove consecutive duplicates
  parts = parts.filter((w, i) => w !== parts[i - 1]);

  // last segment only
  let last = parts.at(-1);

  const map = {
    list: 'List',
    create: 'Create',
    add: 'Add',
    edit: 'Edit',
    update: 'Update'
  };

  last = map[last.toLowerCase()] || last;

  return last.charAt(0).toUpperCase() + last.slice(1);
}