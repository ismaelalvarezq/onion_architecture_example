const bcrypt = require('bcrypt');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const axios = require("axios");
const { AxiosError } = require("axios");
const config = require("../../config");
const constants = require("../../constants");
const resolver = require("../mongo_ticket/resolver");

const {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
} = require("../../exceptions");

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "application/json",
    "access-control-allow-origin": "*",
  },
  timeout: 10000,
  baseURL: config.base_url_atenea,
});

const addAuthHeaderTokenCrud = (token) => {
  instance.defaults.headers.common['authorization'] = `Bearer ${token}`;
};

const getTokenAtenea = async (code, axios, next) => {
  try {
    const ateneaData = {
      client_id: config.client_id_atenea,
      client_secret: config.client_secret_atenea,
      redirect_uri: config.redirect_uri_atenea,
      code: code,
      grant_type: "authorization_code",
    };
    const response = await instance.post("/oauth/token", null, {
      params: ateneaData,
    });
    return response.data;
  } catch (error) {
    if (!(error instanceof AxiosError)) {
      throw new InternalServerError(error, "Ha ocurrido un error en Atenea");
    }
    if (error.response.status === 400) {
      throw new BadRequestError(error, error.response.data.error_description);
    }
    if (error.response.status === 500) {
      throw new InternalServerError(error, "Ha ocurrido un error en Atenea");
    }
  }
};

const getRefreshTokenAtenea = async (refreshToken) => {
  try {
    const ateneaData = {
      client_id: config.client_id_atenea,
      client_secret: config.client_secret_atenea,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
      scopes: "openid",
    };
    const response = await instance.post("/oauth/token", ateneaData);
    return response.data;
    
  } catch (error) {
    if (!(error instanceof AxiosError)) {
      throw new InternalServerError(error, "Ha ocurrido algún error");
    }
    if (error.response.status === 400) {
      throw new BadRequestError(error, error.response.data.error_description);
    }
    if (error.response.status === 500) {
      throw new InternalServerError(error, "Ha ocurrido un error en Atenea [getRefreshTokenAtenea] [500]");
    }
    throw new InternalServerError(error, "Ha ocurrido un error en Atenea [getRefreshTokenAtenea]");
  }
};

const getTokenCreateUser = async () => {
  try {
    const ateneaCredentials = {
      client_id: config.clientIdCreateUserAtenea,
      client_secret: config.clientSecretCreateUserAtenea,
      grant_type: config.grantTypeCreateUserAtenea,
    };
    const response = await instance.post("/oauth/token", ateneaCredentials);
    return response.data;
  } catch (error) {
    if (!(error instanceof AxiosError)) {
      throw new InternalServerError(error, "Ha ocurrido algún error");
    }
    if (error.response.status === 400) {
      throw new BadRequestError(error, "Error al crear el token desde atenea");
    }
    if (error.response.status === 500) {
      throw new InternalServerError(error, "Error al crear el token desde atenea");
    }
    throw new InternalServerError(error, "Error al crear el token desde atenea");
  }
};

const createUserAtenea = async (agent, token) => {
  const dataAtenea = {
    email: agent.email,
    name: agent.firstName,
    last_name: agent.lastName,
    dni: agent.rut,
    company_uid: "173",
    role:
      agent.type === constants.agents.types.AGENT || agent.type === constants.agents.types.BOT
        ? constants.agents.trust.AGENT
        : constants.agents.trust.ADMIN,
    nationality: "CHL",
    img: agent.avatarUrl,
    invitation: false,
    phone_number: agent.phone,
    password: agent.password,
  };

  try {
    addAuthHeaderTokenCrud(token);
    const response = await instance.post("/users/create", dataAtenea);
    return response.data;
  } catch (error) {

    if (!(error instanceof AxiosError)) {
      throw new InternalServerError(error, "Ha ocurrido algún error");
    }
    if (error.response.status === 401) {
      throw new UnauthorizedError(error, "Error createUserAtenea");
    }
    if (error.response.status === 400) {
      throw new BadRequestError(error, "Error createUserAtenea");
    }
    if (error.response.status === 422) {
      throw new BadRequestError(error, "Error createUserAtenea");
    }
    if (error.response.status === 500) {
      throw new InternalServerError(error, "Error createUserAtenea");
    }
    throw new InternalServerError(error, "Error interno de Atenea");
  }
};

const updateUserAtenea = async (idExternal, agent, token) => {
  try {
    addAuthHeaderTokenCrud(token);
    const response = await instance.put(`users/${idExternal}`, agent);
    return response.data;
  } catch (error) {
    if (!(error instanceof AxiosError)) {
      throw new InternalServerError(error, "Ha ocurrido algún error");
    }
    if (error.response.status === 401) {
      throw new UnauthorizedError(error, "Error createUserAtenea");
    }
    if (error.response.status === 400) {
      throw new BadRequestError(error, "Error createUserAtenea");
    }
    if (error.response.status === 422) {
      throw new BadRequestError(error, "Error createUserAtenea");
    }
    if (error.response.status === 500) {
      throw new InternalServerError(error, "Error createUserAtenea")
    }
    throw new InternalServerError(error, "Error interno de Atenea");
  }
};

