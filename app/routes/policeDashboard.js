const router = require("express").Router();
const { Op } = require("sequelize");
const db = require("../models");
const validate = require("./policeValidation");

const Location = db.location;
// const Device = db.device;
// const Police = db.police;
const Case = db.case;

router.get("/home", validate, async (req, res) => {
  await Case.findAll().then((cases) => {
    let totalCases = 0;
    let completed = 0;
    let onProgress = 0;
    let notTaken = 0;

    cases.forEach((element) => {
      if (element.status === 0) {
        notTaken++;
      } else if (element.status === 1) {
        onProgress++;
      } else if (element.status === 2) {
        completed++;
      }
      totalCases++;
    });

    const resObject = {
      totalCases,
      completed,
      onProgress,
      notTaken,
    };
    // res.send({ cases, resObject });

    res.render("pages/policedash", {
      user: req.user,
      resObject,
      cases,
    });
  });
});

router.get("/dashboard/data", validate, async (req, res) => {
  const cases = await Case.findAll();

  res.send(cases);
});

router.get("/dashboard/data/:caseID", validate, async (req, res) => {
  const currentCase = await Case.findOne({
    where: { id: req.params.caseID },
  });

  res.send(currentCase);
});

router.get("/locationdata/:caseID", validate, async (req, res) => {
  // console.log(req.params.caseID);
  const currentCase = await Case.findOne({
    where: { id: req.params.caseID },
  });
  // console.log(currentCase);
  const locations = await Location.findAll({
    where: {
      device_imei: currentCase.device_id,
      createdAt: {
        [Op.gte]: currentCase.createdAt,
      },
    },
    raw: true,
  });

  const array = locations.reverse().slice(0, 50);
  res.send(array);
});

module.exports = router;
