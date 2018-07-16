export default {
  methods: {
    export (resource, filename, ext = 'json') {
      var element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(resource)))
      element.setAttribute('download', filename + "." + ext)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
    toCSV(items) {
      const replacer = (key, value) => value === null ? '--' : value
      const header = Object.keys(items[0])
      let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
      csv.unshift(header.join(','))
      return csv = csv.join('\r\n')
    }
  }
}
