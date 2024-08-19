# @3-/cname_flatten

[test/main.coffee](./test/main.coffee) :

```coffee
#!/usr/bin/env coffee

> @3-/cname_flatten:flatten

process.on(
  'uncaughtException'
  (err) =>
    console.error('uncaughtException',err)
    return
)

arg_li = [
  # [
  #   '3ti.site'
  #   '3ti.site.s2-web.dogedns.com'
  #   'u-01.eu.org'
  # ]
  ['i18n.site', 'i18n.site.a.bdydns.com','x01.site']
]
for arg from arg_li
  for type from ['A','AAAA']
    for i from await flatten(
      type
      ...arg
    )
      console.log '>',type,arg[0]
```

output :

```
i18n.site
A总记录数 98
https://dns.pub/dns-query?type=A&name=x01.site&edns_client_subnet=208.67.220.220
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=219.141.136.10
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=221.130.33.52
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.106.196.115
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=219.150.32.132
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.137.160.5
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.99.96.68
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=222.222.222.222
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.13.66
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.99.160.68
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=219.149.135.188
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.106.3
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.99.216.113
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=219.148.162.31
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.91.1
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.99.224.68
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=219.148.204.66
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.137.32.178
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.96.64.68
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=219.149.194.55
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.141.16.99
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.98.0.68
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=112.100.100.100
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.137.241.34
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.97.224.68
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=218.30.19.40
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.137.130.3
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=221.11.1.67
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.100.64.68
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=218.203.160.194
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=221.7.34.10
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.100.128.68
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.75.123
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=221.207.58.58
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=222.75.152.129
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=218.203.123.116
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.93.0.81
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=61.128.114.166
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=218.202.152.130
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=221.7.1.21
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=222.85.85.85
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.24.71
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.102.224.68
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.103.24.68
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.137.58.20
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=218.104.111.114
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=222.246.129.80
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.142.210.98
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=58.20.127.238
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.96.209.133
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.136.112.50
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=210.22.70.3
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=218.2.2.2
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=221.131.143.69
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=221.6.4.66
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.101.172.35
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.140.13.188
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=221.12.1.227
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=61.132.163.68
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.180.2
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=218.104.78.2
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=218.85.152.99
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.151.161
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=218.104.128.106
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.101.224.69
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.141.90.68
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=220.248.192.12
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=219.146.1.66
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=218.201.96.130
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.102.128.68
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.96.134.133
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.139.163.6
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=210.21.196.6
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.100.192.68
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=221.176.88.95
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=221.11.132.2
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.103.225.68
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.245.180
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=221.7.128.68
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=61.128.192.68
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=218.201.4.3
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=221.5.203.98
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=61.139.2.69
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.137.82.4
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=119.6.6.6
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.98.192.67
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.139.5.29
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=221.13.28.234
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=222.172.200.68
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.139.29.68
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=221.3.131.11
https://223.6.6.6/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.98.224.68
https://dns.pub/dns-query?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=211.139.73.34
https://dns.google/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=221.13.65.34
https://223.5.5.5/resolve?type=A&name=i18n.site.a.bdydns.com&edns_client_subnet=202.112.144.30
42.81.98.41	59	JSP3/2.0.14
101.72.199.41	71	JSP3/2.0.14
1.71.157.41	85	JSP3/2.0.14
1.194.253.41	86	JSP3/2.0.14
106.117.216.41	92	JSP3/2.0.14
1.193.146.41	99	JSP3/2.0.14
222.199.191.41	111	JSP3/2.0.14
113.142.207.41	111	JSP3/2.0.14
58.57.102.41	111	JSP3/2.0.14
42.101.56.41	113	JSP3/2.0.14
42.101.4.41	119	JSP3/2.0.14
116.153.0.41	128	JSP3/2.0.14
125.74.42.41	130	JSP3/2.0.14
36.142.23.41	133	JSP3/2.0.14
61.170.103.41	140	JSP3/2.0.14
106.225.194.41	141	JSP3/2.0.14
61.170.99.41	141	JSP3/2.0.14
117.157.16.41	151	JSP3/2.0.14
175.12.110.41	152	JSP3/2.0.14
121.14.135.41	162	JSP3/2.0.14
120.240.138.41	167	JSP3/2.0.14
36.159.107.41	184	JSP3/2.0.14
157.148.65.41	204	JSP3/2.0.14
104.21.50.138	420	cloudflare
172.67.206.199	640	cloudflare
42.81.98.41	59	JSP3/2.0.14
101.72.199.41	71	JSP3/2.0.14
1.71.157.41	85	JSP3/2.0.14
1.194.253.41	86	JSP3/2.0.14
106.117.216.41	92	JSP3/2.0.14
1.193.146.41	99	JSP3/2.0.14
222.199.191.41	111	JSP3/2.0.14
113.142.207.41	111	JSP3/2.0.14
58.57.102.41	111	JSP3/2.0.14
42.101.56.41	113	JSP3/2.0.14
42.101.4.41	119	JSP3/2.0.14
116.153.0.41	128	JSP3/2.0.14
125.74.42.41	130	JSP3/2.0.14
36.142.23.41	133	JSP3/2.0.14
61.170.103.41	140	JSP3/2.0.14
106.225.194.41	141	JSP3/2.0.14
61.170.99.41	141	JSP3/2.0.14
117.157.16.41	151	JSP3/2.0.14
175.12.110.41	152	JSP3/2.0.14
121.14.135.41	162	JSP3/2.0.14
120.240.138.41	167	JSP3/2.0.14
36.159.107.41	184	JSP3/2.0.14
157.148.65.41	204	JSP3/2.0.14
104.21.50.138	420	cloudflare
172.67.206.199	640	cloudflare
> A i18n.site
> A i18n.site
i18n.site
AAAA总记录数 2
https://223.6.6.6/resolve?type=AAAA&name=x01.site&edns_client_subnet=208.67.220.220
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=219.141.136.10
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=221.130.33.52
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.106.196.115
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=219.150.32.132
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.137.160.5
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.99.96.68
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=222.222.222.222
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.13.66
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.99.160.68
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=219.149.135.188
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.106.3
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.99.216.113
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=219.148.162.31
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.91.1
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.99.224.68
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=219.148.204.66
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.137.32.178
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.96.64.68
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=219.149.194.55
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.141.16.99
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.98.0.68
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=112.100.100.100
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.137.241.34
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.97.224.68
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=218.30.19.40
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.137.130.3
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=221.11.1.67
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.100.64.68
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=218.203.160.194
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=221.7.34.10
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.100.128.68
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.75.123
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=221.207.58.58
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=222.75.152.129
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=218.203.123.116
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.93.0.81
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=61.128.114.166
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=218.202.152.130
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=221.7.1.21
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=222.85.85.85
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.24.71
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.102.224.68
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.103.24.68
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.137.58.20
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=218.104.111.114
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=222.246.129.80
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.142.210.98
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=58.20.127.238
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.96.209.133
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.136.112.50
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=210.22.70.3
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=218.2.2.2
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=221.131.143.69
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=221.6.4.66
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.101.172.35
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.140.13.188
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=221.12.1.227
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=61.132.163.68
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.180.2
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=218.104.78.2
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=218.85.152.99
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.151.161
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=218.104.128.106
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.101.224.69
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.141.90.68
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=220.248.192.12
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=219.146.1.66
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=218.201.96.130
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.102.128.68
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.96.134.133
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.139.163.6
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=210.21.196.6
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.100.192.68
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=221.176.88.95
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=221.11.132.2
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.103.225.68
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.138.245.180
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=221.7.128.68
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=61.128.192.68
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=218.201.4.3
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=221.5.203.98
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=61.139.2.69
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.137.82.4
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=119.6.6.6
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.98.192.67
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.139.5.29
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=221.13.28.234
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=222.172.200.68
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.139.29.68
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=221.3.131.11
https://223.5.5.5/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.98.224.68
https://223.6.6.6/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=211.139.73.34
https://dns.pub/dns-query?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=221.13.65.34
https://dns.google/resolve?type=AAAA&name=i18n.site.a.bdydns.com&edns_client_subnet=202.112.144.30
```

## About This Project

This project is an open-source component of [i18n.site ⋅ Internationalization Solution](https://i18n.site).

* [i18 : MarkDown Command Line Translation Tool](https://i18n.site/i18)

  The translation perfectly maintains the Markdown format.

  It recognizes file changes and only translates the modified files.

  The translated Markdown content is editable; if you modify the original text and translate it again, manually edited translations will not be overwritten (as long as the original text has not been changed).

* [i18n.site : MarkDown Multi-language Static Site Generator](https://i18n.site/i18n.site)

  Optimized for a better reading experience

## 关于本项目

本项目为 [i18n.site ⋅ 国际化解决方案](https://i18n.site) 的开源组件。

* [i18 :  MarkDown命令行翻译工具](https://i18n.site/i18)

  翻译能够完美保持 Markdown 的格式。能识别文件的修改，仅翻译有变动的文件。

  Markdown 翻译内容可编辑；如果你修改原文并再次机器翻译，手动修改过的翻译不会被覆盖（如果这段原文没有被修改）。

* [i18n.site : MarkDown多语言静态站点生成器](https://i18n.site/i18n.site) 为阅读体验而优化。