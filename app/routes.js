const employeeApi = require('./employee-api')

const register = (server) => {
  let routes = employeeApi.routes
  for (var i = 0; i < routes.length; i++) {
    server.route(routes[i])
  }
}

module.exports = { register }
