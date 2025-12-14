const express = require("express");
const router = express.Router();

//return res.json({ ok: true, controller: "technicalAssessmentController", time: new Date().toISOString() });
const {
    technicalAssessment,
} = require("../controllers/technicalAssessmentController");

router.get("/technical_assessment", technicalAssessment);



module.exports = router;