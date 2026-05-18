function escapeSqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function escapeIdentifier(value) {
  return `\`${String(value).replace(/`/g, "``")}\``;
}

module.exports = {
  escapeSqlString,
  escapeIdentifier,
};