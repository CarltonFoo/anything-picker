import fs from 'fs'

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

files.forEach(file => {
  try {
    const raw = require('../../data/raw/' + file)

    const processed = Object.assign({}, raw)

    processed.id = raw.hciCode

    if (!raw.licenseClass) {
      const [licensePeriod, licenseClass] = raw.licensePeriod.split(/[\n\t]+/)
      processed.licensePeriod = licensePeriod
      processed.licenseClass = licenseClass
    }

    if (raw.operatingHours) {
      processed.operatingHours = cleanOperatingHours(raw.operatingHours)
    }

    if (raw.doctorInCharge) {
      const doctorSpecialties = raw.doctorInCharge[0].specialties
      if (doctorSpecialties || raw.mohApprovedSpecialServices || raw.detailedServices) {
        processed.combinedSpecialities = combineSpecialties(doctorSpecialties, raw.mohApprovedSpecialServices, raw.detailedServices)
      }
    } else {
      if (raw.mohApprovedSpecialServices || raw.detailedServices) {
        const doctorSpecialties = undefined
        processed.combinedSpecialities = combineSpecialties(doctorSpecialties, raw.mohApprovedSpecialServices, raw.detailedServices)
      }
    }

    const location = locations[processed.id]
    Object.assign(processed, location)

    fs.writeFileSync(`public/data/entities/${processed.id}.json`, JSON.stringify(processed, null, '\t'))
  } catch (err) {
    console.log('Bad record', file)
    throw err
  }
})

function cleanOperatingHours (input) {
  const output = {}
  Object.keys(input).forEach(key => {
    const value = cleanOperatingTime(input[key])
    let splitted = key.split(' and ')
    if (splitted.length > 1) {
      splitted.forEach(day => {
        output[day] = value
      })
    } else {
      splitted = splitted[0].split(' to ')
      if (splitted.length > 1) {
        const indexStart = DAYS_OF_WEEK.indexOf(splitted[0])
        const indexEnd = DAYS_OF_WEEK.indexOf(splitted[1])
        for (let i = indexStart; i <= indexEnd; i++) {
          output[DAYS_OF_WEEK[i]] = value
        }
      } else {
        output[key] = value
      }
    }
  })
  return output
}

function cleanOperatingTime (input) {
  const output = []
  let splitPeriods = input.split(', ')
  if (splitPeriods.length > 1) {
    splitPeriods.forEach(time => {
      const frame = []
      let splitted = time.split(' to ')
      if (splitted.length > 1) {
        splitted.forEach(time => {
          frame.push(transformTime(time))
        })
      }
      output.push(frame)
    })
  } else {
    if (splitPeriods[0] === 'Closed') {
      // do nothing
    } else {
      const frame = []
      let splitted = splitPeriods[0].split(' to ')
      if (splitted.length > 1) {
        splitted.forEach(time => {
          frame.push(transformTime(time))
        })
      }
      output.push(frame)
    }
  }
  return output
}

function transformTime (input) {
  const inputArr = input.slice(1, 6).split(':')
  const hour = parseInt(inputArr[0])
  const min = parseInt(inputArr[1])
  if (input.indexOf('am') > 1) {
    return (('0' + hour).slice(-2) + ':' + ('0' + min).slice(-2))
  } else if (input.indexOf('pm') > 1) {
    return (('0' + (hour + 12)).slice(-2) + ':' + ('0' + min).slice(-2))
  } else {
    console.log('Err: No valid time to transform')
  }
}

function combineSpecialties (doctorSpecialties, specialServices, detailedServices) {
  const result = []
  if (doctorSpecialties) {
    doctorSpecialties.forEach(value => {
      result.push(value)
    })
  }
  if (specialServices) {
    specialServices.forEach(value => {
      result.push(value)
    })
  }
  if (detailedServices) {
    Object.keys(detailedServices).forEach(value => {
      result.push(value)
    })
    Object.values(detailedServices).forEach(value => {
      if (Array.isArray(value)) {
        value.forEach(value => {
          result.push(value)
        })
      }
    })
  }
  var unique = result.filter(function (elem, index, self) {
    return index === self.indexOf(elem)
  })
  return unique
}
