const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { BadRequestError, NotFoundError, InternalServerError } = require('../../exceptions.js');

const mongoTicket = require("../mongo_ticket/resolver.js");


async function getChat(id) {
  let chat = await prisma.chat.findUnique({
    where: { id: id },
    include: {
      client: {
        include: {
          channel: {
            select: {
              idCompany: true,
            },
          }
        },
      },
    },
  })
    .catch((error) => {
      throw new BadRequestError(error, "Error en la búsqueda del chat.", "[getChat] Bad request");
    });

  const idCompany = chat.client.channel.idCompany;
  chat.client = { idCompany: idCompany };
  return chat;
}

async function getChats(query) {
  return await prisma.chat.findMany(query);
}

const createChat = async (chat, transaction) => {
  const prismaClient = transaction ? transaction : prisma;
  return await prismaClient.chat.create({ data: chat });
};

async function updateChat(chat) {
  return await prisma.chat.update({ "where": { "id": chat.id }, "data": chat })
    .catch((error) => {
      if (error.code == "P2003") {
        throw new NotFoundError(error, "Error en la actualización del chat.", "[updateChat] Error with FK: " + error.meta.field_name);

      } else if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la actualización del chat.", "[updateChat] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la actualización del chat.", "[updateChat] Bad request");
      }
    });
}

async function deleteChat(id) {
  return prisma.chat.delete({ "where": { "id": id } })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la eliminación del chat.", "[deleteChat] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la eliminación del chat.", "[deleteChat] Bad request");
      }
    });
}

async function getPreviews(idAgent, query, queryMongo, extraQuerys, clientData) {
  return new Promise (async (resolve, reject) => {
    var previews = [];
    // ! Ahora extraQuerys vendria a reemplazar lo que antes era Object.keys(queryMongo).length = 0
    // ! extraQuerys vendra con un true si hay querys extras en mongo y ordenara en base a tickets, de lo contrario ordenara en base a chats
    if (!extraQuerys) {
      try {
        var [tickets, chats] = await Promise.all([(mongoTicket.getTickets(queryMongo)), prisma.chat.findMany(query)]);
        delete query["include"]; 
        delete query["skip"]; 
        delete query["take"];
        query["_count"] = { "id": true };
        var totalItems = await prisma.chat.aggregate(query);
        totalItems = totalItems._count.id;
        for (var chat of chats) {
          var ticket = tickets.data.find(item => item.idChat == chat.id);
          if (ticket) {
            var channelType = await prisma.client.findFirst({ "where": { "id": chat.idClient }, "include": { "channel": { "select": { "type": true } } } });
            var lastMessage = (ticket.messages.length > 0) ? ticket.messages[0].message : null;
            var lastUserId = (ticket.messages.length > 0) ? ticket.messages[0].userId : null;
            var dateLastMessage = (ticket.messages.length > 0) ? ticket.messages[0].createdAt : null;
            var countUnseenMessages = ticket.messages.filter(message => message.userId != idAgent && message.isSeen == false).length;
            delete ticket["messages"];
            delete chat["idAgent"];
            delete chat["idClient"];
            let message = (lastMessage != null) ? {lastMessage: lastMessage, date: dateLastMessage, lastUserId: lastUserId} : {}
            if(clientData["idChannel"] && clientData["idChannel"] === channelType.idChannel){
              addPreviewData (chat, channelType.channel.type, ticket, message, countUnseenMessages, previews);
            }
            if(!clientData["idChannel"]){
              addPreviewData (chat, channelType.channel.type, ticket, message, countUnseenMessages, previews);
            }
          }
        }
      }catch{
        reject("[Chat] ticket/chat error")
      }
    } else {
      var tickets = await mongoTicket.getTickets(queryMongo);
      tickets = tickets.data;
      for (var ticket of tickets) {
        var chat = await prisma.chat.findUnique({ 
          "where": { 
            "id": ticket.idChat 
          }, 
          "include": { 
            "agent": true, 
            "client": { 
              "include": {
                "notes": { 
                  "orderBy": { 
                    "createdAt": "desc"
                  },
                  include: {
                    agent: { select: { id: true, firstName: true, lastName: true } },
                  }
                }, 
                "blocking_history": true 
              } 
            } 
          } 
        });
        if (chat?.idAgent === idAgent) {
          // Si no viene el nombre o el id del cliente se verifica que el idChannel sea el mismo de la query
          if ((!clientData["idTicket"] || !clientData["name"] || !clientData["id"]) && query?.where?.client?.idChannel && 
          "client" in query.where && query.where.client.idChannel !== chat.client.idChannel) {
            continue;
          }
          //Si viene el nombre o el id del cliente se verifica que el idChannel sea el mismo que el idChannel capturado en el controller
          if(((clientData["idTicket"] || clientData["name"] || clientData["id"]) && clientData["idChannel"]) && clientData["idChannel"] !== chat.client.idChannel){
            continue;
          }
          var channelType = await prisma.client.findFirst({ 
            "where": { 
              "id": chat.idClient 
            }, 
            "include": { 
              "channel": { 
                "select": { 
                  "type": true 
                } 
              } 
            } 
          });
          var ticket = tickets.find(item => item.idChat == chat.id);
          var lastUserId = (ticket.messages.length > 0) ? ticket.messages[0].userId : null;
          var lastMessage = (ticket.messages.length > 0) ? ticket.messages[0].message : null;
          var dateLastMessage = (ticket.messages.length > 0) ? ticket.messages[0].createdAt : null;
          var countUnseenMessages = ticket.messages.filter(message => message.userId != idAgent && message.isSeen == false).length;
          let message = (lastMessage != null) ? {lastMessage: lastMessage, date: dateLastMessage, lastUserId: lastUserId} : {};
          delete ticket["messages"];
          delete chat["idAgent"];
          delete chat["idClient"];
          
          if(chat.client.firstName.toLowerCase().includes(clientData["name"]) || chat.client.lastName.toLowerCase().includes(clientData["name"])){
            addPreviewData (chat, channelType.channel.type, ticket, message, countUnseenMessages, previews)
          }
          if(chat.client.id === clientData["id"]){
            addPreviewData (chat, channelType.channel.type, ticket, message, countUnseenMessages, previews)
          }
          if(!clientData["id"] && !clientData["name"]){
            addPreviewData (chat, channelType.channel.type, ticket, message, countUnseenMessages, previews)
          }
        }
      }
    }
    previews.sort((a, b) => new Date(b.message.date) - new Date(a.message.date));

    resolve({ items: previews, total_items: previews.length });
  });
}

function addPreviewData (chat, channelType, ticket, message, unseenMessages, previews){
  previews.push({
    "chat": chat,
    "channelType": channelType,
    "ticket": ticket,
    "message": message,
    "unseenMessages": unseenMessages
  });
}


module.exports = {
  getChat,
  getChats,
  createChat,
  updateChat,
  deleteChat,
  getPreviews,
}
