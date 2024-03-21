const { verifyTokenService } = require("../helper/tokenServices");
const storeAgent = require("../components/agent/store");
const { getInfoTokenAtenea } = require("../components/auth/store");
const { UnauthorizedError, NotFoundError } = require("../exceptions");
const constants = require("../constants");

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new UnauthorizedError(null, "No se envió el token de autorización");
    } else {
      if (req.headers.authorization.includes("Bearer")) {
        const response = await getInfoTokenAtenea(req.headers.authorization);
        const agent = await storeAgent.getAgentByIdExternal(response.data.resource_owner_id);
        if (!agent) {
          throw new NotFoundError(null, "No se encontro el agente.");
        };
        if (agent.status === constants.agents.status.DISABLED) {
          throw new UnauthorizedError(null, "El agente está deshabilitado");
        }
        req.ctx = {
          user: {
            // Para registrar que la acción ha sido realizada por el usuario conectado
            id: agent.id,
            idCompany: agent.idCompany,
            firstName: agent.firstName,
            lastName: agent.lastName,
            type: agent.type,
          },
        };
        next();
      } else {
        const { authorization } = req.headers;
        const isVerified = await verifyTokenService(authorization);
        if (!isVerified) {
          throw new UnauthorizedError(null, "El token de servicio no es válido");
        } else {
          req.ctx = {
            // Para registrar que la acción ha sido realizada por el sistema
            user: {
              id: null,
              idCompany: null,
              firstName: "Sistema",
              lastName: "Sistema",
              type: constants.agents.types.SYSTEM,
            },
          };
          next();
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authMiddleware,
};
