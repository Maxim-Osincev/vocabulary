const sqlPool = require('../sqlPool')

const getAllRules = (req, res) => {
  sqlPool.pool.query(
    `SELECT * FROM rules ORDER BY created_date`,
    function(err, results, fields) {
      if (res) {
        res.status(200).send(results);
      } else {
        res.status(400);
      }
    }
  );
}

const createNewRule = (req, res) => {
  const { ruleTitle, ruleDescription } = req.body;
  sqlPool.pool.query(
    `INSERT INTO rules (title, description) VALUES ('${ruleTitle}', '${ruleDescription}')`,
    function(err, results, fields) {
      if (res) {
        res.status(200).send(results);
      } else {
        res.status(400);
      }
    }
  );
}

const deleteRuleById = (req, res) => {
  const { ruleId } = req.query;
  sqlPool.pool.query(
    `DELETE FROM rules WHERE id = ${ruleId}`,
    function(err, results, fields) {
      if (results) {
        res.status(200).send(results);
      }
    }
  );
}

module.exports = {
  getAllRules,
  createNewRule,
  deleteRuleById,
}
