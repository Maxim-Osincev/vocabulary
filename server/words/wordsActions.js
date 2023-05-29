const sqlPool = require('../sqlPool')

const getWordsByFolderId = (req, res) => {
  const { folderId } = req.query;
  sqlPool.pool.query(
    `SELECT * FROM words WHERE folder_id = ${folderId}`,
    function(err, results, fields) {
      res.send(results);
    }
  );
}

module.exports = {
  getWordsByFolderId,
}
