const sqlPool = require('../sqlPool')
const wordsActions = require('../words/wordsActions')


const getAllFolders = (req, res) => {
  sqlPool.pool.query(
    `SELECT * FROM words_folders ORDER BY created_date`,
    function(err, results, fields) {
      res.send(results);
    }
  );
}

const createNewFolder = (req, res) => {
  const { folderName } = req.body;
  sqlPool.pool.query(
    `INSERT INTO words_folders (folder_name) VALUES ('${folderName}')`,
    function(err, results, fields) {
      if (res) {
        res.status(200).send(results);
      } else {
        res.status(400);
      }
    }
  );
}

const deleteFolderById = (req, res) => {
  const { folderId } = req.query;
  wordsActions.deleteAllWordsInFolder(req, res);
  sqlPool.pool.query(
    `DELETE FROM words_folders WHERE id = ${folderId}`,
    function(err, results, fields) {
      if (results) {
        res.status(200).send(results);
      }
    }
  );
}

const renameFolderById = (req, res) => {
  const { folderId, folderName } = req.body;
  sqlPool.pool.query(
    `UPDATE words_folders SET folder_name = '${folderName}' WHERE id = ${folderId}`,
    function(err, results, fields) {
      if (results) {
        res.status(200).send(results);
      }
    }
  );
}

const copyFolderById = (req, res) => {
  const { folderId } = req.body;
  sqlPool.pool.query(
    `INSERT INTO words_folders (folder_name) SELECT folder_name FROM words_folders where id = ${folderId}`,
    function(err, results, fields) {
      if (results) {
        req.body.newFolderId = results.insertId;
        wordsActions.copyWordsByFolderId(req, res);
      }
    }
  );
}

module.exports = {
  getAllFolders,
  createNewFolder,
  deleteFolderById,
  renameFolderById,
  copyFolderById,
}
