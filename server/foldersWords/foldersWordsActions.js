const sqlPool = require('../sqlPool')

const getRootFolders = (req, res) => {
  sqlPool.pool.query(
    `SELECT * FROM words_folders WHERE IS_ROOT = 1`,
    function(err, results, fields) {
      res.send(results);
    }
  );
}

const getFoldersByParentId = (req, res) => {
  const { parentId } = req.query;
  sqlPool.pool.query(
    `SELECT * FROM words_folders WHERE parent_id = ${ parentId }`,
    function(err, results, fields) {
      res.send(results);
    }
  );
}

module.exports = {
  getRootFolders,
  getFoldersByParentId,
}
