import mock_index from './mock/index';

const proxy = {
  'GET /temp': mock_index,
};

const noProxy = process.env.NO_PROXY === 'true';
// export default (noProxy ? {} : delay(proxy, 1000));
export default delay(proxy, 1000);

function delay(proxy, timer) {
  let mockApi = {};
  Object.keys(proxy).forEach(function(key) {
    let result = proxy[key].$body || proxy[key];
    if (
      Object.prototype.toString.call(result) === '[object String]' &&
      /^http/.test(result)
    ) {
      mockApi[key] = proxy[key];
    } else {
      mockApi[key] = function(req, res) {
        let foo;
        if (Object.prototype.toString.call(result) === '[object Function]') {
          foo = result;
        } else {
          foo = function(req, res) {
            res.json(result);
          };
        }

        setTimeout(function() {
          foo(req, res);
        }, timer);
      };
    }
  });
  mockApi.__mockData = proxy;
  return mockApi;
}