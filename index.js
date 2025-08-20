const net = require('net')

module.exports = class Whois {
  static async query (input, opts = {}) {
    return whois(input, { host: opts.host || 'whois.iana.org', port: opts.port || 43 })
  }

  static async lookup (domain) {
    const tld = domain.split('.').pop()
    const iana = await whois(tld, { host: 'whois.iana.org', port: 43 })

    const serverAddress = parseWhoisAddress(iana)
    const info = await whois(domain, serverAddress)

    return info
  }

  static async tlds () {
    const response = await fetch('https://data.iana.org/TLD/tlds-alpha-by-domain.txt')
    const data = await response.text()

    const list = []

    for (const line of data.split('\n')) {
      if (!line || line.startsWith('#')) {
        continue
      }

      list.push(line.trim().toLowerCase())
    }

    return list
  }

  static parseWhoisAddress (data) {
    return parseWhoisAddress(data)
  }
}

function whois (query, address) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket()
    let data = ''

    socket.setTimeout(30000, () => {
      socket.destroy()
      reject(new Error('Whois query timed out'))
    })

    socket.on('data', chunk => {
      data += chunk.toString()
    })
    socket.on('close', () => resolve(data))
    socket.on('error', err => reject(err))

    socket.connect(address.port, address.host)
    socket.write(query + '\r\n')
  })
}

function parseWhoisAddress (data) {
  data = data.replace(/\r/gm, '')

  const match = data.match(/(ReferralServer|Registrar Whois|Whois Server|WHOIS Server|Registrar WHOIS Server|refer|whois):[^\S\n]*(?:(?:r?whois|https?):\/\/)?([0-9A-Za-z.\-_]*)(?::(\d+))?/)

  if (!match) {
    return null
  }

  const host = match[2]
  const port = parseInt(match[3], 10) || 43

  return { host, port }
}
