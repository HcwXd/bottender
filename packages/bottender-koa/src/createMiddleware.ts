import Koa from 'koa';
import isEmpty from 'lodash/isEmpty';

import { Bot } from './types';

function createMiddleware(bot: Bot) {
  const requestHandler = bot.createRequestHandler();

  return async (ctx: Koa.Context) => {
    const { request, response } = ctx;
    if (isEmpty(request.query) && !request.body) {
      throw new Error(
        'createMiddleware(): Missing query and body, you may need a body parser. Use `koa-bodyparser` or other similar package before this middleware.'
      );
    }

    const res = await requestHandler(
      {
        ...request.query,
        ...request.body,
      },
      ctx
    );
    if (res) {
      response.set(res.headers || {});
      response.status = res.status || 200;
      response.body = res.body || '';
    } else {
      response.body = '';
      response.status = 200;
    }
  };
}

export default createMiddleware;
