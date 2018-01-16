import fs from 'fs'
import fetch from 'node-fetch'

export function geocode () {
  const filenames = fs.readdirSync('data/raw')
    .filter(file => file.match(/\.json$/))

  const clinicHours = {}

  Promise.all(filenames.map(filename => {
    let clinic = require('../../data/raw/' + filename)
    const searchHours = clinic.operatingHours
    console.log(searchHours)
      .then(res => res.json())
      .then(json => {
        const match = json.results.find(address =>
          clinic.address.slice(-6) === address.POSTAL)
        if (match) {
          clinicHours[clinic.hciCode] = {
            coordinates: [+match.LONGITUDE, +match.LATITUDE],
            svy21: [+match.X, +match.Y]
          }
        } else {
          console.log('Not found:', filename)
        }
      })
      .catch(console.error)
  })).then(() => {
    fs.writeFileSync('data/clinicHours.json', JSON.stringify(clinicHours, null, '\t'))
  })
}