const enableDisableUserAtenea = async (action, idExternalAgent, token) => {
  try {
    addAuthHeaderTokenCrud(token);
    const data = {
      action: action,
      status: action === "enable" ? constants.agents.status.ENABLED : constants.agents.status.DISABLED,
    }
    const response = await instance.put(`/users/${data.action}/${idExternalAgent}`);
    await prisma.agent.updateMany({
      where: {
        idExternal: idExternalAgent,
      },
      data: {
        status: data.status,
      },
    })
    .catch((error) => {
      if (error.code == "P2025") {
        throw new NotFoundError(error, "Error en la activación/desactivación del agente.", "[enableDisableUserAtenea] " + error.meta.cause);

      } else {
        throw new InternalServerError(error, "Error en la activación/desactivación del agente.", "[enableDisableUserAtenea] Bad request");
      }
    });
    return response.data;
  } catch (error) {
    if (!(error instanceof AxiosError)) {
      throw new InternalServerError(error, "Ha ocurrido algún error");
    }
    if (error.response.status === 401) {
      throw new UnauthorizedError(error, "Error enableDisableUserAtenea");
    }
    if (error.response.status === 400) {
      throw new BadRequestError(error, "Error enableDisableUserAtenea");
    }
    if (error.response.status === 404) {
      throw new NotFoundError(error, "Error enableDisableUserAtenea");
    }
    if (error.response.status === 500) {
      throw new InternalServerError(error, "Error enableDisableUserAtenea");
    }
    throw new InternalServerError(error, "Error interno de Atenea");
  }
}

const changePassword = async ( data, token) => {
  try {
    instance.defaults.headers.common["authorization"] = token;
    const response = await instance.put("/api/users/password/change", data);
    const salt = bcrypt.genSaltSync(10);
    const hashpassword = bcrypt.hashSync(data.new_password, salt);
    await prisma.agent.update({
      where: {
        email: data.email,
      },
      data: {
        password: hashpassword,
      },
    })
    return response.data;
  } catch (error) {
    if (!(error instanceof AxiosError)) {
      throw new InternalServerError(error, "Ha ocurrido algún error");
    }
    if (error.response.status === 401) {
      throw new UnauthorizedError(error, "Error changePassword");
    }
    if (error.response.status === 404) {
      throw new BadRequestError(error, "Contraseña o correo incorrecto");
    }
    if (error.response.status === 403) {
      throw new ForbiddenError(error, "No se puede cambiar la contraseña de otro agente");
    }
    if (error.response.status === 400) {
      throw new BadRequestError(error, "La contraseña no puede ser igual a la anterior");
    }
    if (error.response.status === 422) {
      throw new BadRequestError(error, "Error changePassword");
    }
    if (error.response.status === 500) {
      throw new InternalServerError(error, "Error changePassword");
    }
    throw new InternalServerError(error, "Error interno de Atenea");
  }
};

const getInfoTokenAtenea = async (token) => {
  try {
    instance.defaults.headers.common['authorization'] = token;
    const response = await instance.get("/oauth/token/info");
    return response;
  } catch (error) {
    if (!(error instanceof AxiosError)) {
      throw new InternalServerError(error,"Ha ocurrido algún error");
    }
    if (error.response.status === 401) {
      throw new UnauthorizedError(
        error,
        error.response.data.error_description,
        "Error getInfoTokenAtenea 401"
      );
    }
    if (error.response.status === 400) {
      throw new BadRequestError(
        error,
        error.response.data.error_description,
        "Error getInfoTokenAtenea 400",
      );
    }
    if (error.response.status === 404) {
      throw new NotFoundError(
        error,
        error.response.data.error_description,
        "Error getInfoTokenAtenea 404",
      );
    }
    throw new InternalServerError(
      error,
      error.response.data,
      "Ha ocurrido un error en getInfoTokenAtenea",
    );
  }
};

const deleteUserRole = async (roleName, idExternalAgent, token) => {
  try {
    instance.defaults.headers.common['authorization'] = token;
    const response = await instance.delete(`users/${idExternalAgent}/role/${roleName}`);
    return response.data;
  } catch (error) {
    if (!(error instanceof AxiosError)) {
      throw new InternalServerError(error, "Ha ocurrido algún error");
    }
    if (error.response.status === 401) {
      throw new UnauthorizedError(error, "Error deleteUserRole");
    }
    if (error.response.status === 409) {
      throw new BadRequestError(error, "Error deleteUserRole");
    }
    if (error.response.status === 400) {
      throw new BadRequestError(error, "Error deleteUserRole");
    }
    if (error.response.status === 404) {
      throw new NotFoundError(error, "Error deleteUserRole");
    }
    if (error.response.status === 500) {
      throw new InternalServerError(error, "Error deleteUserRole");
    }
    throw new InternalServerError(error, "Error interno de Atenea");
  }
}

const expireAgentTickets = async (idAgent) => {
  await resolver.expireAgentTickets(idAgent);
}


module.exports = {
  getTokenAtenea,
  getTokenCreateUser,
  createUserAtenea,
  updateUserAtenea,
  enableDisableUserAtenea,
  getRefreshTokenAtenea,
  changePassword,
  getInfoTokenAtenea,
  deleteUserRole,
  expireAgentTickets,
};
