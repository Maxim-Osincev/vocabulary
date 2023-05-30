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

  // sqlPool.pool.query(
  //   `DELETE FROM words_folders WHERE id = ${folderId}`,
  //   function(err, results, fields) {
  //     // Если в папке были слова
  //     if (err?.sqlMessage.includes('Cannot delete or update a parent row: a foreign key constraint fails')) {
  //       // Сначала удаляем слова
  //       sqlPool.pool.query(
  //         `DELETE FROM words WHERE folder_id = ${folderId}`,
  //         function(err, results, fields) {
  //           if (res) {
  //
  //             // Затем удаляем папку
  //             sqlPool.pool.query(
  //               `DELETE FROM words_folders WHERE id = ${folderId}`,
  //               function(err, results, fields) {
  //                 if (res) {
  //                   res.status(200).send(results);
  //                 } else {
  //                   res.status(400);
  //                 }
  //               }
  //             );
  //           } else {
  //             res.status(400);
  //           }
  //         }
  //       );
  //     }
  //     else {
  //       res.status(200).send(results);
  //     }
  //   }
  // );
}

module.exports = {
  getAllFolders,
  createNewFolder,
  deleteFolderById,
}
