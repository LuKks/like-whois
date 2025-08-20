const test = require('brittle')
const Whois = require('./index.js')

test('simple lookup - domain', async function (t) {
  const info = await Whois.lookup('google.com')

  t.ok(info.toLowerCase().includes('ns1.google.com'))
  t.ok(info.toLowerCase().includes('ns2.google.com'))
})

test('simple lookup - ip address', async function (t) {
  const info = await Whois.lookup('216.239.32.105')

  t.ok(info.toLowerCase().includes('google llc'))
})

test('iana', async function (t) {
  const tld = await Whois.query('com')
  const server = Whois.parseWhoisAddress(tld)

  t.is(server.host, 'whois.verisign-grs.com')
  t.is(server.port, 43)
})

test('manual lookup', async function (t) {
  const tld = await Whois.query('com')
  const server = Whois.parseWhoisAddress(tld)

  const info = await Whois.query('google.com', server)

  t.ok(info)
})

test('tlds', async function (t) {
  const tlds = await Whois.tlds()

  t.ok(Array.isArray(tlds))
  t.ok(tlds.length > 50)
})
