import fs from 'fs'
import fetch from 'node-fetch'
// import {fromSVY21} from 'sg-heatmap/dist/helpers/geometry'
import {CustomHeatmap} from '../helpers/geospatial'
// import {onemapApi} from '../helpers/api'

// geocode()
// getPrimarySchoolLocations()
// getPlanningArea()

export function geocode () {
  const filenames = fs.readdirSync('data/raw')
    .filter(file => file.match(/\.json$/))
  const apiCalls = {
    delay: 50,
    queue: Promise.resolve(),
    push (url) {
      this.queue = this.queue.then(() => {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, this.delay, fetch(url))
        })
      })
      return this.queue
    }
  }

  const locations = {}

  Promise.all(filenames.map(filename => {
    let clinic = require('../../data/raw/' + filename)
    const searchVal = 'https://developers.onemap.sg/commonapi/search?searchVal=' +
      clinic.address.slice(-6) + '&returnGeom=Y&getAddrDetails=Y&pageNum=1'
    return apiCalls.push(searchVal)
      .then(res => res.json())
      .then(json => {
        const match = json.results.find(address =>
          clinic.address.slice(-6) === address.POSTAL)
        if (match) {
          locations[clinic.hciCode] = {
            coordinates: [+match.LONGITUDE, +match.LATITUDE],
            svy21: [+match.X, +match.Y]
          }
        } else {
          console.log('Not found:', filename)
        }
      })
      .catch(console.error)
  })).then(() => {
    fs.writeFileSync('data/locations.json', JSON.stringify(locations, null, '\t'))
  })
}

// export function getPrimarySchoolLocations () {
//   function fetchSchools (token) {
//     const url = 'https://www.onemap.sg/schooldataAPI/Services.svc/searchSchools?token=' + token
//     return fetch(url).then(res => res.json()).then(json => {
//       if (!('SearchResults' in json)) throw new Error()
//       return json.SearchResults.slice(1)
//     })
//   }

// data => {
//   const locations = require('../../data/locations.json')
//   const schoolList = require('../../data/schoolList.json')

//   data.forEach(location => {
//     const match = schoolList.find(school => school.name === location.SCHOOLNAME)
//     if (!match) return
//     let [lng, lat] = fromSVY21([+location.SCH_X_ADDR, +location.SCH_Y_ADDR])
//     lng = +(lng.toString().slice(0, 13))
//     lat = +(lat.toString().slice(0, 13))
//     const svy21 = [+location.SCH_X_ADDR, +location.SCH_Y_ADDR]
//     Object.assign(locations[match.code], {coordinates: [lng, lat], svy21})
//   })

//   fs.writeFileSync('data/locations.json', JSON.stringify(locations))
// }).catch(console.error)
// }

export function getPlanningArea () {
  const locations = require('../../data/locations.json')
  const heatmap = new CustomHeatmap()

  Object.keys(locations).forEach(clinic => {
    const matches = heatmap.bin(locations[clinic].coordinates)
    if (matches.length > 0) {
      locations[clinic].planningArea = matches[0].id
      locations[clinic].neighbours = matches[0].properties.neighbours
    } else {
      console.log('Not found:', locations[clinic].coordinates)
    }
  })

  fs.writeFileSync('data/locations.json', JSON.stringify(locations, null, '\t'))
}
