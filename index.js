const fs = require('fs')
const mustache = require('mustache')

const express = require('express')
const app = express()

const dbConfigs = require('./knexfile.js')
const db = require('knex')(dbConfigs.development)

const port = 3000

// -----------------------------------------------------------------------------
// Express.js Endpoints

const homepageTemplate = fs.readFileSync('./templates/homepage.mustache', 'utf8')
const selectCohortsTemplate = fs.readFileSync('./templates/selectcohorts.mustache', 'utf8')
const assignmentsTemplate = fs.readFileSync('./templates/assignments.mustache', 'utf8')
const studentsTemplate = fs.readFileSync('./templates/students.mustache', 'utf8')

app.use(express.urlencoded())

app.get('/', function (req, res) {
  getAllCohorts()
    .then(function (allCohorts) {
      res.send(mustache.render(homepageTemplate, { cohortsListHTML: renderAllCohorts(allCohorts) }))
    })
})

app.post('/cohorts', function (req, res) {
  createCohort(req.body)
    .then(function () {
      res.send('hopefully we created your cohort <a href="/">go home</a>')
    })
    .catch(function () {
      res.status(500).send('something went wrong. waaah, waaah')
    })
})

app.get('/cohorts/:slug', function (req, res) {
  getOneCohort(req.params.slug)
    .then(function (cohort) {
      res.send(mustache.render(selectCohortsTemplate, { selectListHTML: renderOneCohort(cohort) }))
      ('<pre>' + prettyPrintJSON(cohort) + '</pre>')
    })
    .catch(function (err) {
      res.status(404).send('cohort not found :(')
    })
})

app.get('/students', function (req, res) {
  getAllStudents()
    .then(function (allStudents) {
      res.send(mustache.render(studentsTemplate, { studentsListHTML: renderAllStudents(allStudents) }))
    })
})


app.listen(port, function () {
  console.log('Listening on port ' + port + ' 👍')
})

// -----------------------------------------------------------------------------
// HTML Rendering

function renderCohort (cohort) {
  return `<li><a href="/cohorts/${cohort.slug}">${cohort.title}</a></li>`
}

function renderAllCohorts (allCohorts) {
  return '<ul>' + allCohorts.map(renderCohort).join('') + '</ul>'
}

function renderOneCohort (cohort) {
  return `<table>
            Cohort ID: ${cohort.id}<br>
            <br>Title: ${cohort.title}<br>
            <br>Slug: ${cohort.slug}<br>
            <br>Start Date: ${cohort.startDate}<br>
            <br>End Date: ${cohort.endDate}<br>
  </table>`
  
}

function renderAllStudents (Students) {
  return `<li>
            Name: ${Students.name}
  </li>`
}
//`<li><a href="/${cohort.slug}">${cohort.title}</a></li>`
// -----------------------------------------------------------------------------
// Database Queries

const getAllCohortsQuery = `
  SELECT *
  FROM Cohorts
`

const getAllStudentsQuery = `
  SELECT *
  From Students
`

function getAllCohorts () {
  return db.raw(getAllCohortsQuery)
}

function getOneCohort (slug) {
  return db.raw('SELECT * FROM Cohorts WHERE slug = ?', [slug])
    .then(function (results) {
      if (results.length !== 1) {
        throw null
      } else {
        return results[0]
      }
    })
}

function createCohort (cohort) {
  return db.raw('INSERT INTO Cohorts (title, slug, isActive, startDate, endDate) VALUES (?, ?, true)', [cohort.title, cohort.slug, cohort.startDate, cohort.endDate])
}

function getAllStudents () {
  return db.raw(getAllStudentsQuery)
}

// -----------------------------------------------------------------------------
// Misc

function prettyPrintJSON (x) {
  return JSON.stringify(x, null, 2)
}
