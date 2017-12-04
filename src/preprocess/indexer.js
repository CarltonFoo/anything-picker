import fs from 'fs'

import featureExtractor from './featureExtractor'
import {generateForwardIndex} from '../helpers/search'

indexSchoolData()

export function indexSchoolData () {
  const forwardIndex = generateForwardIndex(featureExtractor, [
    'name',
    'website',
    'email',
    'levelOfEducation',
    'coordinates',
    'svy21',
    'planningArea',
    'schoolType',
    'motherTongue',
    'specialMoeProgrammes',
    'specialProgrammes',
    'ccas',
    'specialNeeds',
    'studentCare',
    'uniqueCcas'
  ])
  // include only those that are necessary
  // needed for display and filtering
  // write a feature extractor for each index

  const result = []
  Object.keys(forwardIndex).forEach(key => {
    forwardIndex[key].id = key
    result.push(forwardIndex[key])
  })

  fs.writeFileSync('public/clinicList.json', JSON.stringify(result))
  return result
}
