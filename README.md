# like-whois

Query databases for information about registered domain names and IP addresses

```
npm i like-whois
```

## Usage

```js
const Whois = require('like-whois')

const info = await Whois.lookup('google.com')
/* =>
  Domain Name: GOOGLE.COM
  Registrar WHOIS Server: whois.markmonitor.com
  Updated Date: 2019-09-09T15:39:04Z
  Creation Date: 1997-09-15T04:00:00Z
  Registry Expiry Date: 2028-09-14T04:00:00Z
  Registrar: MarkMonitor Inc.
  Name Server: NS1.GOOGLE.COM
  Name Server: NS2.GOOGLE.COM
  (... and more info)
*/
```

Get all TLDs:

```js
const tlds = await Whois.tlds()
// => ['aaa', 'aarp', 'abb', 'abbott', ...]
```

Manual whois (E.g. you can cache each step independently):

```js
// Manually query the TLD
const tld = await Whois.query('com')
/* =>
  % IANA WHOIS server

  domain:       COM
  organisation: VeriSign Global Registry Services

  contact:      administrative
  name:         Registry Customer Service
  organisation: VeriSign Global Registry Services
  (... and more data)

  contact:      technical
  name:         Registry Customer Service
  organisation: VeriSign Global Registry Services
  (... and more data)

  nserver:      A.GTLD-SERVERS.NET 192.5.6.30 2001:503:a83e:0:0:0:2:30
  nserver:      B.GTLD-SERVERS.NET 192.33.14.30 2001:503:231d:0:0:0:2:30
  nserver:      C.GTLD-SERVERS.NET 192.26.92.30 2001:503:83eb:0:0:0:0:30
  (... and more servers)

  whois:        whois.verisign-grs.com
  status:       ACTIVE

  created:      1985-01-01
  changed:      2023-12-07
  source:       IANA
*/

const server = Whois.parseWhoisAddress(tld)
// => { host: 'whois.verisign-grs.com', port: 43 }

// Manually query the registrar whois
const info = await Whois.query('google.com', server)
/* => This returns the same as the simple lookup
  Domain Name: GOOGLE.COM
  Registrar WHOIS Server: whois.markmonitor.com
  Updated Date: 2019-09-09T15:39:04Z
  Creation Date: 1997-09-15T04:00:00Z
  Registry Expiry Date: 2028-09-14T04:00:00Z
  Registrar: MarkMonitor Inc.
  Name Server: NS1.GOOGLE.COM
  Name Server: NS2.GOOGLE.COM
  (... and more info)
*/
```

## License

MIT
