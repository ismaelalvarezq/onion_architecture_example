const axios = require('axios').default;

const { InternalServerError } = require('../../exceptions.js');
const { getTokenService } = require('../../helper/tokenServices');
const config = require('../../config');

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "application/json",
    "access-control-allow-origin": "*",
  },
  timeout: 10000,
  baseURL: config.mongoDbLink,
});

const addAuthHeader = () => {
  instance.defaults.headers.common['authorization'] = getTokenService();
};

// ! Deprecated use getTicketsWithParams
async function getTickets (queryUri) {
  if (queryUri == undefined || Object.keys(queryUri).length == 0) {
    queryUri = "/ticket/";
  }
  addAuthHeader();
  return instance.get(queryUri)
    .then((response) => { return response.data; })
    .catch((error) => {
      throw new InternalServerError(error, "Error en la búsqueda de tickets.", "[getTickets] Bad request");
    });
}

const getTicketsDashboard = async (queryMongo) => {
  addAuthHeader();
  const { data } = await instance.get(queryMongo);
  return data;
}

const createTicket = async (ticket) => {
  addAuthHeader();
  const { data } = await instance.post("/ticket", { ...ticket }); 
  return data.data;
};

const deleteTicket = async (idTicket) => {
  addAuthHeader();
  const { data } = await instance.delete(`/ticket/${idTicket}`);
  return data;
};

async function getSimplifyTickets () {
  addAuthHeader();
  return instance.get("/ticket/?exclude=messages")
    .then((response) => { return response.data; })
    .catch((error) => {
      throw new InternalServerError(error, "Error en la búsqueda de tickets.", "[getSimplifyTickets] Bad request");
    });
}

async function getTicketsWithParams(params) {
  addAuthHeader();
  const response = await instance.get("/ticket", { params });
  return response.data;
}

async function updateTicket(ticket) {
  addAuthHeader();
  let id = ticket._id;
  delete ticket._id
  const response = await instance.patch("/ticket/" + id, ticket);
  return response.data;
}

async function expireAgentTickets(idAgent){
  addAuthHeader();
  const response = await instance.post("/ticket/expire-agent-ticket", idAgent);
  return response.data;
}


module.exports = {
  createTicket,
  deleteTicket,
  getTickets,
  getSimplifyTickets,
  getTicketsWithParams,
  updateTicket,
  expireAgentTickets,
  getTicketsDashboard,
}
