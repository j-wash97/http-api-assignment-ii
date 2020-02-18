const users = {};

// Sends the GET response back
const RespondGet = (response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// Sends the HEAD response back
const RespondHead = (response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// Sends a response with a given object based on the request's method
const Respond = (method, response, status, object) => {
  if (method === 'HEAD') {
    RespondHead(response, status);
  }
  // Default to GET when irregular method type is given
  else {
    RespondGet(response, status, object);
  }
};

const GetUsers = (method, response) => Respond(method, response, 200, { users });

const AddUser = (method, response, params) => {
  // check incoming parameters
  if (!params.name || !params.age) {
    return Respond(method, response, 400, {
      message: 'User requires both a name and age parameter',
      id: 'missingParams',
    });
  }

  let responseCode = 201;

  // determine duplicate entry
  if (users[params.name]) {
    responseCode = 204;
  }

  // set entry
  users[params.name] = params.age;

  // respond to request
  if (responseCode === 201) {
    return Respond(method, response, responseCode, { message: 'User added successfully' });
  }

  return Respond('HEAD', response, responseCode);
};

const NotFound = (method, response) => Respond(method, response, 404, {
  message: 'Resource not found',
  id: 'Not Found',
});

module.exports = {
  GetUsers,
  AddUser,
  NotFound,
};
