import { CLICKHOUSE, PRISMA, runQuery } from 'lib/db';
// import kafka from 'lib/kafka';
import prisma from 'lib/prisma';
// import redis from 'lib/redis';

export async function endSession(...args) {
  return runQuery({
    [PRISMA]: () => relationalQuery(...args),
    [CLICKHOUSE]: () => clickhouseQuery(...args),
  });
}

async function relationalQuery(session_id) {
  return prisma.client.session
    .update({
      where: {
        id: session_id
      },
      data: {
        update: {
          ended_at: new Date(),
        },
      },
    })
    .then(async res => {
      if (redis.client && res) {
        await redis.client.set(`session:${res.session_uuid}`, 1);
      }

      return res;
    });
}

async function clickhouseQuery() {
  // TODO
}
