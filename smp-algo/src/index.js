const fastify = require('fastify')({
    logger: true
})

let couples = [
    [0, 1, 2, 3],
    [3, 2, 1, 0],
    [1, 2, 0, 3],
    [3, 0, 2, 1]
];

function stableMatch(couples) {
    let n = couples.length;
    let engaged = Array(n).fill(-1);
    let next = Array(n).fill(0);

    let freeCount = n;
    if (freeCount > 0) {
        let m = 0;
        while (engaged[m] !== -1) {
        m++;
        }

        for (let i = next[m]; i < n; i++) {
        let w = couples[m][i];
        next[m] = i + 1;
        if (engaged[w] === -1) {
            engaged[w] = m;
            engaged[m] = w;
            freeCount--;
            break;
        } else {
            let m1 = engaged[w];
            let pref_m1 = couples[w].indexOf(m1);
            let pref_m = couples[w].indexOf(m);
            if (pref_m < pref_m1) {
            engaged[w] = m;
            engaged[m] = w;
            m = m1;
            }
        }
        }
    }
    return engaged;
}

fastify.get('/stable-match', async (request, reply) => {
    let result = await stableMatch(couples);
    if(result){
        reply.send({
        success: true,
        result: result
        });
    }
})

fastify.listen(8080, (err, address) => {
    if (err) {
    fastify.log.error(err)
    process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
})