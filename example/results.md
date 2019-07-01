➜  via git:(rev2) ✗ autocannon -c 100 -d 40 -p 10 localhost:4000
Running 40s test @ http://localhost:4000
100 connections with 10 pipelining factor

┌─────────┬──────┬──────┬───────┬───────┬─────────┬────────┬──────────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg     │ Stdev  │ Max      │
├─────────┼──────┼──────┼───────┼───────┼─────────┼────────┼──────────┤
│ Latency │ 0 ms │ 0 ms │ 12 ms │ 13 ms │ 1.58 ms │ 4.1 ms │ 70.64 ms │
└─────────┴──────┴──────┴───────┴───────┴─────────┴────────┴──────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Req/Sec   │ 55167   │ 55167   │ 60671   │ 61983   │ 60351.2 │ 1490.24 │ 55137   │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Bytes/Sec │ 9.27 MB │ 9.27 MB │ 10.2 MB │ 10.4 MB │ 10.1 MB │ 251 kB  │ 9.26 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.

2414k requests in 40.04s, 406 MB read


Fastify
Running 40s test @ http://localhost:3000
100 connections with 10 pipelining factor

┌─────────┬──────┬──────┬───────┬───────┬─────────┬─────────┬───────────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg     │ Stdev   │ Max       │
├─────────┼──────┼──────┼───────┼───────┼─────────┼─────────┼───────────┤
│ Latency │ 0 ms │ 0 ms │ 21 ms │ 24 ms │ 2.08 ms │ 6.32 ms │ 149.62 ms │
└─────────┴──────┴──────┴───────┴───────┴─────────┴─────────┴───────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Req/Sec   │ 38559   │ 38559   │ 47807   │ 49087   │ 46590.4 │ 3009.93 │ 38539   │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Bytes/Sec │ 6.32 MB │ 6.32 MB │ 7.84 MB │ 8.05 MB │ 7.64 MB │ 494 kB  │ 6.32 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.

1864k requests in 40.06s, 306 MB read

-------------------------------------------
VIA
Running 40s test @ http://localhost:3000
100 connections with 10 pipelining factor

┌─────────┬──────┬──────┬───────┬───────┬─────────┬─────────┬───────────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg     │ Stdev   │ Max       │
├─────────┼──────┼──────┼───────┼───────┼─────────┼─────────┼───────────┤
│ Latency │ 0 ms │ 0 ms │ 26 ms │ 28 ms │ 2.53 ms │ 7.66 ms │ 145.31 ms │
└─────────┴──────┴──────┴───────┴───────┴─────────┴─────────┴───────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev  │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┼─────────┤
│ Req/Sec   │ 32959   │ 32959   │ 39103   │ 39967   │ 38501.6 │ 1729.8 │ 32935   │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┼─────────┤
│ Bytes/Sec │ 5.53 MB │ 5.53 MB │ 6.57 MB │ 6.71 MB │ 6.47 MB │ 291 kB │ 5.53 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴────────┴─────────┘

Req/Bytes counts sampled once per second.

1540k requests in 40.06s, 259 MB read

-------------------------------------------
Express
Running 40s test @ http://localhost:3000
100 connections with 10 pipelining factor

┌─────────┬──────┬──────┬───────┬───────┬─────────┬──────────┬──────────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg     │ Stdev    │ Max      │
├─────────┼──────┼──────┼───────┼───────┼─────────┼──────────┼──────────┤
│ Latency │ 0 ms │ 0 ms │ 34 ms │ 39 ms │ 3.37 ms │ 10.18 ms │ 99.51 ms │
└─────────┴──────┴──────┴───────┴───────┴─────────┴──────────┴──────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Req/Sec   │ 24591   │ 24591   │ 29695   │ 30271   │ 28990   │ 1515.14 │ 24590   │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Bytes/Sec │ 4.03 MB │ 4.03 MB │ 4.87 MB │ 4.96 MB │ 4.75 MB │ 248 kB  │ 4.03 MB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.

1160k requests in 40.05s, 190 MB read
