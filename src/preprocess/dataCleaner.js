import fs from 'fs'

const files = fs.readdirSync('data/raw').filter(file => file.match(/\.json$/))
const locations = require('../../data/locations.json')

const daysArr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Public Holiday']

files.forEach(file => {
  try {
    cleanOperatingHours
    const raw = require('../../data/raw/' + file)
    // const raw = require('../../data/rawtest/' + file)
    const processed = Object.assign({}, raw)
    processed.id = raw.hciCode
    delete processed.hciCode

    if (!raw.licenseClass) {
      const [licensePeriod, licenseClass] = raw.licensePeriod.split(/[\n\t]+/)
      processed.licensePeriod = licensePeriod
      processed.licenseClass = licenseClass
    }

    if (raw.operatingHours) {
      processed.operatingHours = cleanOperatingHours(raw.operatingHours)
    }

    const location = locations[processed.id]
    processed.location = location
    Object.assign(processed, location)

    fs.writeFileSync(`public/data/${processed.id}.json`, JSON.stringify(processed, null, '\t'))
    // fs.writeFileSync(`public/outputtest/${processed.id}.json`, JSON.stringify(processed, null, '\t'))
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
        const indexStart = daysArr.indexOf(splitted[0])
        const indexEnd = daysArr.indexOf(splitted[1])
        for (let i = indexStart; i <= indexEnd; i++) {
          output[daysArr[i]] = value
        }
      } else {
        output[key] = value
      }
    }
  })
  return output
}
