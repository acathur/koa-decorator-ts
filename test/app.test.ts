import request from 'supertest';

import app from './app';

const server = app.listen(9999);

afterEach(() => {
  server.close();
});

describe('/user', () => {
  it('can Route * at last', async () => {
    const response = await request(server).get('/user/unknown/route');

    expect(response.status).toBe(200);
    expect(response.text).toBe('haha');
  });

  it('can Get /user', async () => {
    const response = await request(server)
      .get('/user')
      .query({ top: 1, star: 2 });

    expect(response.status).toBe(200);
  });

  it('cannot Get /user without top', async () => {
    const response = await request(server)
      .get('/user')
      .query({ star: 2 });

    expect(response.status).toBe(412);
    expect(response.error.text).toBe(
      `query validation error: query requires property "top"`
    );
  });

  it('can Get /user/filter', async () => {
    const response = await request(server)
      .get('/user/filter')
      .query({ id: 'skm' });

    expect(response.status).toBe(200);
  });

  it('cannot Get /user/filter without id', async () => {
    const response = await request(server).get('/user/filter');

    expect(response.status).toBe(412);
    expect(response.error.text).toBe(
      `query validation error: query requires property "id"`
    );
  });

  it('can Get /user/:userId', async () => {
    const response = await request(server).get('/user/1');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      userName: 'skm',
      userEmail: 'skmdev@gmail.com',
    });
  });

  it('can Patch /user/:userId', async () => {
    const response = await request(server)
      .patch('/user/1')
      .send({ userNickName: 'string', userAddress: 'string' });

    expect(response.status).toBe(200);
  });

  it('can Post /user/login with body - correct', async () => {
    const response = await request(server)
      .post('/user/login')
      .send({ userEmail: 'skmdev29@gmail.com', password: 'haha' });

    expect(response.status).toBe(200);
  });

  it('can Post /user/login2 with body', async () => {
    const response = await request(server)
      .post('/user/login2')
      .send({ userEmail: 'skmdev29@gmail.com', password: 'haha' });

    expect(response.status).toBe(200);
  });

  it('cannot Post /user/login without body.userEmail', async () => {
    const response = await request(server)
      .post('/user/login')
      .send({ password: 'haha' });

    expect(response.error.text).toBe(
      `body validation error: body requires property "userEmail"`
    );
    expect(response.status).toBe(412);
  });

  it('cannot Post /user/login2 without body.userEmail', async () => {
    const response = await request(server)
      .post('/user/login2')
      .send({ password: 'haha' });

    expect(response.error.text).toBe(
      `body validation error: body requires property "userEmail"`
    );
    expect(response.status).toBe(412);
  });

  it('cannot Post /user/login2 with empty body', async () => {
    const response = await request(server)
      .post('/user/login2')
      .send();

    expect(response.error.text).toBe(
      `body validation error: body requires property "userEmail", body requires property "password"`
    );
    expect(response.status).toBe(412);
  });

  it('cannot Post /user/login with empty body', async () => {
    const response = await request(server)
      .post('/user/login')
      .send();

    expect(response.error.text).toBe(
      `body validation error: body requires property "userEmail", body requires property "password"`
    );
    expect(response.status).toBe(412);
  });

  it('can Put /user/:userId/follow ', async () => {
    const response = await request(server).put('/user/haha/follow');

    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });

  it('can Delete /user/:userId/follow ', async () => {
    const response = await request(server).del('/user/haha/follow');

    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

describe('/graphql', () => {
  it('can Query graphql getUsers', async () => {
    const response = await request(server)
      .post('/graphql')
      .send({
        query: `
        {
          getUsers(role: "admin") {
            username
            userEmail
            role
          }
        }
      `,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        getUsers: [
          {
            username: 'skmdev',
            userEmail: 'skmdev29@gmail.com',
            role: 'admin',
          },
        ],
      },
    });
  });

  it('can Query graphql getUsers and getUser in same request', async () => {
    const response = await request(server)
      .post('/graphql')
      .send({
        query: `
        {
          getUsers(role: "admin") {
            username
            userEmail
            role
          }
          getUser(username: "foo") {
            username
            userEmail
            role
          }
        }
      `,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        getUsers: [
          {
            username: 'skmdev',
            userEmail: 'skmdev29@gmail.com',
            role: 'admin',
          },
        ],
        getUser: {
          username: 'foo',
          userEmail: 'bar',
          role: 'user',
        },
      },
    });
  });
});

describe('/api/product', () => {
  it('can Get /api/product ', async () => {
    const response = await request(server).get('/api/product');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ sku: 'test' }, { sku: 'test2' }]);
  });

  it('cannot Get /product ', async () => {
    const response = await request(server).get('/product');

    expect(response.status).toBe(404);
  });
});

describe('/user/meta', () => {
  it('can set meta', async () => {
    const response = await request(server).get('/user/meta');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ test: 'cc' });
  });
});

describe('/api', () => {
  it('can set meta', async () => {
    const response = await request(server).get('/api/test');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ foo: 'bar' });
  });

  it('can return in root path', async () => {
    const response = await request(server).get('/api');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ foo: 'bar' });
  });
});
