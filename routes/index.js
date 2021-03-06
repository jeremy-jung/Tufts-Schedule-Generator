const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
/* Controllers */
const courseScheduleController = require('../controllers/courses/courseScheduleController.js');
// const searchIndexController = require('../controllers/courses/searchIndexController.js');
// const docsController = require('../controllers/courses/docsController.js');
const courseController = require('../controllers/courseController.js');
const degreePlanController = require('../controllers/degreePlanController.js');
const degreeReqController = require('../controllers/degreeReqController.js');
const scheduleController = require('../controllers/scheduleController.js')
// const listController = require('../controllers/courses/listController.js');
const userController = require('../controllers/auth/userController.js');
const authController = require('../controllers/auth/authController.js');

router.get('/', (req, res) => {
    res.send("here")
});

////////////////////////////////////////
//                                    //
//              Courses               //
//                                    //
////////////////////////////////////////

router.get('/courses/general', courseController.getGeneralCourses);

router.get('/courses/term', courseController.getTermCourses);

////////////////////////////////////////
//                                    //
//            Degree Plan             //
//                                    //
////////////////////////////////////////

router.post('/degreeplan', authController.authenticateToken, degreePlanController.createDegreePlan);
router.get('/degreeplan/:plan_id', authController.authenticateToken, degreePlanController.getDegreePlan);
router.delete('/degreeplan/:plan_id', authController.authenticateToken, degreePlanController.deleteDegreePlan);
router.get('/degreeplans', authController.authenticateToken, degreePlanController.getDegreePlans);
router.post('/degreeplan/term/create', authController.authenticateToken, degreePlanController.createTerm);
router.post('/degreeplan/term/save', authController.authenticateToken, degreePlanController.saveTerm);
router.post('/degreeplan/term/:plan_term_id', authController.authenticateToken, degreePlanController.deleteTerm);

////////////////////////////////////////
//                                    //
//            Degree Req              //
//                                    //
////////////////////////////////////////

router.post('/degreereq/public', authController.authenticateToken, degreeReqController.createDegreeReqPublic);
router.get('/degreereqs/public', authController.authenticateToken, degreeReqController.getDegreeReqsPublic);
router.delete('/degreereq/public/:pub_dr_id', authController.authenticateToken, degreeReqController.deleteDegreeReqPublic);
router.post('/degreereq/public/copy/:pub_dr_id', authController.authenticateToken, degreeReqController.copyDegreeReqPublicToPrivate);
router.post('/degreereq/private', authController.authenticateToken, degreeReqController.createDegreeReqPrivate);
router.get('/degreereqs/private', authController.authenticateToken, degreeReqController.getDegreeReqsPrivate);
router.get('/degreereq/private/:priv_dr_id', authController.authenticateToken, degreeReqController.getDegreeReqPrivate);
router.delete('/degreereq/private/:priv_dr_id', authController.authenticateToken, degreeReqController.deleteDegreeReqPrivate);
router.post('/degreereq/private/save', authController.authenticateToken, degreeReqController.saveDegreeReqPrivate);

/*
* Handle GET requests by MONGODB object id
* USAGE: BASEURL/api/courses/db-id/?id={MONGODB_ID}
* */
// router.get('/courses/docs/db-id/:id', docsController.sendSingleDocumentByOID);

/*
* Handle GET requests by MONGODB object id
* USAGE: BASEURL/api/courses/db-ids/?id={MONGODB_ID}&?id={MONGODB_ID}
*/
// router.get('/courses/docs/db-ids', docsController.sendMultipleDocumentsByOIDs);

// router.get('/courses/docs/course-id/:id', docsController.sendDocumentsByCourseID);

// router.get('/courses/docs/course-name/:name', docsController.sendDocumentsByCourseName);

// router.get('/courses/list/course-name', listController.sendListCourseNames);

// router.get('/courses/list/course-id', listController.sendListCourseIDs);

// router.get('/courses/alg/search-table', searchIndexController.sendSearchIndex);

// router.get('/courses/db/search-table', searchIndexController.postSearchIndexToDB);

// router.post('/courses/schedule', courseScheduleController.generateCourseSchedule);

////////////////////////////////////////
//                                    //
//              Auth                  //
//                                    //
////////////////////////////////////////

router.post('/auth/register',
    body('userid').isEmail().normalizeEmail(),
    body('password').not().isEmpty(),
    body('password_confirmation').not().isEmpty(),
    userController.validateRegisterLocal,
    userController.registerLocal,
    authController.login);

// router.post('/auth/register/guest', authController.checkGuestToken, userController.registerGuest, authController.loginGuest);

router.post('/auth/login', authController.authenticateLocal, authController.login);


////////////////////////////////////////
//                                    //
//             Schedule               //
//                                    //
////////////////////////////////////////

router.post('/schedule/generate', scheduleController.generateSchedule);

module.exports = router;