const express = require('express');
const router = express.Router();
const fs = require('./fs/read_file.js');
const db = require('./database/db.js');
const MDB_ObjectId = require('mongodb').ObjectId;

const Section = require('./utils/objects/classes/Section.js');
const Course = require('./utils/objects/classes/Course.js');
const Tree1 = require('./utils/Tree1.js');

const phase0 = require('./utils/phase0Utils.js');
const phase1 = require('./utils/phase1Utils.js');
const objectUtils = require('./utils/apiUtils.js');
const testUtils = require('./utils/tests/testUtils.js');

db.run( (collection) => {
    
    let cursor = collection.find({'course_id': 'ACL-0007'});
    
    cursor.forEach((doc) => {
        console.log(doc)
    });

    /*
    * Handle GET requests by MONGODB object id
    * USAGE: BASEURL/api/courses/db-id/?id={MONGODB_ID}
    * */
    router.get('/courses/db-id', async (req, res) => {
        let objectId = req.query.id;

        let oid = new db.ObjectID(objectId);
        let document = await collection.findOne({'_id': oid});
        let course = objectUtils.documentToCourse(document);
        let name = course.getCourseName();
        console.log(course);
        let response = {
            name: name
        };

        res.json(response);
    })

    /*
    * Handle GET requests by MONGODB object id
    * USAGE: BASEURL/api/courses/db-ids/?id={MONGODB_ID}?id={MONGODB_ID}
    * */
    router.get('/courses/db-ids', async (req, res) => {
        
        let objectIds = req.query.id;

        let courses = [];
        for (let index in objectIds) {
            let objectId = objectIds[index];
            let oid = new db.ObjectID(objectId);
            let document = await collection.findOne({ '_id': oid });
            let course = objectUtils.documentToCourse(document);

            courses.push(course);
        }

        let names = [];
        for (let index in courses) {
            names.push(courses[index].getCourseName());
        }

        let response = {
            names: names
        };

        res.json(response);
    })

    /*
    * Handle GET requests by MONGODB object id
    * USAGE: BASEURL/api/courses/db-ids/?id={MONGODB_ID}?id={MONGODB_ID}
    * */
    router.get('/courses/schedule/db-ids', async (req, res) => {

        let objectIds = req.query.ids;
        console.log("objectIds: ", objectIds)
        let courses = [];
        for (let index in objectIds) {
            let objectId = objectIds[index];

            let oid = new db.ObjectID(objectId);
            let document = await collection.findOne({ '_id': oid });
            console.log(document);
            let course = objectUtils.documentToCourse(document);

            courses.push(course);
        }

        
        let chosenClasses = phase1.phase1(courses);

        let response = phase1.chosenClassToApiDetails(chosenClasses);

        res.json(response);
    })

    /*
    * Handle GET requests by MONGODB object id
    * USAGE: BASEURL/api/courses/schedule/db-ids/test
    * */
    router.get('/courses/schedule/db-ids/test', async (req, res) => {
        let courses = []
        
        let courseIds = ['COMP-0015', 'CHEM-0001', 'BIO-0044', 'CEE-0136', 'MATH-0042' ];
        let oids = [];
        for (let index in courseIds) {
            let courseId = courseIds[index];
            // let oid = new db.ObjectID(objectId);
            let document = await collection.findOne({ 'course_id': courseId });
            let oid = document._id.toString();
            let course = objectUtils.documentToCourse(document);

            courses.push(course);
            oids.push(oid)
        }
        
        // generate endpoint url
        let url = "http://localhost:7777/api/courses/schedule/db-ids/?ids=";

        for (let index in oids) {
            if (index == 0)
                url = url + oids[index];
            else
                url = url + "&ids=" + oids[index];
        }

        // phase1.phase1(courses);

        res.send(url);
    })
    /*
    * Handle POST request: generate a weekly schedule 
    * given MongoDB ObjectId stringified of courses and a filter
    * body: {
    *   objectIds: [xxxxxx,xxxxx,xxxxxx,xxxxxx,xxxxx],
    *   filter: {
    *       time: {
    *               0: {
    *                   time_earliest:
    *                   time_latest:     
    *               },
    *               1: {
    *                  
    *               }
    *           }
    *   }
    * 
    * }
    * 
    */
    router.post('/courses/schedule', async (req, res) => {
        let requestBody = req.body;
        console.log("requestBody: ", requestBody);

        let objectIds = requestBody.objectIds;
        let filter = requestBody.filter;
        console.log("objectIds: ", objectIds);
        console.log("filter: ", filter);
        
        let dayToInteger = {
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
            Sunday: 7
        }

        /* translate strings in to integers for API */
        let newFilter = {
            time: {}
        }
        for (let key in filter.time) {
            let integer = dayToInteger[key];
            newFilter.time[integer] = filter.time[key];
            let strTimeEarliest = filter.time[key].time_earliest;
            let strTimeLatest = filter.time[key].time_latest;
            
            let intTimeForEarliest = objectUtils.militaryTimeToInteger(strTimeEarliest);
            let intTimeForLatest = objectUtils.militaryTimeToInteger(strTimeLatest);
            newFilter.time[integer].time_earliest = intTimeForEarliest;
            newFilter.time[integer].time_latest = intTimeForLatest;
        }
        
        let courses = [];
        for (let index in objectIds) {
            let objectId = objectIds[index];

            let oid = new db.ObjectID(objectId);
            let document = await collection.findOne({ '_id': oid });
            console.log(document);
            let course = objectUtils.documentToCourse(document);

            courses.push(course);
        }

        let chosenClasses = phase1.phase1(courses, newFilter);

        let response = phase1.chosenClassToApiDetails(chosenClasses);

        console.log("response: ", response);

        res.json(response);
    })

})

//putting colon behind will give you a variable on each of your requests
//example localhost:7777/api/reverse/jeremy
router.get('/reverse/:name', (req, res) => {
    const reverse = [...req.params.name].reverse().join()
    //req.params to access things in the URL
    //res.send(req.params.name);
    res.send(reverse)
})
module.exports = router;
