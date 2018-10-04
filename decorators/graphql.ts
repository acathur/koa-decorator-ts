import { Context } from 'koa';
import compose from 'koa-compose';

import { isArray } from '../utils';

export const Graphql = (target: any, name: string, descriptor: any): any => {
  const middleware = isArray(target[name]);
  descriptor.value = async (
    root: any,
    args: any,
    context: Context,
    info: any
  ) => {
    context.graphql = {
      root,
      args,
      info,
      body: context.graphql ? context.graphql.body : {}
    };

    if (Object.keys(context.graphql.body).length === 0) {
      Object.defineProperty(context, 'body', {
        get: function() {
          return this.graphql.body[key];
        },
        set: function(v) {
          this.graphql.body[this.graphql.info.path.key] = v;
        }
      });
    }

    const key = context.graphql.info.path.key;

    await compose<Context>(middleware)(context);

    return context.graphql.body[key];
  };
};
