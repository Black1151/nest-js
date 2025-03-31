import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

// Import your modules
import { AppModule } from '../src/app.module'; // or whichever module
import { AuditModule } from '../src/modules/audit/audit.module';
import { logger } from '../src/modules/audit/logger';

// Possibly spin up testcontainers or Docker for immuDB/ES
// or mock them. For demonstration, let's assume they're running locally.

describe('E2E Logging', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // We can mock logger or keep real
    jest.spyOn(logger, 'info').mockImplementation((msg) => {
      // track or print
      console.log('LOGGER INFO:', msg);
    });
    jest.spyOn(logger, 'error').mockImplementation((msg) => {
      // track or print
      console.error('LOGGER ERROR:', msg);
    });

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuditModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Logs an incoming request and writes to ES/immuDB', async () => {
    // 1) Make a GraphQL or HTTP request
    const query = `
      query {
        userFindAll(data: { limit: 5, offset: 0 }) {
          id
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    // 2) Check if logger was called
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'action-completed',
        operationName: 'someEntityFindAll',
      }),
    );

    // 3) If the route is critical, check immuDB. If not, it goes to batch.
    //    You can do a direct query to immuDB or wait for batch flush if needed.
    // For demonstration:
    // - if it's critical => do immuClient.get or so
    // - if it's not => you might wait or force a batch flush

    // 4) Possibly check Elasticsearch if needed:
    //    e.g. search for "action-completed" with the "operationName=someEntityFindAll"
    //    Could do something like:
    // const esResult = await esClient.search({ index: 'nestjs-logs', q: 'operationName:someEntityFindAll' });
    // expect(esResult.hits.total.value).toBeGreaterThan(0);
  });

  it('Throws an exception and triggers exception filter logs', async () => {
    const query = `
      query {
        causeExceptionTest {
          result
        }
      }
    `;

    // Expecting a 500 from a forced error
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(500);

    // Check the logs
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'exception',
      }),
    );
    // If it was critical => it should appear in immuDB immediately, or in batch if not critical.
  });
});
