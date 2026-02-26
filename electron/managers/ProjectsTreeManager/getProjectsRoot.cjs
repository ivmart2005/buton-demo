const path = require('path');

function getProjectsRoot() {
  const root = path.join(path.dirname(process.execPath), 'Projects');
  return root;
}

module.exports = getProjectsRoot;