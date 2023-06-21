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

const deleteAllWordsInFolder = (req, res) => {
  const { folderId } = req.query;
  sqlPool.pool.query(
    `DELETE FROM words WHERE folder_id = ${folderId}`,
    function(err, results, fields) {}
  );
}

const copyWordsByFolderId = (req, res) => {
  const { folderId, newFolderId } = req.body;
  sqlPool.pool.query(
    `SELECT word, translate, example FROM words WHERE folder_id = ${folderId}`,
    function(err, results, fields) {
      if (results && results.length) {
        console.log(results);
        const valuesRows = results.reduce((acc, currentValue, index) => {
          return acc += `('${currentValue.word}', '${currentValue.translate}', '${currentValue.example}', ${newFolderId})${index === results.length - 1 ? '' : ', '}`;
        }, '');
        sqlPool.pool.query(
          `INSERT INTO words (word, translate, example, folder_id) VALUES ${valuesRows}`,
          function(err, results, fields) {
            if (results) {
              res.status(200).send(results);
            } else {
              res.status(400);
            }
          }
        );
      } else {
        res.status(200);
      }
    }
  );
}

const createWordByFolderId = (req, res) => {
  const { folderId, wordData } = req.body;
  const { word, translate, example } = wordData;
  sqlPool.pool.query(
    `INSERT INTO words (word, translate, example, folder_id) VALUES ('${word}', '${translate}', '${example}', ${folderId})`,
    function(err, results, fields) {
      if (results) {
        res.status(200).send(results);
      }
    }
  );
}

module.exports = {
  getWordsByFolderId,
  deleteAllWordsInFolder,
  copyWordsByFolderId,
  createWordByFolderId,
}
