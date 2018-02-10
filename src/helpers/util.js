export function collectValues (obj) {
  const values = []
  Object.keys(obj).forEach(key => {
    if (key === 'value') {
      values.push(obj[key])
    } else if (key === 'values') {
      values.push(...obj[key])
    } else if (typeof obj[key] === 'object') {
      values.push(...collectValues(obj[key]))
    }
  })
  return values
}

export function optionsSelected (options, selected) {
  return collectValues(options).every(option =>
    selected.indexOf(option) > -1)
}

export class ThrottledQueue {
  constructor (delay) {
    this.delay = delay || 100
    this.error = null
    this.tail = Promise.resolve()
  }

  push (fn, ...args) {
    this.tail = this.tail.then(() => new Promise((resolve, reject) => {
      if (this.error) reject()
      else setTimeout(resolve, this.delay, fn(...args))
    }))
    return this.tail
  }
}

export function currentTime () {
  function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
  }
  var d = new Date()
  var currentTime = addZero(d.getHours()) + ":" + addZero(d.getMinutes())
  return currentTime
}

export function getDayName() {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var d = new Date();
  var dayName = days[d.getDay()];
  return dayName
}
