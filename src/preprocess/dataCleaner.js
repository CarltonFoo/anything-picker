import fs from 'fs'

<<<<<<< HEAD
const files = fs.readdirSync('data/raw').filter(file => file.match(/\.json$/))
const locations = require('../../data/locations.json')

const daysArr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Public Holiday']
=======
const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
  'Public Holiday'
]

const files = fs.readdirSync('data/raw').filter(file => file.match(/\.json$/))
const locations = require('../../data/locations.json')
>>>>>>> a07c2de3b61ca5b0f2dc30365ff4a7b33b6e4dc0

files.forEach(file => {
  try {
    cleanOperatingHours
    const raw = require('../../data/raw/' + file)
<<<<<<< HEAD
    // const raw = require('../../data/rawtest/' + file)
    const processed = Object.assign({}, raw)
    processed.id = raw.hciCode
    delete processed.hciCode
=======

    const processed = Object.assign({}, raw)

    processed.id = raw.hciCode
>>>>>>> a07c2de3b61ca5b0f2dc30365ff4a7b33b6e4dc0

    if (!raw.licenseClass) {
      const [licensePeriod, licenseClass] = raw.licensePeriod.split(/[\n\t]+/)
      processed.licensePeriod = licensePeriod
      processed.licenseClass = licenseClass
    }

    if (raw.operatingHours) {
      processed.operatingHours = cleanOperatingHours(raw.operatingHours)
    }

    const location = locations[processed.id]
<<<<<<< HEAD
    processed.location = location
    Object.assign(processed, location)

    fs.writeFileSync(`public/data/${processed.id}.json`, JSON.stringify(processed, null, '\t'))
    // fs.writeFileSync(`public/outputtest/${processed.id}.json`, JSON.stringify(processed, null, '\t'))
=======
    Object.assign(processed, location)

    fs.writeFileSync(`public/data/entities/${processed.id}.json`, JSON.stringify(processed, null, '\t'))
>>>>>>> a07c2de3b61ca5b0f2dc30365ff4a7b33b6e4dc0
  } catch (err) {
    console.log('Bad record', file)
    throw err
  }
})

function cleanOperatingHours (input) {
  const output = {}
  Object.keys(input).forEach(key => {
    const value = input[key]
    let splitted = key.split(' and ')
    if (splitted.length > 1) {
      splitted.forEach(day => {
        output[day] = value
      })
    } else {
      splitted = splitted[0].split(' to ')
      if (splitted.length > 1) {
<<<<<<< HEAD
        const indexStart = daysArr.indexOf(splitted[0])
        const indexEnd = daysArr.indexOf(splitted[1])
        for (let i = indexStart; i <= indexEnd; i++) {
          output[daysArr[i]] = value
=======
        const indexStart = DAYS_OF_WEEK.indexOf(splitted[0])
        const indexEnd = DAYS_OF_WEEK.indexOf(splitted[1])
        for (let i = indexStart; i <= indexEnd; i++) {
          output[DAYS_OF_WEEK[i]] = value
>>>>>>> a07c2de3b61ca5b0f2dc30365ff4a7b33b6e4dc0
        }
      } else {
        output[key] = value
      }
    }
  })
  return output
}
