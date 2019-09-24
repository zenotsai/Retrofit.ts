import { Retrofit } from '../dist/index';
import Person from '../apis/index';

const retrofit = new Retrofit.Builder()
  .baseUrl('http://localhost:3007')
  .setDebug(true)
  .build();
const call = retrofit.create(Person);
test('should get Hello world', (done) => {
  call.getUser({
    id: '123',
  }, 'king').then((code) => {
    expect(code.data).toBe('king');
    done();
  });
});
