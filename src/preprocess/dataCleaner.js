import fs from 'fs'
// import isEmpty from 'lodash/isEmpty'
// import omit from 'lodash/omit'
// import {capitalize, acronym, standardFilter} from '../helpers/text'

const files = fs.readdirSync('data/raw').filter(file => file.match(/\.json$/))

// const ccas = require('../../data/ccas.json')
const locations = require('../../data/locations.json')
// const specialNeeds = require('../../data/specialNeeds.json')
// const studentCare = require('../../data/studentCare.json')
// const vacancies = require('../../data/vacancies.json')

// let mrtStations = require('nearest-mrt/data/processed/mrt_stations.json').data
// mrtStations = Object.keys(mrtStations).map(name => name.replace(/ MRT STATION$/, ''))

files.forEach(file => {
  try {
    const raw = require('../../data/raw/' + file)

    const processed = Object.assign({}, raw)

    processed.id = processed.hciCode
    delete processed.hciCode

    const location = locations[processed.id]

    Object.assign(processed, location)

    fs.writeFileSync(`public/data/${processed.id}.json`, JSON.stringify(processed, null, '\t'))
  } catch (err) {
    console.log('Bad record', file)
    console.error(err)
    throw err
  }
})

// function cleanGeneral (input) {
//   function batchCapitalize (input, splitOnDash = false) {
//     if (input instanceof Array) return input.map(i => capitalize(i, splitOnDash))
//     else return capitalize(input, splitOnDash)
//   }

//   function batchAcronym (input, ...patterns) {
//     if (input instanceof Array) return input.map(i => acronym(i, ...patterns))
//     else return acronym(input, ...patterns)
//   }

//   const output = {...input}
//   fields.forEach(f => {
//     if (f.field in input) {
//       output[f.field] = batchCapitalize(input[f.field], f.splitOnDash)
//       if (f.acronym) output[f.field] = batchAcronym(output[f.field], f.acronym)
//     }
//   })
//   return output
// }

// function cleanMRT (input) {
//   input = input || ''
//   return mrtStations
//     .filter(name => input.toUpperCase().indexOf(name) > -1)
//     .map(name => capitalize(name) + ' MRT')
// }
