const { PrismaClient } = require('@prisma/client');
const config = require('../src/config');
const constants = require('../src/constants');
const prisma = new PrismaClient();

const showData = false;
const typeEnv = config.environment; // Types: "local", "develop", "stable"

const jsonFacebook = require('./jsonFacebook.json');
const jsonInstagram = require('./jsonInstagram.json');
const jsonWhatsApp = require('./jsonWhatsApp.json');
const jsonPruebas = require('./jsonPruebas.json');
const jsonFeedback = require('./jsonFeedback.json');


const enviroment = {
  "local": {
    "Channel": {
      "Facebook": {
        "name": "Hospital Facebook",
        "fantasyName": "hospital",
        "pageId": "100321912454874",
        "accessToken": "EAAI1YyEGsCABADq6kPRdPAS6OntQZAU2s78jXvlE3mTXmCykqQm9ZBp43CRqZAraprZCFVvYbc2ZCZB9HJuhZAwQ6LnUYdictgSZBW4KED9nkYxux6GL4l5ueRmq0N27Mn1Xy4spm7u71MZBzmuTNs4Md7WsDZClUJdFOJL3EvcfaSR0dIAvi8E2Lv",
        "verifyToken": "197c0cc8-2ffa-4f32-95a0-d8c17285437b",
        "version": "v12.0"
      },
      "Instagram": {
        "name": "Hospital Instagram",
        "fantasyName": "hospital_instagram",
        "pageId": "17841459196196505s",
        "accessToken": "EAAI1YyEGsCABACkpBgxL4C9akrxz1FKJdWdUe5VntatESIPFT0rYG373efQ03GKumNV4xQKUgNVHCJ1qZCRUx8nqLnMtnjeps2yRpAb9hkFz6GIRGGbGgZBWQeVxjiaHcPByZCf07PIrEReDNhyjHvJxN7JfJAU2GUc7WICWp6f3eGXf9S5",
        "verifyToken": "123123123",
        "version": "v16.0"
      },
      "WhatsApp": {
        "name": "Hospital WhatsApp",
        "fantasyName": "vinilos",
        "phoneId": "111326141694439",
        "accessToken": "EAAD4fAJUR2MBOx5OPzRjAzyz5ueruLP8BJK7ZAWNPZBeNYk1UiQuRWl031IL7MAAy8AIH4bkleZA3gOy65XxJHK1lYBx5WhbARns36gstTXTcne7espYv5WnJdTv0UkDVMPd7cUtzTtkgnog1uaGP5jZBo1VgBZAZAPlczfziqnw3B9AZAoU8eXd6YubenQ0qsUKrWfh7xEqQJU",
        "businessAccountId": "100713412775934",
        "verifyToken": "423423423",
        "version": "v15.0",
        "appId": "273211498710883",
      },
      "WebChat": {
        "name": "Hospital Webchat",
        "accessToken": "113856611205197"
      },
      "WebChatPruebas": {
        "name": "Hospital Pruebas",
        "accessToken": "119093252459982"
      },
    },
    "userIdChannel": {
      "Camilo": {
        "Facebook": "6228025713938407",
        "WhatsApp": ""
      },
      "Carolina": {
        "Facebook": "5759462887453094",
        "WhatsApp": "56999056682"
      },
      "Ismael": {
        "Facebook": "4401667169928613",
        "WhatsApp": "56930821819"
      },
      "Joaquin": {
        "Facebook": "5511077882337540",
        "WhatsApp": "56963433940"
      },
      "Lucas": {
        "Facebook": "4415548098533814",
        "WhatsApp": "56979821563"
      },
      "Nicolas": {
        "Facebook": "6339196279512962",
        "WhatsApp": "56923945177",
        "Instagram": "6350957128280629"
      },
    }
  },
  "develop": {
    "Channel": {
      "Facebook": {
        "name": "Hospital Facebook",
        "fantasyName": "hospital",
        "pageId": "100321912454874",
        "accessToken": "EAAI1YyEGsCABADq6kPRdPAS6OntQZAU2s78jXvlE3mTXmCykqQm9ZBp43CRqZAraprZCFVvYbc2ZCZB9HJuhZAwQ6LnUYdictgSZBW4KED9nkYxux6GL4l5ueRmq0N27Mn1Xy4spm7u71MZBzmuTNs4Md7WsDZClUJdFOJL3EvcfaSR0dIAvi8E2Lv",
        "verifyToken": "197c0cc8-2ffa-4f32-95a0-d8c17285437b",
        "version": "v12.0"
      },
      "Instagram": {
        "name": "Hospital Instagram",
        "fantasyName": "hospital_instagram",
        "pageId": "17841459196196505s",
        "accessToken": "EAAI1YyEGsCABACkpBgxL4C9akrxz1FKJdWdUe5VntatESIPFT0rYG373efQ03GKumNV4xQKUgNVHCJ1qZCRUx8nqLnMtnjeps2yRpAb9hkFz6GIRGGbGgZBWQeVxjiaHcPByZCf07PIrEReDNhyjHvJxN7JfJAU2GUc7WICWp6f3eGXf9S5",
        "verifyToken": "123123123",
        "version": "v16.0"
      },
      "WhatsApp": {
        "name": "Hospital WhatsApp",
        "fantasyName": "vinilos",
        "phoneId": "111326141694439",
        "accessToken": "EAAD4fAJUR2MBOx5OPzRjAzyz5ueruLP8BJK7ZAWNPZBeNYk1UiQuRWl031IL7MAAy8AIH4bkleZA3gOy65XxJHK1lYBx5WhbARns36gstTXTcne7espYv5WnJdTv0UkDVMPd7cUtzTtkgnog1uaGP5jZBo1VgBZAZAPlczfziqnw3B9AZAoU8eXd6YubenQ0qsUKrWfh7xEqQJU",
        "businessAccountId": "100713412775934",
        "verifyToken": "423423423",
        "version": "v15.0",
        "appId": "273211498710883",
      },
      "WebChat": {
        "name": "Hospital Webchat",
        "accessToken": "113856611205197"
      },
      "WebChatPruebas": {
        "name": "Hospital Pruebas",
        "accessToken": "119093252459982"
      },
    },
    "userIdChannel": {
      "Camilo": {
        "Facebook": "6228025713938407",
        "WhatsApp": ""
      },
      "Carolina": {
        "Facebook": "5759462887453094",
        "WhatsApp": "56999056682"
      },
      "Ismael": {
        "Facebook": "4401667169928613",
        "WhatsApp": "56930821819"
      },
      "Joaquin": {
        "Facebook": "5511077882337540",
        "WhatsApp": "56963433940"
      },
      "Lucas": {
        "Facebook": "4415548098533814",
        "WhatsApp": "56979821563"
      },
      "Nicolas": {
        "Facebook": "6339196279512962",
        "WhatsApp": "56923945177",
        "Instagram": "17841459196196505"
      },
    }
  },
}

const dataCompany = [
  {
    "id": "46cb3a02-b4d9-49ab-9f74-3a17a3cc5656",
    "name": enviroment[typeEnv].Channel.Facebook.name,
    "fantasyName": enviroment[typeEnv].Channel.Facebook.fantasyName,
  },
  {
    "id": "1bbb3ca2-b4b2-4bf5-a29e-3f23ed87d87e",
    "name": "Vinilos",
    "fantasyName": "vinilos"
  },
  {
    "id": "db4a0a28-79a3-42c8-976d-c8e31464af91",
    "name": "iCar Check!",
    "fantasyName": "iCarCheck"
  },
  {
    "id": "273e6d4d-39d6-40af-88c7-0b3f5808178a",
    "name": "Test_ChatBot",
    "fantasyName": "test"
  },
  {
    "id": "015c35ec-d9cc-4b77-838b-b30a86e107a0",
    "name": constants.company.name.TEST,
    "fantasyName": "channelPruebas"

  }
];

const dataChannel = [
  {
    "id": "f24aa5f5-c830-4cfd-9322-61bacd83a014",
    "idCompany": "46cb3a02-b4d9-49ab-9f74-3a17a3cc5656",
    "name": enviroment[typeEnv].Channel.Facebook.name,
    "type": constants.channel.type.FACEBOOK,
  },
  {
    "id": "a05d2600-7eb4-4f02-9d22-521d5ad8711e",
    "idCompany": "46cb3a02-b4d9-49ab-9f74-3a17a3cc5656",
    "name": enviroment[typeEnv].Channel.Instagram.name,
    "type": constants.channel.type.INSTAGRAM,
  },
  {
    "id": "753f6e4d-67c9-4cbf-a537-8956dabdee3a",
    "idCompany": "46cb3a02-b4d9-49ab-9f74-3a17a3cc5656",
    "name": enviroment[typeEnv].Channel.WhatsApp.name,
    "type": constants.channel.type.WHATSAPP,
  },
  {
    "id": "5da1fad8-11ac-4d0d-88a2-902d456c72f8",
    "idCompany": "46cb3a02-b4d9-49ab-9f74-3a17a3cc5656",
    "name": enviroment[typeEnv].Channel.WebChat.name,
    "type": constants.channel.type.WEBCHAT,
  },
  {
    "id": "022bc7f7-0369-437d-94c2-a51e6e43caf3",
    "idCompany": "015c35ec-d9cc-4b77-838b-b30a86e107a0",
    "name": enviroment[typeEnv].Channel.WebChatPruebas.name,
    "type": constants.channel.type.WEBCHAT,
  }
];

const dataEnvVar = [
  {
    "id": "56dc1c5f-cbea-43a8-b1c7-835170737bc1",
    "idChannel": "f24aa5f5-c830-4cfd-9322-61bacd83a014",
    "value": enviroment[typeEnv].Channel.Facebook.accessToken,
    "type": "FACEBOOK_PAGE_ACCESS_TOKEN"
  },
  {
    "id": "d92913b3-3d36-4dc1-82ff-4e17d74bbf11",
    "idChannel": "f24aa5f5-c830-4cfd-9322-61bacd83a014",
    "value": enviroment[typeEnv].Channel.Facebook.pageId,
    "type": "FACEBOOK_PAGE_ID"
  },
  {
    "id": "976bc588-e727-4aa6-bcd4-41a683e8158a",
    "idChannel": "f24aa5f5-c830-4cfd-9322-61bacd83a014",
    "value": enviroment[typeEnv].Channel.Facebook.verifyToken,
    "type": "FACEBOOK_VERIFY_TOKEN"
  },
  {
    "id": "ec124401-998c-4e1e-9b91-6311556a3f1f",
    "idChannel": "f24aa5f5-c830-4cfd-9322-61bacd83a014",
    "value": enviroment[typeEnv].Channel.Facebook.version,
    "type": "FACEBOOK_VERSION"
  },
  {
    "id": "24a12042-a763-48e8-b3b9-966c7c587eb0",
    "idChannel": "a05d2600-7eb4-4f02-9d22-521d5ad8711e",
    "value": enviroment[typeEnv].Channel.Instagram.accessToken,
    "type": "INSTAGRAM_ACCESS_TOKEN"
  },
  {
    "id": "6b8afff3-bb71-46e1-8c9c-e7d89dc80617",
    "idChannel": "a05d2600-7eb4-4f02-9d22-521d5ad8711e",
    "value": enviroment[typeEnv].Channel.Instagram.pageId,
    "type": "INSTAGRAM_PAGE_ID"
  },
  {
    "id": "il8attt3-bi01-3j71-1c2c-l99o2dc80617",
    "idChannel": "a05d2600-7eb4-4f02-9d22-521d5ad8711e",
    "value": enviroment[typeEnv].Channel.Facebook.pageId,
    "type": "INSTAGRAM_FACEBOOK_PAGE_ID"
  },
  {
    "id": "c654c78b-0cfb-4694-a970-745f90072cf1",
    "idChannel": "a05d2600-7eb4-4f02-9d22-521d5ad8711e",
    "value": enviroment[typeEnv].Channel.Instagram.verifyToken,
    "type": "INSTAGRAM_VERIFY_TOKEN"
  },
  {
    "id": "95166dca-6dbe-4b70-86ba-f480f470951d",
    "idChannel": "a05d2600-7eb4-4f02-9d22-521d5ad8711e",
    "value": enviroment[typeEnv].Channel.Instagram.version,
    "type": "INSTAGRAM_VERSION"
  },
  {
    "id": "673e4dc7-fe20-4a91-b536-354d261767e7",
    "idChannel": "753f6e4d-67c9-4cbf-a537-8956dabdee3a",
    "value": enviroment[typeEnv].Channel.WhatsApp.accessToken,
    "type": "WHATSAPP_ACCESS_TOKEN"
  },
  {
    "id": "9130f405-e345-4a05-8228-cf630312f992",
    "idChannel": "753f6e4d-67c9-4cbf-a537-8956dabdee3a",
    "value": enviroment[typeEnv].Channel.WhatsApp.businessAccountId,
    "type": "WHATSAPP_BUSINESS_ACCOUNT_ID"
  },
  {
    "id": "8002e11f-e8bf-4cd9-8476-5e1653ee9f4b",
    "idChannel": "753f6e4d-67c9-4cbf-a537-8956dabdee3a",
    "value": enviroment[typeEnv].Channel.WhatsApp.phoneId,
    "type": "WHATSAPP_PHONE_NUMBER_ID"
  },
  {
    "id": "12f1f474-62e5-4dda-bcfc-d0ccf2d31afb",
    "idChannel": "753f6e4d-67c9-4cbf-a537-8956dabdee3a",
    "value": enviroment[typeEnv].Channel.WhatsApp.verifyToken,
    "type": "WHATSAPP_VERIFY_TOKEN"
  },
  {
    "id": "2ff653d6-049a-4b13-a437-528e531e5d30",
    "idChannel": "753f6e4d-67c9-4cbf-a537-8956dabdee3a",
    "value": enviroment[typeEnv].Channel.WhatsApp.appId,
    "type": "WHATSAPP_APP_ID"
  },
  {
    "id": "673e4dc7-fe20-4a91-b536-354h261737e7",
    "idChannel": "753f6e4d-67c9-4cbf-a537-8956dabdee3a",
    "value": enviroment[typeEnv].Channel.WhatsApp.version,
    "type": "WHATSAPP_VERSION"
  },
  {
    "id": "13ae3d49-f732-41e1-a201-c45576321412",
    "idChannel": "5da1fad8-11ac-4d0d-88a2-902d456c72f8",
    "value": enviroment[typeEnv].Channel.WebChat.accessToken,
    "type": "WEBCHAT_ACCESS_TOKEN"
  },
  {
    "id": "03960d21-34fe-4e07-838a-6596505fe14a",
    "idChannel": "022bc7f7-0369-437d-94c2-a51e6e43caf3",
    "value": enviroment[typeEnv].Channel.WebChatPruebas.accessToken,
    "type": "WEBCHAT_ACCESS_TOKEN"
  },
];

const dataJsonFile =
  `
"{ \"id\": \"f24aa5f5-c830-4cfd-9322-61bacd83a014\", \"name\": \"MainFlow\", \"startWith\": [ \"Hola\", \"Buenas\", \"Buenos días\", \"Buenas tardes\", \"Buenas noches\" ], \"errorNode\": \"error-node\", \"errorNoAgentNode\": \"error-no-agent-node\", \"outTimeNode\": \"out-time-node\", \"flowNodes\": [ { \"id\": \"greetingsUnknownUser1\", \"isStartNode\": false, \"isLastNode\": false, \"flowCreationClient\": true, \"isToUnknownUser\": true, \"flowNodeType\": \"Question\", \"flowReplies\": [ { \"data\": \"¡Hola usuario nuevo!\" }, { \"data\": \"¿Cuál es tu nombre?\" } ], \"userKey\": \"firstName\", \"userTypeInput\": \"text\", \"answerValidation\": { \"type\": \"None\", \"minValue\": \"\", \"maxValue\": \"\", \"regex\": \"\", \"fallback\": \"\", \"failsCount\": \"\" }, \"nodeResultId\": { \"correct\": \"pre-greetingsUnknownUser2\" } }, { \"id\": \"pre-greetingsUnknownUser2\", \"isStartNode\": false, \"isLastNode\": true, \"flowCreationClient\": true, \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"También necesitamos tu correo electrónico.\" } ], \"nodeResultId\": \"greetingsUnknownUser2\" }, { \"id\": \"greetingsUnknownUser2\", \"isStartNode\": false, \"isLastNode\": false, \"flowCreationClient\": true, \"flowNodeType\": \"Question\", \"flowReplies\": [ { \"data\": \"¿Cuál es tu correo electrónico?\" } ], \"userKey\": \"email\", \"userTypeInput\": \"text\", \"answerValidation\": { \"type\": \"email\", \"minValue\": \"\", \"maxValue\": \"\", \"regex\": \"^(([^<>()[\\\\\\\\]\\\\\\\\\\\\\\\\.,;:\\\\\\\\s@\\\\\\\"]+(\\\\\\\\.[^<>()[\\\\\\\\]\\\\\\\\\\\\\\\\.,;:\\\\\\\\s@\\\\\\\"]+)*)|(\\\\\\\".+\\\\\\\"))@((\\\\\\\\[[0-9]{1,3}\\\\\\\\.[0-9]{1,3}\\\\\\\\.[0-9]{1,3}\\\\\\\\.[0-9]{1,3}\\\\\\\\])|(([a-zA-Z\\\\\\\\-0-9]+\\\\\\\\.)+[a-zA-Z]{2,}))$\", \"fallback\": \"\", \"failsCount\": \"\" }, \"nodeResultId\": { \"correct\": \"pre-greetingsUnknownUser3\", \"incorrect\": \"incorrect-email\" } }, { \"id\": \"incorrect-email\", \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"El correo ingresado no es válido.\" }, { \"data\": \"Recuerda seguir el siguiente formato: \\\\\\\"correo@example.com\\\\\\\"\" } ] }, { \"id\": \"pre-greetingsUnknownUser3\", \"isStartNode\": false, \"isLastNode\": true, \"flowCreationClient\": true, \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"Y por último tu número de teléfono.\" } ], \"nodeResultId\": \"greetingsUnknownUser3\" }, { \"id\": \"greetingsUnknownUser3\", \"isStartNode\": false, \"isLastNode\": false, \"flowCreationClient\": true, \"flowNodeType\": \"Question\", \"flowReplies\": [ { \"data\": \"El teléfono debe seguir este formato: +56967896789\" }, { \"data\": \"('+569' seguido de los 8 dígitos del teléfono)\" } ], \"userKey\": \"phone\", \"userTypeInput\": \"text\", \"answerValidation\": { \"type\": \"None\", \"minValue\": \"\", \"maxValue\": \"\", \"regex\": \"^(\\\\\\\\+?56)?(\\\\\\\\s?)(0?9)(\\\\\\\\s?)\\\\\\\\d{8}$\", \"fallback\": \"\", \"failsCount\": \"\" }, \"nodeResultId\": { \"correct\": \"main\", \"incorrect\": \"incorrect-phone\" } }, { \"id\": \"incorrect-phone\", \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"El número de teléfono no es válido.\" }, { \"data\": \"Recuerda seguir el siguiente formato: \\\\\\\"+56912341234\\\\\\\"\" } ] }, { \"id\": \"main\", \"isStartNode\": true, \"isLastNode\": false, \"flowNodeType\": \"Buttons\", \"buttonsHeader\": \"{{user.firstName}}, ¿en qué te puedo ayudar?\", \"buttonsFooter\": \"Para confirmar selecciona una opción:\", \"buttonsItems\": [ { \"id\": \"dae636cda3294637b583e7c230a09978\", \"buttonText\": \"Reservar hora\", \"nodeResultId\": \"4c9e9c9a78404dfabbc52583d138c887\" }, { \"id\": \"eb25aaf7843e40c7bc89761dcc7ea0e9\", \"buttonText\": \"Ver especialidades\", \"nodeResultId\": \"1232ca5a77fb4ef9a0472bea94587fd4\" }, { \"id\": \"e522c135bee14ded8e031db9ae34c45b\", \"buttonText\": \"Contactar Agente\", \"nodeResultId\": \"d29455ea95ca4e3fa872b1c4d252c9a8\" } ] }, { \"id\": \"error-node\", \"isStartNode\": false, \"isLastNode\": false, \"flowNodeType\": \"Buttons\", \"buttonsHeader\": \"No pudimos resolver su solicitud\", \"buttonsFooter\": \"¿Deseas volver al inicio?\", \"buttonsItems\": [ { \"id\": \"fe693aff-084e-4221-a34b-038a7c4d17fe\", \"buttonText\": \"Si\", \"nodeResultId\": \"main\", \"keepCurrentNode\": false }, { \"id\": \"fa4f0c1c-37ac-441f-8856-3820df18c3e1\", \"buttonText\": \"No\", \"nodeResultId\": \"c751381326074e63bff5110599779d34\", \"keepCurrentNode\": false }, { \"id\": \"c1fa0c4f-d8c1-441f-3810-3820d37ac3e1\", \"buttonText\": \"Volver a intentar\", \"nodeResultId\": \"keepCurrentNode\", \"keepCurrentNode\": true } ] }, { \"id\": \"error-no-agent-node\", \"isStartNode\": false, \"isLastNode\": false, \"flowNodeType\": \"Buttons\", \"buttonsHeader\": \"Lo sentimos, en estos momentos no hay agentes disponibles\", \"buttonsFooter\": \"¿Deseas volver al inicio?\", \"buttonsItems\": [ { \"id\": \"fe693aff-084e-4221-a34b-038a7c4d17fe\", \"buttonText\": \"Si\", \"nodeResultId\": \"main\", \"keepCurrentNode\": false }, { \"id\": \"fa4f0c1c-37ac-441f-8856-3820df18c3e1\", \"buttonText\": \"No\", \"nodeResultId\": \"surveySelection\", \"nododeverdad\": \"c751381326074e63bff5110599779d34\", \"keepCurrentNode\": false } ] }, { \"id\": \"out-time-node\", \"isStartNode\": false, \"isLastNode\": false, \"flowNodeType\": \"Buttons\", \"buttonsHeader\": \"No pudimos resolver su solicitud\", \"buttonsFooter\": \"¿Deseas volver al inicio?\", \"buttonsItems\": [ { \"id\": \"fe693aff-084e-4221-a34b-038a7c4d17fe\", \"buttonText\": \"Si\", \"nodeResultId\": \"main\", \"keepCurrentNode\": false }, { \"id\": \"fa4f0c1c-37ac-441f-8856-3820df18c3e1\", \"buttonText\": \"No\", \"nodeResultId\": \"c751381326074e63bff5110599779d34\", \"keepCurrentNode\": false } ] }, { \"id\": \"4c9e9c9a78404dfabbc52583d138c887\", \"isStartNode\": false, \"isLastNode\": false, \"flowNodeType\": \"Question\", \"flowReplies\": [ { \"data\": \"Por favor, ingresa la fecha y hora de tu reserva con el siguiente formato: \\\\\\\"DD-MM-AAAA hh:mm\\\\\\\"\" }, { \"data\": \"Ejemplo, 25-06-2023 18:30\" } ], \"userInputVariable\": \"selected_date\", \"userTypeInput\": \"date_time\", \"answerValidation\": { \"type\": \"date\", \"minValue\": \"now\", \"maxValue\": \"2030-12-31\", \"regex\": \"^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2}) (2[0-3]|[01][0-9])[./:]([0-5][0-9])$\", \"fallback\": \"\", \"failsCount\": \"\" }, \"nodeResultId\": { \"correct\": \"35067e2d0a214a57b690e8ea7a531e1c\", \"incorrect\": \"beee55e348b04c7fa4565a1421a77326\" } }, { \"id\": \"beee55e348b04c7fa4565a1421a77326\", \"isStartNode\": false, \"isLastNode\": false, \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"La fecha ingresada es incorrecta. Inténtalo de nuevo.\" }, { \"data\": \"Recuerda seguir el siguiente formato: \\\\\\\"DD-MM-AAAA hh:mm\\\\\\\"\" } ] }, { \"id\": \"35067e2d0a214a57b690e8ea7a531e1c\", \"isStartNode\": false, \"isLastNode\": true, \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"Tu hora quedó registrada para el {{user.answers.selected_date.day}}-{{user.answers.selected_date.month}}-{{user.answers.selected_date.year}} a las {{user.answers.selected_date.hour}}:{{user.answers.selected_date.minute}} horas \\\\n\\\\n ¡Agradecemos tu preferencia!\" } ], \"nodeResultId\": \"b794ab13350c44308687cd809e817437\" }, { \"id\": \"b794ab13350c44308687cd809e817437\", \"isStartNode\": false, \"isLastNode\": false, \"flowNodeType\": \"Buttons\", \"buttonsHeader\": \"{{user.firstName}}, ¿deseas hacer algo más?\", \"buttonsFooter\": \"Selecciona una opción\", \"buttonsItems\": [ { \"id\": \"090f4407d9ba405fa982c1350a91d5fd\", \"buttonText\": \"Si, volver al menú\", \"nodeResultId\": \"main\" }, { \"id\": \"8ec9dc429b6f4ed984cef88326e75814\", \"buttonText\": \"No, gracias\", \"nodeResultId\": \"c751381326074e63bff5110599779d34\" } ] }, { \"id\": \"c751381326074e63bff5110599779d34\", \"isStartNode\": false, \"isLastNode\": false, \"isFinishNode\": true, \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"Gracias por contactarnos, ¡que tengas un buen día!\" } ] }, { \"id\": \"1232ca5a77fb4ef9a0472bea94587fd4\", \"isStartNode\": false, \"isLastNode\": false, \"flowNodeType\": \"Question-List\", \"flowReplies\": [ { \"data\": \"Por favor, escribe el nombre de la especialidad que buscas. Por ejemplo: Fonoaudiología.\" }, { \"data\": \"Si quieres ver todas las opciones escribe: \\\\\\\"Todas las especialidades\\\\\\\"\" } ], \"userInputVariable\": \"selected_categories\", \"userTypeInput\": \"text\", \"answerValidation\": { \"type\": \"None\", \"minValue\": \"\", \"maxValue\": \"\", \"regex\": \"\", \"fallback\": \"\", \"failsCount\": \"\" }, \"expectedAnswers\": [ { \"id\": \"b5d1\", \"expectedInput\": [ \"Cirugía General\", \"Diabetologia\", \"Fonoaudiologia\", \"Kinesiología\", \"Odontología\", \"Psicología\", \"Radioterapia\" ], \"showAll\": false, \"nodeResultId\": \"08a31051996e4f17901b3f17544025b0\" }, { \"id\": \"fa7f4a39f6e70a780db1a9856c2d5da6\", \"expectedInput\": \"Terapia Ocupacional\", \"showAll\": false, \"nodeResultId\": \"08a31051996e4f17901b3f17544025b0\" }, { \"id\": \"da69f6e70a7f4aa780db1a985f36c2d5\", \"expectedInput\": \"Todas las especialidades\", \"headerShowAll\": \"Las especialidades disponibles son:\", \"footerShowAll\": \"Texto Footer\", \"showAll\": true } ], \"nodeResultId\": { \"incorrect\": \"1f598cacf2b341a4b20dc79345feec7e\" } }, { \"id\": \"1f598cacf2b341a4b20dc79345feec7e\", \"isStartNode\": false, \"isLastNode\": false, \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"De momento no contamos con esa especialidad en el hospital\" }, { \"data\": \"Por favor, ingrese nuevamente una especialidad\" }, { \"data\": \"Recuerde que escribiendo \\\\\\\"Todas los especialidades\\\\\\\" podrá revisar que especialidad cuenta el hospital\" } ] }, { \"id\": \"08a31051996e4f17901b3f17544025b0\", \"isStartNode\": false, \"isLastNode\": true, \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"Estos son los profesionales disponibles para {{user.answers.selected_categories}}:\" }, { \"data\": \"1.- Dr. Felipe Hodgson \\\\n2.- Dra. Florencia de Barbieri M. \\\\n3.- Dr. Matías Luco Illanes.\" } ], \"nodeResultId\": \"b794ab13350c44308687cd809e817437\" }, { \"id\": \"d29455ea95ca4e3fa872b1c4d252c9a8\", \"isStartNode\": false, \"isLastNode\": false, \"chatToAdmin\": true, \"area\": \"ecf08c4d-38e1-4ee1-894c-04bfab1ab8cf\", \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"¡Hola! Mi nombre es {{admin.fullname}}\" }, { \"data\": \"Cuéntame, ¿en qué te puedo ayudar? :)\" } ], \"nodeResultId\": null }, { \"id\": \"campaignFirst\", \"isStartNode\": true, \"isLastNode\": false, \"flowNodeType\": \"Buttons\", \"buttonsHeader\": \"¡Hola!\", \"buttonsFooter\": \"¿Tu eres {{client.firstName}}? ¿verdad?\", \"params\": [ \"client.firstName\" ], \"buttonsItems\": [ { \"id\": \"dae636cda3294637b583e7c230a09978\", \"buttonText\": \"Si\", \"nodeResultId\": \"yes\" }, { \"id\": \"eb25aaf7843e40c7bc89761dcc7ea0e9\", \"buttonText\": \"No\", \"nodeResultId\": \"no\" } ] }, { \"id\": \"yes\", \"isStartNode\": false, \"isLastNode\": false, \"isFinishNode\": true, \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"Gracias por tu confirmación {{user.firstName}}\" }, { \"data\": \"¡Que tengas un buen día!\" } ] }, { \"id\": \"no\", \"isStartNode\": false, \"isLastNode\": false, \"isFinishNode\": true, \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"¡Entendido! Gracias por tu confirmación\" }, { \"data\": \"¡Que tengas un buen día!\" } ] }, { \"id\": \"surveySelection\", \"isStartNode\": false, \"isLastNode\": false, \"isFinishNode\": false, \"flowNodeType\": \"Buttons\", \"buttonsHeader\": \"¿Que tipo de encuesta quieres responder?\", \"buttonsFooter\": \"Elige una opción\", \"buttonsItems\": [ { \"id\": \"felk34aff-084e-z2a1-a34b-03jkk1217fe\", \"buttonText\": \"Encuesta ESB\", \"nodeResultId\": \"esbSurvey\", \"keepCurrentNode\": false }, { \"id\": \"fa4f78h2kc-90ac-llff-8jj6-3820pks3c3e1\", \"buttonText\": \"Encuesta CSAT\", \"nodeResultId\": \"csatSurvey\", \"keepCurrentNode\": false }, { \"id\": \"fa4f0092kc-37ac-007f-8pp6-38200083c3e1\", \"buttonText\": \"Encuesta NPS\", \"nodeResultId\": \"npsSurvey\", \"keepCurrentNode\": false } ] }, { \"id\": \"esbSurvey\", \"isStartNode\": false, \"isLastNode\": false, \"isFinishNode\": false, \"flowNodeType\": \"Buttons\", \"buttonsHeader\": \"¿Te sirvió la respuesta?\", \"buttonsFooter\": \"Elige una opción\", \"buttonsItems\": [ { \"id\": \"fe69ggaff-084e-z2a1-a34b-03j454d17fe\", \"buttonText\": \"Si\", \"nodeResultId\": \"esbYes\", \"keepCurrentNode\": false }, { \"id\": \"fa4f0k32kc-37ac-4fff-8pp6-3820pks3c3e1\", \"buttonText\": \"No\", \"nodeResultId\": \"esbNo\", \"keepCurrentNode\": false } ] }, { \"id\": \"esbYes\", \"isStartNode\": false, \"isLastNode\": false, \"isFinishNode\": true, \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"¡Gracias por tu respuesta!\" } ] }, { \"id\": \"esbNo\", \"isStartNode\": false, \"isLastNode\": false, \"isFinishNode\": true, \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"Lo Siento, Prometemos mejorar\" } ] }, { \"id\": \"npsSurvey\", \"isStartNode\": false, \"isLastNode\": false, \"isFinishNode\": false, \"flowNodeType\": \"Question\", \"answerValidation\": { \"type\": \"number\", \"min\": 1, \"max\": 10, \"regex\": \"\", \"failsCount\": 0 }, \"flowReplies\": [ { \"data\": \"En una escala del 1-10 (siendo 1 lo más bajo y 10 lo más alto) ¿Qué tan probable es que recomiendes este servicio a un amigo ocolega?\" } ], \"nodeResultId\": \"npsSurveyReason\" }, { \"id\": \"npsSurveyReason\", \"isStartNode\": false, \"isLastNode\": false, \"flowNodeType\": \"Question\", \"answerValidation\": { \"type\": \"text\", \"min\": \"\", \"max\": \"\", \"regex\": \"\", \"failsCount\": 0 }, \"flowReplies\": [ { \"data\": \"¿Por qué nos pones esa calificación?\" } ], \"nodeResultId\": \"npsSurveyThanks\" }, { \"id\": \"npsSurveyThanks\", \"isStartNode\": false, \"isLastNode\": false, \"isFinishNode\": true, \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"Muchas gracias por tu respuesta\" } ], \"nodeResultId\": \"npsSurveyThanks\" }, { \"id\": \"csatSurvay\", \"isStartNode\": false, \"isLastNode\": false, \"isFinishNode\": false, \"flowNodeType\": \"Buttons\", \"buttonsHeader\": \"¿Cómo evaaluarías el servico prestado?\", \"buttonsFooter\": \"Elige una opción\", \"buttonsItems\": [ { \"id\": \"fe69ggaff-084e-z2a1-a34b-03j454d17fe\", \"buttonText\": \"Muy Malo\", \"nodeResultId\": \"csatGood\", \"keepCurrentNode\": false }, { \"id\": \"fa4f0k32kc-37ac-4fff-8pp6-3820pks3c3e1\", \"buttonText\": \"Malo\", \"nodeResultId\": \"csatRegular\", \"keepCurrentNode\": false }, { \"id\": \"fa4f0k32kc-37ac-4fff-8pp6-3820pks3c3e1\", \"buttonText\": \"Regular\", \"nodeResultId\": \"csatBad\", \"keepCurrentNode\": false }, { \"id\": \"fa4f0k32kc-37ac-4fff-8pp6-3820pks3c3e1\", \"buttonText\": \"Bueno\", \"nodeResultId\": \"csatRegular\", \"keepCurrentNode\": false }, { \"id\": \"fa4f0k32kc-37ac-4fff-8pp6-3820pks3c3e1\", \"buttonText\": \"Excelente\", \"nodeResultId\": \"csatBad\", \"keepCurrentNode\": false } ] }, { \"id\": \"csatSurveyThanks\", \"isStartNode\": false, \"isLastNode\": false, \"isFinishNode\": true, \"flowNodeType\": \"Message\", \"flowReplies\": [ { \"data\": \"Muchas gracias por tu respuesta\" } ], \"nodeResultId\": \"npsSurveyThanks\" } ] }"
`

const dataJsonFilePruebas =
  `
{ "id": "022bc7f7-0369-437d-94c2-a51e6e43caf3", "name": "PruebasUnitarias", "startWith": [ "Hola", "Buenas", "Buenos días", "Buenas tardes", "Buenas noches" ], "errorNode": "error-node", "flowNodes": [ { "id": "greetingsNewClient1", "isStartNode": false, "isLastNode": false, "isToUnknownUser": true, "flowNodeType": "Question", "flowReplies": [ { "data": "¡Hola usuario nuevo!" }, { "data": "¿Cuál es tu nombre?" } ], "userKey": "firstName", "userTypeInput": "text", "answerValidation": { "type": "", "minValue": "", "maxValue": "", "regex": "", "fallback": "", "failsCount": "" }, "nodeResultId": { "correct": "pre-greetingsNewClient2" } }, { "id": "pre-greetingsNewClient2", "isStartNode": false, "isLastNode": true, "flowNodeType": "Message", "flowReplies": [ { "data": "{{user.firstName}}, también necesitamos tu correo electrónico." } ], "nodeResultId": "greetingsNewClient2" }, { "id": "greetingsNewClient2", "isStartNode": false, "isLastNode": false, "flowNodeType": "Question", "flowReplies": [ { "data": "¿Cuál es tu correo electrónico?" } ], "userKey": "email", "userTypeInput": "text", "answerValidation": { "type": "", "minValue": "", "maxValue": "", "regex": "^(([^<>()[\\\\]\\\\\\\\.,;:\\\\s@\\\"]+(\\\\.[^<>()[\\\\]\\\\\\\\.,;:\\\\s@\\\"]+)*)|(\\\".+\\\"))@((\\\\[[0-9]{1,3}\\\\.[0-9]{1,3}\\\\.[0-9]{1,3}\\\\.[0-9]{1,3}\\\\])|(([a-zA-Z\\\\-0-9]+\\\\.)+[a-zA-Z]{2,}))$", "fallback": "", "failsCount": "" }, "nodeResultId": { "correct": "pre-greetingsNewClient3", "incorrect": "incorrect-email" } }, { "id": "incorrect-email", "flowNodeType": "Message", "flowReplies": [ { "data": "El correo electrónico ingresado no es válido." }, { "data": "Recuerda seguir el siguiente formato: \\\"correo@example.com\\\"" } ] }, { "id": "pre-greetingsNewClient3", "isStartNode": false, "isLastNode": true, "flowNodeType": "Message", "flowReplies": [ { "data": "{{user.firstName}} tu correo electrónico fue guardado!" } ], "nodeResultId": "greetingsNewClient3" }, { "id": "greetingsNewClient3", "isStartNode": false, "isLastNode": false, "flowNodeType": "Question", "flowReplies": [ { "data": "Por último necesitamos tu teléfono" }, { "data": "Debe seguir el siguiente formato: \\\"+56912341234\\\"" } ], "userKey": "phone", "userTypeInput": "text", "answerValidation": { "type": "None", "minValue": "", "maxValue": "", "regex": "^(\\\\+?56)?(\\\\s?)(0?9)(\\\\s?)[9876543]\\\\d{7}$", "fallback": "", "failsCount": "" }, "nodeResultId": { "correct": "pre-main", "incorrect": "incorrect-phone" } }, { "id": "incorrect-phone", "flowNodeType": "Message", "flowReplies": [ { "data": "El número de teléfono no es válido." }, { "data": "Recuerda seguir el siguiente formato: \\\"+56912341234\\\"" } ] }, { "id": "error-node", "isStartNode": false, "isLastNode": false, "flowNodeType": "Buttons", "buttonsHeader": "No pudimos resolver su solicitud", "buttonsFooter": "¿Deseas volver al inicio?", "buttonsItems": [ { "id": "fe693aff-084e-4221-a34b-038a7c4d17fe", "buttonText": "Si", "nodeResultId": "main", "keepCurrentNode": false }, { "id": "fa4f0c1c-37ac-441f-8856-3820df18c3e1", "buttonText": "No", "nodeResultId": "out-node", "keepCurrentNode": false }, { "id": "c1fa0c4f-d8c1-441f-3810-3820d37ac3e1", "buttonText": "Volver a intentar", "nodeResultId": "keepCurrentNode", "keepCurrentNode": true } ] }, { "id": "end-flow", "isStartNode": false, "isLastNode": false, "flowNodeType": "Buttons", "buttonsHeader": "{{user.firstName}}, ¿deseas hacer algo más?", "buttonsFooter": "Selecciona una opción", "buttonsItems": [ { "id": "090f4407d9ba405fa982c1350a91d5fd", "buttonText": "Si, volver al menú", "nodeResultId": "main" }, { "id": "8ec9dc429b6f4ed984cef88326e75814", "buttonText": "No, gracias", "nodeResultId": "out-node" } ] }, { "id": "out-node", "isStartNode": false, "isLastNode": false, "flowNodeType": "Message", "flowReplies": [ { "data": "Gracias por contactarnos, ¡que tengas un buen día!" } ] }, { "id": "pre-main", "isStartNode": false, "isLastNode": true, "flowNodeType": "Message", "flowReplies": [ { "data": "{{user.firstName}} tu teléfono fue guardado!" } ], "nodeResultId": "main" }, { "id": "main", "isStartNode": true, "isLastNode": false, "flowNodeType": "Buttons", "buttonsHeader": "{{user.firstName}}, ¿en qué te puedo ayudar?", "buttonsFooter": "Para confirmar selecciona una opción:", "buttonsItems": [ { "id": "dae636cda3294637b583e7c230a09978", "buttonText": "Preguntar por Datos", "nodeResultId": "asking-data" }, { "id": "eb25aaf7843e40c7bc89761dcc7ea0e9", "buttonText": "Reservar Hora", "nodeResultId": "asking-reservation" }, { "id": "e522c135bee14ded8e031db9ae34c45b", "buttonText": "Revisar Clima", "nodeResultId": "asking-api" } ] }, { "id": "asking-data", "isStartNode": true, "isLastNode": false, "flowNodeType": "Buttons", "buttonsHeader": "¿Qué datos completará?", "buttonsFooter": "Por favor seleccione una opción:", "buttonsItems": [ { "id": "dae636cda3294637b583e7c230a09978", "buttonText": "La Edad", "nodeResultId": "asking-age" }, { "id": "eb25aaf7843e40c7bc89761dcc7ea0e9", "buttonText": "El Rut", "nodeResultId": "asking-rut" }, { "id": "e522c135bee14ded8e031db9ae34c45b", "buttonText": "El Correo Electrónico", "nodeResultId": "asking-email" } ] }, { "id": "asking-api", "isStartNode": true, "isLastNode": false, "flowNodeType": "Buttons", "buttonsHeader": "¿Qué datos completará?", "buttonsFooter": "Por favor seleccione una opción:", "buttonsItems": [ { "id": "dae636cda3294637b583e7c230a09978", "buttonText": "Revisar Clima Correcto", "nodeResultId": "asking-correctweather" }, { "id": "eb25aaf7843e40c7bc89761dcc7ea0e9", "buttonText": "Revisar Clima Incorrecto", "nodeResultId": "asking-incorrectweather" } ] }, { "id": "asking-age", "isStartNode": false, "isLastNode": false, "flowNodeType": "Question", "flowReplies": [ { "data": "¿Cuál es tu edad?" }, { "data": "Recuerda que debes ingresar un número." } ], "userInputVariable": "age", "userTypeInput": "text", "answerValidation": { "type": "number", "minValue": 5, "maxValue": 100, "regex": "", "fallback": "", "failsCount": 2 }, "nodeResultId": { "correct": "correct-age", "incorrect": "incorrect-age", "failsCount": "error-node" } }, { "id": "incorrect-age", "isStartNode": false, "isLastNode": false, "flowNodeType": "Message", "flowReplies": [ { "data": "La edad ingresada no es válida." }, { "data": "Recuerda que debes ingresar un número entre 5 y 100." } ] }, { "id": "correct-age", "isStartNode": false, "isLastNode": true, "flowNodeType": "Message", "flowReplies": [ { "data": "Tu edad de {{user.answers.age}} años quedó registrada.\\n\\n ¡Agradecemos tu respuesta!" } ], "nodeResultId": "end-flow" }, { "id": "asking-rut", "isStartNode": false, "isLastNode": false, "flowNodeType": "Question", "flowReplies": [ { "data": "¿Cuál es tu Rut?" }, { "data": "Ingresa tu Rut sin puntos y con guión" }, { "data": "El Rut debe seguir el siguiente formato: 12345678-9" } ], "userInputVariable": "rut_client", "userTypeInput": "rut", "answerValidation": { "type": "", "minValue": "", "maxValue": "", "regex": "^(\\\\d{7,9}-[\\\\dkK])$", "fallback": "", "failsCount": 2 }, "nodeResultId": { "correct": "correct-rut", "incorrect": "incorrect-rut", "failsCount": "error-node" } }, { "id": "incorrect-rut", "isStartNode": false, "isLastNode": false, "flowNodeType": "Message", "flowReplies": [ { "data": "El 'Rut' ingresado no es válido" }, { "data": "Recuerda que el 'Rut' no debe contener puntos y si con guión." }, { "data": "El formato sería el siguiente: 12345678-9" } ] }, { "id": "correct-rut", "isStartNode": false, "isLastNode": true, "flowNodeType": "Message", "flowReplies": [ { "data": "Se ha registrado tu rut: {{user.answers.rut_client}}\\n\\n ¡Agradecemos tu respuesta!" } ], "nodeResultId": "end-flow" }, { "id": "asking-email", "isStartNode": false, "isLastNode": false, "flowNodeType": "Question", "flowReplies": [ { "data": "¿Cuál es tu correo electrónico?" } ], "userInputVariable": "email", "userTypeInput": "text", "answerValidation": { "type": "email", "minValue": "", "maxValue": "", "regex": "", "fallback": "", "failsCount": 2 }, "nodeResultId": { "correct": "correct-email", "incorrect": "incorrect-email", "failsCount": "error-node" } }, { "id": "incorrect-email", "isStartNode": false, "isLastNode": false, "flowNodeType": "Message", "flowReplies": [ { "data": "El correo electrónico ingresado no es válido." }, { "data": "Recuerda seguir el siguiente formato: \\\"correo@example.com\\\"" } ] }, { "id": "correct-email", "isStartNode": false, "isLastNode": true, "flowNodeType": "Message", "flowReplies": [ { "data": "{{user.firstName}} tu correo electrónico fue guardado!" } ], "nodeResultId": "end-flow" }, { "id": "asking-reservation", "isStartNode": false, "isLastNode": false, "flowNodeType": "Question", "flowReplies": [ { "data": "Por favor, ingresa la fecha y hora de tu reserva con el siguiente formato: \\\"DD-MM-AAAA hh:mm\\\"" }, { "data": "Ejemplo, 20-03-2023 18:30" }, { "data": "Recuerda que el rango de la fecha debe ser entre el 15 de Marzo y el 30 de Marzo del 2023" } ], "userInputVariable": "selected_date", "userTypeInput": "date_time", "answerValidation": { "type": "date", "minValue": "2023-03-15", "maxValue": "2023-03-30", "regex": "^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2}) (2[0-3]|[01][0-9])[./:]([0-5][0-9])$", "fallback": "", "failsCount": "" }, "nodeResultId": { "correct": "correct-reservation", "incorrect": "incorrect-reservation" } }, { "id": "incorrect-reservation", "isStartNode": false, "isLastNode": false, "flowNodeType": "Message", "flowReplies": [ { "data": "La fecha ingresada es incorrecta. Inténtalo de nuevo." }, { "data": "Recuerda seguir el siguiente formato: \\\"DD-MM-AAAA hh:mm\\\"" } ] }, { "id": "correct-reservation", "isStartNode": false, "isLastNode": true, "flowNodeType": "Message", "flowReplies": [ { "data": "Tu hora quedó registrada para el {{user.answers.selected_date.day}}-{{user.answers.selected_date.month}}-{{user.answers.selected_date.year}} a las {{user.answers.selected_date.hour}}:{{user.answers.selected_date.minute}} horas \\n\\n ¡Agradecemos tu preferencia!" } ], "nodeResultId": "end-flow" }, { "id": "asking-correctweather", "isStartNode": false, "isLastNode": true, "flowNodeType": "API", "flowReplies": [ { "data": "Obteniendo información del clima para Valparaíso" }, { "data": "La temperatura actual es de {{user.answersApi.currentWeather}}°C" }, { "data": "Hoy habrá una mínima de {{user.answersApi.minTemperature}}°C y una máxima de {{user.answersApi.maxTemperature}}°C" } ], "APIUrl": "https://api.open-meteo.com/v1/forecast?latitude=-33.04&longitude=-71.63&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset&current_weather=true&timezone=auto", "method": "GET", "headers": "", "body": "", "mappingSettings": [ { "mappingData": "{{current_weather}}{{temperature}}", "nameVariable": "currentWeather" }, { "mappingData": "{{daily}}{{temperature_2m_max}}{{0}}", "nameVariable": "maxTemperature" }, { "mappingData": "{{daily}}{{temperature_2m_min}}{{0}}", "nameVariable": "minTemperature" } ], "errorReplies": [ { "data": "Ha ocurrido un error al obtener la información" } ], "serverErrorReplies": [ { "data": "Ha ocurrido un error en el servidor" }, { "data": "Por favor inténtelo más tarde" } ], "nodeResultId": "end-flow" }, { "id": "asking-incorrectweather", "isStartNode": false, "isLastNode": true, "flowNodeType": "API", "flowReplies": [ { "data": "Obteniendo información del clima para Valparaíso" }, { "data": "La temperatura actual es de {{user.answersApi.currentWeather}}°C" }, { "data": "Hoy habrá una mínima de {{user.answersApi.minTemperature}}°C y una máxima de {{user.answersApi.maxTemperature}}°C" } ], "APIUrl": "https://api.open-meteo.com/v1/forecast?latitude=-11133.04&longitude=-1111111&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset&current_weather=true&timezone=auto", "method": "GET", "headers": "", "body": "", "mappingSettings": [ { "mappingData": "{{current_weather}}{{temperature}}", "nameVariable": "currentWeather" }, { "mappingData": "{{daily}}{{temperature_2m_max}}{{0}}", "nameVariable": "maxTemperature" }, { "mappingData": "{{daily}}{{temperature_2m_min}}{{0}}", "nameVariable": "minTemperature" } ], "errorReplies": [ { "data": "Ha ocurrido un error al obtener la información" } ], "serverErrorReplies": [ { "data": "Ha ocurrido un error en el servidor" }, { "data": "Por favor inténtelo más tarde" } ], "nodeResultId": "end-flow" } ] }
`

const dataFlow = [
  {
    "id": "300998d2-d8fb-415a-a6b9-35761a78699a",
    "jsonFile": JSON.stringify(jsonFacebook),
    "trigger": "Trigger " + enviroment[typeEnv].Channel.Facebook.name
  },
  {
    "id": "ae161d88-6c54-45ad-96fb-fe32203d5c85",
    "jsonFile": JSON.stringify(jsonInstagram),
    "trigger": "Trigger " + enviroment[typeEnv].Channel.Instagram.name
  },
  {
    "id": "bec400ae-095f-4071-a7b5-06a9248029ef",
    "jsonFile": JSON.stringify(jsonWhatsApp),
    "trigger": "Trigger " + enviroment[typeEnv].Channel.WhatsApp.name
  },
  {
    "id": "de064b9b-77cf-4df4-874f-470c87c4a5f3",
    "jsonFile": JSON.stringify(jsonFeedback),
    "trigger": "Trigger Test"
  },
  {
    "id": "0405a574-7a6f-4813-b557-1275d910ab4b",
    "jsonFile": JSON.stringify(jsonPruebas),
    "trigger": "Trigger Pruebas"
  }
];

const dataAgent = {
  "id": "7f8d4ddf-d928-4fdf-96f7-081876e0f730",
  "type": constants.agents.types.AGENT,
  "idExternal": 3365,
  "password": "root",
  "phone": "+56987654321",
  "email": "jlobos+agent@jumpitt.com",
  "age": 30,
  "status": constants.agents.status.ENABLED,
  "isConnected": false,
  "rut": "11111111-1",
  "gender": "Hombre",
  "firstName": "Ricardo",
  "lastName": "Agente",
  "initials": "RA",
  "avatarColor": "#FF7875",
};

const dataAdmin = {
  "id": "e0adb285-41ab-4279-b073-ab0055d6816a",
  "type": constants.agents.types.ADMIN,
  "idExternal": 3364,
  "password": "root",
  "phone": "+56987654321",
  "email": "jlobos+admin@jumpitt.com",
  "age": 60,
  "status": constants.agents.status.ENABLED,
  "isConnected": false,
  "rut": "22222222-2",
  "gender": "Hombre",
  "firstName": "Javier",
  "lastName": "Administrador",
  "initials": "JA",
  "avatarColor": "#FF7875",
};

const dataBot = {
  "id": "36736f09-a4a6-4e45-9397-c011504ff1d6",
  "type": constants.agents.types.BOT,
  "password": "bot",
  "phone": "",
  "email": "Correo_Bot@Mail.com",
  "age": 0,
  "status": constants.agents.status.ENABLED,
  "isConnected": false,
  "rut": "",
  "gender": "Indefinido",
  "firstName": "Bot",
  "lastName": "LastName",
  "initials": "B",
  "avatarColor": "#FFD666",
};

const notes = [
  {
    idAuthor: dataAgent.id,
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lectus eros, pellentesque a laoreet vel, semper eget mi. Proin suscipit vitae sem sit amet tincidunt. Nulla et turpis non odio efficitur gravida. Sed interdum egestas viverra. Integer fusce.",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lectus eros, pellentesque a laoreet vel, semper eget mi. Proin suscipit vitae sem sit amet tincidunt. Nulla et turpis non odio efficitur gravida. Sed interdum egestas viverra. Integer fusce."
  },
];

const dataClients = [
  {
    "id": "21b7e31c-4337-4f6a-8759-fdbd94841974",
    "userIdChannel": enviroment[typeEnv].userIdChannel.Lucas.Facebook,
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.FACEBOOK,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Raúl",
    "lastName": "Johnson " + constants.channel.type.FACEBOOK,
    "initials": "RJ",
    "avatarColor": "#95DE64",
    "phone": "+" + enviroment[typeEnv].userIdChannel.Lucas.WhatsApp,
    "email": "rjohnson@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "ad87be50-4726-4b25-884b-46e37e6bb163",
    "userIdChannel": enviroment[typeEnv].userIdChannel.Nicolas.Instagram,
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.INSTAGRAM,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Nicolas",
    "lastName": "Instagram",
    "initials": "NI",
    "avatarColor": "#95DE64",
    "phone": "+" + enviroment[typeEnv].userIdChannel.Nicolas.WhatsApp,
    "email": "ninstagram@gmail.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "38541fc7-fd7c-4f49-b8e3-fcd720f989d4",
    "userIdChannel": enviroment[typeEnv].userIdChannel.Ismael.Facebook,
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.FACEBOOK,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Ismael",
    "lastName": "Álvarez " + constants.channel.type.FACEBOOK,
    "initials": "IA",
    "avatarColor": "#FFD666",
    "phone": "+56923411054",
    "email": "ialvarez@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "7e7f332e-8247-42cc-86ac-71e7d28c5b4c",
    "userIdChannel": enviroment[typeEnv].userIdChannel.Camilo.Facebook,
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.FACEBOOK,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Camilo",
    "lastName": "Salazar " + constants.channel.type.FACEBOOK,
    "initials": "CS",
    "avatarColor": "#85A5FF",
    "phone": "+56999120244",
    "email": "csalazar@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "1ab06af6-8785-11ed-a1eb-0242ac120002",
    "userIdChannel": enviroment[typeEnv].userIdChannel.Carolina.Facebook,
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.FACEBOOK,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Carolina",
    "lastName": "Torres " + constants.channel.type.FACEBOOK,
    "initials": "CT",
    "avatarColor": "#FFD666",
    "phone": "+56999056682",
    "email": "ctorres@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "cad35b0e-f6e5-4dee-83ec-c7b0830c97e9",
    "userIdChannel": "a9db-18d8-44a0",
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WEBCHAT,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Nicolás",
    "lastName": "Toledo",
    "initials": "NT",
    "avatarColor": "#FF85C0",
    "phone": "+56977210093",
    "email": "ntoledo@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "e91d770c-3851-4f4a-b00a-573a34ef6c2f",
    "userIdChannel": "2c5f-5883-2cd9",
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WEBCHAT,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Valeria",
    "lastName": "Muñoz",
    "initials": "VM",
    "avatarColor": "#FF7875",
    "phone": "+56998812662",
    "email": "valeriam@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "da093b99-0c90-4a7a-8ac4-8772d84a389c",
    "userIdChannel": "b7c9-aec6-8346",
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WEBCHAT,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Prisila",
    "lastName": "Jara",
    "initials": "PJ",
    "avatarColor": "#FF9C6E",
    "phone": "+56981239954",
    "email": "pjara@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "c37b14e7-673e-4c62-b53a-a746578747f8",
    "userIdChannel": "ff5e-3510-42d9",
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WEBCHAT,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Tamara",
    "lastName": "Castro",
    "initials": "TC",
    "avatarColor": "#FF85C0",
    "phone": "+56977620912",
    "email": "tcastro@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "5e7fe47b-ad01-4d65-8dbe-0329ff6f509f",
    "userIdChannel": "cb2b-639c-b2a1",
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WEBCHAT,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Benjamín",
    "lastName": "Guerrero",
    "initials": "BG",
    "avatarColor": "#FFD666",
    "phone": "+56988720055",
    "email": "bguerrero@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "5c3d3ba3-6d7d-4914-8afd-20a8da32caac",
    "userIdChannel": "f8c0-7c8b-9273",
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WEBCHAT,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Patricio",
    "lastName": "Ávalos",
    "initials": "PA",
    "avatarColor": "#5CDBD3",
    "phone": "+56990102323",
    "email": "pavalos@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "1a2a4948-421b-44ae-856a-8450340f0303",
    "userIdChannel": "3291-8ae6-f42d",
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WEBCHAT,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Joaquín",
    "lastName": "Olmos",
    "initials": "JO",
    "avatarColor": "#95DE64",
    "phone": "+56965102893",
    "email": "jolmos@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "d4718ba9-1098-42c0-abc1-753b7a3cf826",
    "userIdChannel": "7913-b540-2f73",
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WEBCHAT,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Javier",
    "lastName": "Pérez",
    "initials": "JP",
    "avatarColor": "#B37FEB",
    "phone": "+56944670182",
    "email": "jperez@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "0e7db2cb-3d5e-45bb-9120-265e0c49d1f3",
    "userIdChannel": "cdb0-0bd8-2596",
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WEBCHAT,
    "state": constants.client.state.AVAILABLE,
    "firstName": "José",
    "lastName": "Luis Vergara",
    "initials": "JL",
    "avatarColor": "#FF9C6E",
    "phone": "+56978780102",
    "email": "jlvergara@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "cde941df-e7b9-4a70-a871-5f32535fb5f5",
    "userIdChannel": "ca32-c48f-5cec",
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WEBCHAT,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Fernanda",
    "lastName": "Farías",
    "initials": "FF",
    "avatarColor": "#FF85C0",
    "phone": "+56989620023",
    "email": "ffarias@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "235938ad-2f6c-4514-82a4-5678b41c26e0",
    "userIdChannel": "270a-3157-5a29",
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WEBCHAT,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Juan",
    "lastName": "Zuñiga",
    "initials": "JZ",
    "avatarColor": "#FFF566",
    "phone": "+56987621827",
    "email": "jzuniga@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "8a187ce0-2c4f-4a1b-8022-3927d3d4aac5",
    "userIdChannel": "f1ba-8699-88ea",
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WEBCHAT,
    "state": constants.client.state.AVAILABLE,
    "firstName": "José",
    "lastName": "Martinez",
    "initials": "JM",
    "avatarColor": "#FF7875",
    "phone": "+56934998102",
    "email": "jmartinez@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "9b3b9a3f-6b6a-4986-a92b-d6606cf9ccb3",
    "userIdChannel": enviroment[typeEnv].userIdChannel.Ismael.WhatsApp,
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WHATSAPP,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Ismael",
    "lastName": "Álvarez " + constants.channel.type.WHATSAPP,
    "initials": "IA",
    "avatarColor": "#95DE64",
    "phone": "+" + enviroment[typeEnv].userIdChannel.Ismael.WhatsApp,
    "email": "ialvarezw@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "1624fe44-51d0-4cf6-9e7f-05971af83444",
    "userIdChannel": enviroment[typeEnv].userIdChannel.Lucas.WhatsApp,
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WHATSAPP,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Raúl",
    "lastName": "Johnson " + constants.channel.type.WHATSAPP,
    "initials": "RJ",
    "avatarColor": "#FFD666",
    "phone": "+" + enviroment[typeEnv].userIdChannel.Lucas.WhatsApp,
    "email": "rjohnson@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "c9e94447-71a0-437c-9095-a7d867e16dc5",
    "userIdChannel": enviroment[typeEnv].userIdChannel.Joaquin.WhatsApp,
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WHATSAPP,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Joaquin",
    "lastName": "Lobos " + constants.channel.type.WHATSAPP,
    "initials": "JL",
    "avatarColor": "#85A5FF",
    "phone": "+" + enviroment[typeEnv].userIdChannel.Joaquin.WhatsApp,
    "email": "jlobos@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "c27d067a-9479-45af-96fa-fd3a6d7786e8",
    "userIdChannel": enviroment[typeEnv].userIdChannel.Nicolas.WhatsApp,
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WHATSAPP,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Nicolás",
    "lastName": "Alfaro " + constants.channel.type.WHATSAPP,
    "initials": "NA",
    "avatarColor": "#FF7875",
    "phone": "+" + enviroment[typeEnv].userIdChannel.Nicolas.WhatsApp,
    "email": "nalfaro@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "482ba83b-cc88-440d-b55c-cceec9970e03",
    "userIdChannel": enviroment[typeEnv].userIdChannel.Carolina.WhatsApp,
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WHATSAPP,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Carolina",
    "lastName": "Torres " + constants.channel.type.WHATSAPP,
    "initials": "CT",
    "avatarColor": "#FF7875",
    "phone": "+" + enviroment[typeEnv].userIdChannel.Carolina.WhatsApp,
    "email": "carolinat@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "edfae349-953c-46c7-af43-ec7551a9a9bc",
    "userIdChannel": enviroment[typeEnv].userIdChannel.Joaquin.Facebook,
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.FACEBOOK,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Joaquín",
    "lastName": "Lobos " + constants.channel.type.FACEBOOK,
    "initials": "JL",
    "avatarColor": "#FF7875",
    "phone": "+56984910472",
    "email": "joaquinl@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "052ddf17-3112-4124-9449-40c8bf696319",
    "userIdChannel": "0a0d-42fb-a559",
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.WEBCHAT,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Sujeto",
    "lastName": "Pruebas",
    "initials": "SP",
    "avatarColor": "#95DE64",
    "phone": "+56911112222",
    "email": "pruebas@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "84416500-1fa7-49a8-b82a-e8bd632a9676",
    "userIdChannel": "8906878152685500",
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.FACEBOOK,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Ismael",
    "lastName": "Alvarez " + constants.channel.type.FACEBOOK,
    "initials": "IA",
    "avatarColor": "#95DE64",
    "phone": "+56967896789",
    "email": "ismael@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  },
  {
    "id": "ffdb5ec0-1cf6-4f7f-bb92-9ab37c8d8ae0",
    "userIdChannel": enviroment[typeEnv].userIdChannel.Nicolas.Facebook,
    "type": constants.client.type.LOGGED,
    "channel": constants.channel.type.FACEBOOK,
    "state": constants.client.state.AVAILABLE,
    "firstName": "Nicolás",
    "lastName": "Alfaro " + constants.channel.type.FACEBOOK,
    "initials": "NA",
    "avatarColor": "#95DE64",
    "phone": "+56967896789",
    "email": "nicolas@example.com",
    "notes": {
      createMany: {
        data: notes,
      }
    }
  }
];

const dataChat = [
  { "id": "db19656b-ebdd-48c2-bc8d-d992ca32d72b", "idAgent": dataBot.id, "idClient": "21b7e31c-4337-4f6a-8759-fdbd94841974" },
  { "id": "b99839e1-827f-43ef-bada-74523f24ba40", "idAgent": dataAdmin.id, "idClient": "38541fc7-fd7c-4f49-b8e3-fcd720f989d4" },

  { "id": "282a3db5-048e-48cd-b190-4216ea95b4f6", "idAgent": dataAgent.id, "idClient": "7e7f332e-8247-42cc-86ac-71e7d28c5b4c" },

  { "id": "724035c6-8785-11ed-a1eb-0242ac120002", "idAgent": dataBot.id, "idClient": "1ab06af6-8785-11ed-a1eb-0242ac120002" },

  { "id": "2f51bd4b-1812-4ab3-a516-a08fe6221967", "idAgent": dataAgent.id, "idClient": "cad35b0e-f6e5-4dee-83ec-c7b0830c97e9" },

  { "id": "9d39b3c4-e819-4070-ba8a-4d91b2b202a1", "idAgent": dataBot.id, "idClient": "e91d770c-3851-4f4a-b00a-573a34ef6c2f" },
  { "id": "42e7dc79-2106-462f-8498-80a8dbb8fd19", "idAgent": dataBot.id, "idClient": "da093b99-0c90-4a7a-8ac4-8772d84a389c" },
  { "id": "879e12ec-9147-4608-9217-db6adcdff696", "idAgent": dataBot.id, "idClient": "c37b14e7-673e-4c62-b53a-a746578747f8" },
  { "id": "170058ef-ba22-4787-98f1-1e8949336761", "idAgent": dataBot.id, "idClient": "5e7fe47b-ad01-4d65-8dbe-0329ff6f509f" },
  { "id": "e25f1c68-c9f4-4515-b8bb-a9a338be9327", "idAgent": dataBot.id, "idClient": "5c3d3ba3-6d7d-4914-8afd-20a8da32caac" },
  { "id": "36d7725e-840c-48b4-a6f8-1210bf643565", "idAgent": dataBot.id, "idClient": "1a2a4948-421b-44ae-856a-8450340f0303" },
  { "id": "c3e4fdc6-c9c2-42cb-908b-daf1f350047a", "idAgent": dataBot.id, "idClient": "d4718ba9-1098-42c0-abc1-753b7a3cf826" },
  { "id": "d7bfe429-f87f-4bac-89a8-2b0ade333cc9", "idAgent": dataBot.id, "idClient": "0e7db2cb-3d5e-45bb-9120-265e0c49d1f3" },
  { "id": "356f3fbe-5944-4e3e-97a0-a164092a0977", "idAgent": dataBot.id, "idClient": "cde941df-e7b9-4a70-a871-5f32535fb5f5" },
  { "id": "7a0b45a6-64c6-4302-bf60-1028637f9a02", "idAgent": dataBot.id, "idClient": "235938ad-2f6c-4514-82a4-5678b41c26e0" },
  { "id": "d77536c2-0cd9-4740-9e45-7321a17bcaf6", "idAgent": dataBot.id, "idClient": "8a187ce0-2c4f-4a1b-8022-3927d3d4aac5" },
  { "id": "20a4a17f-b584-4046-90b5-d8d6aaba449b", "idAgent": dataBot.id, "idClient": "9b3b9a3f-6b6a-4986-a92b-d6606cf9ccb3" },
  { "id": "f6f00300-32a0-4070-8b8e-0be2aebbd74c", "idAgent": dataBot.id, "idClient": "1624fe44-51d0-4cf6-9e7f-05971af83444" },
  { "id": "19e0f8a2-f980-4d78-8239-f95ca69dea0e", "idAgent": dataBot.id, "idClient": "c9e94447-71a0-437c-9095-a7d867e16dc5" },
  { "id": "d494ff45-574b-4258-a9ea-8445be180c63", "idAgent": dataBot.id, "idClient": "c27d067a-9479-45af-96fa-fd3a6d7786e8" },
  { "id": "c5d78c62-a5d5-4d73-acf0-5c3d4412f4b2", "idAgent": dataBot.id, "idClient": "482ba83b-cc88-440d-b55c-cceec9970e03" },
  { "id": "64c48ec1-f5a9-4fad-9da1-a6ab9cb5e298", "idAgent": dataBot.id, "idClient": "edfae349-953c-46c7-af43-ec7551a9a9bc" },
  { "id": "063fdff2-011b-414b-a680-a268419f617f", "idAgent": dataBot.id, "idClient": "052ddf17-3112-4124-9449-40c8bf696319" },
  { "id": "0b5f363f-4587-4e3b-ad06-0817e886c02c", "idAgent": dataBot.id, "idClient": "84416500-1fa7-49a8-b82a-e8bd632a9676" },
  { "id": "7db71ee7-52f9-41a3-9973-a43ec3c1574e", "idAgent": dataBot.id, "idClient": "ffdb5ec0-1cf6-4f7f-bb92-9ab37c8d8ae0" },
  { "id": "2e8b18f5-1824-4ee2-bbeb-be11b831d247", "idAgent": dataBot.id, "idClient": "ad87be50-4726-4b25-884b-46e37e6bb163" },
]
const dataCategoriesWithTemplate = [
  {
    "name": "Sin categoría",
    "color": "#FF7875",
    "templates": []
  },
  {
    "name": "Horarios de Atención",
    "color": "#B37FEb",
    "templates": [
      {
        "title": "Horarios activos",
        "description": "Muchas gracias por contactarnos. Nuestro horario de atención es de 9:00 a 19:00 hrs. Si tienes alguna pregunta o duda, puedes dejarnos un mensaje, y te responderemos pronto."
      },
      {
        "title": "Horarios inactivos",
        "description": "Te responderemos dentro de los días laborables de 9:00 a 19:00 hrs. Con mucho gusto te atenderemos. No olvides dejarnos tu mensaje."
      }
    ]
  },
  {
    "name": "Atención al Cliente",
    "color": "#FFF566",
    "templates": [
      {
        "title": "Confirmación del pedido",
        "description": "Muchas gracias por comprar tu notebook Lenovo desde nuestro sitio web. Te mantendremos informado sobre el día y hora de la entrega de tu producto"
      },
      {
        "title": "Pedido en tránsito",
        "description": "Muchas gracias por confiar en Lenovo. Tu pedido está en camino"
      },
      {
        "title": "Pedido recibido",
        "description": "Tu pedido ha sido entregado. Gracias por confíar en Lenovo"
      }
    ]
  },
  {
    "name": "Soporte Técnico",
    "color": "#95DE64",
    "templates": [
      {
        "title": "Problemas en la plataforma",
        "description": "Estimado cliente, disculpe las molestias. Estamos al tanto de los problemas que está presentando nuestro sistema, estamos trabajando para solucionarlo lo más pronto posible."
      }
    ]
  },
];

const dataTicketStatus = [
  { "id": "bfbf30e6-3e3b-4349-b015-b0851511e15a", "name": "Abierto" },
  { "id": "a7c89769-c99e-4951-84e7-7b8b8f97c814", "name": "En Espera" },
  { "id": "1a32d631-95f6-421d-b327-26153d3d67bd", "name": "Pendiente Usuario" },
  { "id": "5a6fce5b-7d13-4a77-b21b-398a957f5ac9", "name": "Caducado Agente" },
  { "id": "e7a6e2c5-28d1-4c12-8bfe-1a5150aae684", "name": "Caducado Usuario" },
  { "id": "b5ed385c-40a4-4a6e-8dfa-6610cdb0ef88", "name": "Resuelto" },
  { "id": "b2ec48c2-0ec8-4238-a1db-aae34ddbcaa4", "name": "Reasignado" },
  { "id": "7163f752-cedf-4c42-8376-0c989fab5cd4", "name": "Nuevo" },
  { "id": "1a482515-25ab-40b2-ae37-7ef5a78ee3b4", "name": "Bloqueado" }
];

const dataTicketPriority = [
  { "id": "002ce380-b316-4c93-a3b3-9bd7dddde360", "name": "Alta", "weight": 3 },
  { "id": "c8bfc815-8286-4ae1-9ae3-11385ef301dc", "name": "Media", "weight": 2 },
  { "id": "acfe7ee1-054a-437b-9276-dd306d7e0081", "name": "Baja", "weight": 1 },
  { "id": "b5d2a3a6-dae1-4cbe-b0d0-f8693b6da765", "name": "Sin prioridad", "weight": 0 }
];

const dataTicketCategory = [
  { "id": "be8fb1df-6350-49c6-80fd-c4177f3797ec", "name": "Consulta General" },
  { "id": "e04eb153-dc44-4cf0-9d9a-2d310cbefb32", "name": "Soporte Técnico" },
  { "id": "89349577-fa9d-4f78-9d93-79132f76ab33", "name": "Reportar Incidencia" },
  { "id": "ff51c01d-18d0-4f8a-a4a2-6858a183ac9b", "name": "Reclamo" },
  { "id": "f6615451-4dd1-44b1-b5da-2374ee50b80d", "name": "Sin categoría" },
  { "id": "03931191-8c93-4938-ae98-0d3a6e606384", "name": "Felicitaciones" }
];

const dataOutboundCampaign = {
  "id": "3d085110-ba56-4b97-ae57-af76d5f599bd",
  "idNode": "campaignFirst",
  "name": "Campaign First",
  "startDate": "2023-02-15 00:00:00.000",
  "endDate": "2023-12-31 00:00:00.000"
}

const dataPlan = [
  {
    "id": "b5d2a3a6-dae1-4cbe-b0d0-f8693b6da765",
    "name": "Starter",
    "price": 30,
    "canUseWhatsApp": false,
    "canUseFacebook": false,
    "canUseWebchat": true,
    "maxNConversations": 4000,
    "canRemoveBubbleLogo": false,
    "canUseSchedule": false,
    "canUseSurvey": false,
    "canUseAutoResponse": false,
    "canUseChatgpt": false,
    "maxNAgents": 4,
    "maxNAdmins": 1,
    "canUseDashboard": true,
    "canUseTemplate": false,
    "canUseContactManagement": false,
    "canUseChatHistory": true,
    "canUseOutboundWhatsApp": false,
    "canUseBeAware": false,
  },
  {
    "id": "002ce380-b316-4c93-a3b3-9bd7dddde360",
    "name": "Avanzado",
    "price": 100,
    "canUseWhatsApp": false,
    "canUseFacebook": true,
    "canUseWebchat": true,
    "maxNConversations": 4000,
    "canRemoveBubbleLogo": false,
    "canUseSchedule": false,
    "canUseSurvey": false,
    "canUseAutoResponse": false,
    "canUseChatgpt": true,
    "maxNAgents": 4,
    "maxNAdmins": 1,
    "canUseDashboard": true,
    "canUseTemplate": false,
    "canUseContactManagement": true,
    "canUseChatHistory": true,
    "canUseOutboundWhatsApp": false,
    "canUseBeAware": false,
  },
  {
    "id": "c8bfc815-8286-4ae1-9ae3-11385ef301dc",
    "name": "Corporativo",
    "price": 200,
    "canUseWhatsApp": true,
    "canUseFacebook": true,
    "canUseWebchat": true,
    "maxNConversations": 10000,
    "canRemoveBubbleLogo": true,
    "canUseSchedule": true,
    "canUseSurvey": false,
    "canUseAutoResponse": false,
    "canUseChatgpt": true,
    "maxNAgents": 10,
    "maxNAdmins": 2,
    "canUseDashboard": true,
    "canUseTemplate": true,
    "canUseContactManagement": true,
    "canUseChatHistory": true,
    "canUseOutboundWhatsApp": false,
    "canUseBeAware": false,
  },
  {
    "id": "acfe7ee1-054a-437b-9276-dd306d7e0081",
    "name": "Conversable",
    "price": 0,
    "canUseWhatsApp": true,
    "canUseFacebook": true,
    "canUseWebchat": true,
    "maxNConversations": 0,
    "canRemoveBubbleLogo": true,
    "canUseSchedule": true,
    "canUseSurvey": true,
    "canUseAutoResponse": true,
    "canUseChatgpt": true,
    "maxNAgents": 0,
    "maxNAdmins": 0,
    "canUseDashboard": true,
    "canUseTemplate": true,
    "canUseContactManagement": true,
    "canUseChatHistory": true,
    "canUseOutboundWhatsApp": true,
    "canUseBeAware": true,
  }
];

const dataAutomaticResponseType = [
  // {
  //   id: "bf0a7240-5dd1-419c-8a63-33c0c0318641",
  //   title: "Mensaje cuando el cliente habla fuera del horario de servicio",
  // },
  {
    id: "7c4d4dbb-9838-4d61-a3a0-99e7791904e9",
    title: "Mensaje cuando no hay agentes disponibles para atender",
  },
  {
    id: "cfe052a6-d756-4fa5-befa-549ce8c4f18c",
    title: "Mensaje cuando el tiempo de espera está caducado",
  },
];

const dataAutomaticResponse = [
  // {
  //   idAutomaticResponseType: "bf0a7240-5dd1-419c-8a63-33c0c0318641",
  //   message: "Hola, gracias por escribirnos. Nuestro horario de atención es de lunes a viernes de 8:00 a 18:00 horas. Te responderemos a la brevedad.",
  //   isActive: true,
  // },
  {
    idAutomaticResponseType: "7c4d4dbb-9838-4d61-a3a0-99e7791904e9",
    message: "Hola, gracias por escribirnos. En este momento no contamos con agentes disponibles para atender tu solicitud. Te responderemos a la brevedad.",
    isActive: true,
  },
  {
    idAutomaticResponseType: "cfe052a6-d756-4fa5-befa-549ce8c4f18c",
    message: "Hola, la conversación ha caducado. Favor vuelva a escribirnos.",
    isActive: true,
  },
];

const dataPlanConfigBase = {
  "isActive": true,
  "name": "Conversable",
  "price": 100,
  "channelWhatsApp": true,
  "channelFacebook": true,
  "channelWebchat": true,
  "nConversations": 4000,
  "removeBubbleLogo": true,
  "attentionSchedule": true,
  "satisfactionSurvey": true,
  "automaticResponse": true,
  "chatgpt": true,
  "nAgents": 4,
  "nAdmins": 1,
  "isDashboard": true,
  "isTemplate": true,
  "isContactManagement": true,
  "isChatHistory": true,
  "isOutboundWhatsApp": true,
  "isBeAware": true
}

const scheduleDaysAndRangesBase = {
  scheduleDays: [
    {
      weekDay: 1,
      isActive: true,
      scheduleRanges: [
        {
          startTime: "00:00",
          endTime: "23:59",
        },
      ],
    },
    {
      weekDay: 2,
      isActive: true,
      scheduleRanges: [
        {
          startTime: "00:00",
          endTime: "23:59",
        },
      ],
    },
    {
      weekDay: 3,
      isActive: true,
      scheduleRanges: [
        {
          startTime: "00:00",
          endTime: "23:59",
        },
      ],
    },
    {
      weekDay: 4,
      isActive: true,
      scheduleRanges: [
        {
          startTime: "00:00",
          endTime: "23:59",
        },
      ],
    },
    {
      weekDay: 5,
      isActive: true,
      scheduleRanges: [
        {
          startTime: "00:00",
          endTime: "23:59",
        },
      ],
    },
    {
      weekDay: 6,
      isActive: true,
      scheduleRanges: [
        {
          startTime: "00:00",
          endTime: "23:59",
        },
      ],
    },
    {
      weekDay: 7,
      isActive: true,
      scheduleRanges: [
        {
          startTime: "00:00",
          endTime: "23:59",
        },
      ],
    },
  ],
};

//==================================================================================================
let channelArray = [];
let companyBase;
let agentBase;
let botBase;

async function main() {
  console.log("\n> 🌱 Start seeding 🌱");

  console.log("\n> 📣 Creating 'Plan'");
  await createPlan()

  console.log("\n> 🏢 Creating 'Company' (with 'Channel', 'EnvVar' and 'Flow')");
  await createCompanies();

  console.log("\n> 🏢 Creating 'Automatic Response'");
  await createAutomaticResponse();

  console.log("\n> 📣 Creating 'Plan Config Base'");
  await createPlanConfig();

  console.log("\n> 🏢 Creating 'Areas'");
  await createAreas();

  console.log("\n> 💬 Creating 'Template' (with 'Category')");
  await createTemplates();

  console.log("\n> 👨 Creating 'Agent'");
  await createAgents();

  console.log("\n> 💬 Creating 'ScheduleDaysAndRanges'");
  await createScheduleDaysAndRanges();

  console.log("\n> 🤖 Creating 'Bot'");
  await createBots();

  console.log("\n> 👤 Creating 'Client'");
  await createClients();

  console.log("\n> 🗨️  Creating 'Chat'");
  await createChats();

  console.log("\n> 🔠 Creating 'Ticket Category'");
  await createTicketsModel("Category");

  console.log("\n> ⬆️  Creating 'Ticket Priority'");
  await createTicketsModel("Priority");

  console.log("\n> ℹ️  Creating 'Ticket Status'");
  await createTicketsModel("Status");

  console.log("\n> 📣 Creating 'Outbound Campaign'");
  await createOutboundCampaign()

  console.log("\n> 🌳 Seeding finished 🌳\n");

  if (showData) {
    console.log("\n\n==================================================\n\n");
    await printData();
    console.log("\n\n==================================================\n\n");
  }
}

const createPlan = async () => {
  try {
    const planPromises = dataPlan.map(async (itemPlan) => {
      let plan = await prisma.plan.create({ "data": itemPlan });
      console.log("  > ✅ 'Plan' created / " + plan.name);
      return plan;
    });
    await Promise.all(planPromises);
  } catch (error) {
    console.error("Error creating chats:", error);
  }
}

async function createCompanies() {
  for (index in dataCompany) {
    let company = await prisma.company.create({ "data": dataCompany[index] });
    if (index == 0) companyBase = company;
    console.log("  > ✅ 'Company' created / " + company.name);
  };

  for (index in dataChannel) {
    let channel = await prisma.channel.create({ "data": dataChannel[index] });
    channelArray.push(channel);

    dataFlow[index]["channels"] = {
      "create": [{
        "channel": {
          "connect": { "id": channel.id }
        }
      }]
    };
    await prisma.flow.create({ "data": dataFlow[index] });
    console.log("  > ✅ 'Channel' created / " + channel.name);
  }

  for (let itemEnvVar of dataEnvVar) {
    await prisma.env_var.create({ "data": itemEnvVar });
    console.log("  > ✅ 'EnvVar' created / " + itemEnvVar.type);
  }
}

async function createAutomaticResponse() {
  for (let automaticResponseType of dataAutomaticResponseType) {
    await prisma.automatic_response_type.create({ "data": automaticResponseType });
  }
  const companies = await prisma.company.findMany({});
  for (let company of companies) {
    for (let automaticResponseItem of dataAutomaticResponse) {
      automaticResponseItem.idCompany = company.id;
      await prisma.automatic_response.create({ "data": automaticResponseItem });
    }
  }
}

const createPlanConfig = async () => {
  try {
    const planConfig = await prisma.plan_config.create({
      "data": {
        ...dataPlanConfigBase,
        idPlan: dataPlan.filter(item => item.name == 'Conversable')[0].id,
        idCompany: companyBase.id
      }
    });
    console.log("  > ✅ 'Plan Config' created / " + planConfig.name);
    await prisma.plan_summary.create({
      "data": {
        idPlanConfig: planConfig.id,
      }
    });
  } catch (error) {
    console.error("Error creating chats:", error);
  }
};

async function createTemplates() {
  for (itemCategory of dataCategoriesWithTemplate) {
    let templates = itemCategory["templates"];
    delete itemCategory["templates"];

    itemCategory["idCompany"] = companyBase.id;
    let category = await prisma.category.create({ "data": itemCategory });

    for (itemTemplate of templates) {
      itemTemplate["idCategory"] = category.id;
      let template = await prisma.template.create({ "data": itemTemplate });
      console.log("  > ✅ 'Template' created / " + template.title);
    }
  }
}

async function createAreas() {
  const companies = await prisma.company.findMany({});
  for (let company of companies) {
    const area = {
      name: constants.areas.name.NO_AREA,
      idCompany: company.id,
    };

    if (company.id === companyBase.id) {
      area.id = "ecf08c4d-38e1-4ee1-894c-04bfab1ab8cf";
    }

    await prisma.area.create({ data: area });
    console.log("  > ✅ 'Area' created / " + area.name);
  }
}

async function createAgents() {
  const area = await prisma.area.findFirst({ where: { company: { id: companyBase.id } } });
  agentBase = await prisma.agent.create({
    data: {
      ...dataAgent,
      areas: {
        create: [{ area: { connect: { id: area.id } } }],
      }
    }
  });
  adminBase = await prisma.agent.create({
    data: {
      ...dataAdmin,
      areas: {
        create: [{ area: { connect: { id: area.id } } }],
      }
    }
  });
  console.log("  > ✅ 'Agent' created / " + agentBase.firstName);
}

const createScheduleDaysAndRanges = async () => {
  try {
    const promisesAgent = scheduleDaysAndRangesBase.scheduleDays.map(
      (scheduleDayData) =>
        prisma.schedule_day.create({
          data: {
            idAgent: agentBase.id,
            weekDay: scheduleDayData.weekDay,
            isActive: scheduleDayData.isActive,
            scheduleRanges: {
              create: scheduleDayData.scheduleRanges.map((range) => ({
                startTime: new Date(`1970-01-01T${range.startTime}:00`),
                endTime: new Date(`1970-01-01T${range.endTime}:00`),
              })),
            },
          },
        })
    );

    const scheduleDaysAgent = await Promise.all(promisesAgent);

    console.log(
      "Creados schedule_days: ",
      scheduleDaysAgent.map((d) => d.id)
    );

    const promisesAdmin = scheduleDaysAndRangesBase.scheduleDays.map(
      (scheduleDayData) =>
        prisma.schedule_day.create({
          data: {
            idAgent: adminBase.id,
            weekDay: scheduleDayData.weekDay,
            isActive: scheduleDayData.isActive,
            scheduleRanges: {
              create: scheduleDayData.scheduleRanges.map((range) => ({
                startTime: new Date(`1970-01-01T${range.startTime}:00`),
                endTime: new Date(`1970-01-01T${range.endTime}:00`),
              })),
            },
          },
        })
    );

    const scheduleDaysAdmin = await Promise.all(promisesAdmin);

    console.log(
      "Creados schedule_days: ",
      scheduleDaysAdmin.map((d) => d.id)
    );
  } catch (error) {
    console.error("Error creating schedule days and ranges:", error);
  }
};

async function createBots() {
  const area = await prisma.area.findFirst({ where: { company: { id: companyBase.id } } });
  botBase = await prisma.agent.create({
    data: {
      ...dataBot,
      areas: {
        create: [{ area: { connect: { id: area.id } } }],
      }
    }
  });
  console.log("  > ✅ 'Bot' created / " + botBase.firstName);
}

async function createClients() {
  for (itemClient of dataClients) {
    let clientChannel = channelArray.find((itemChannel) => itemChannel.type == itemClient.channel);

    itemClient["idChannel"] = clientChannel.id;
    delete itemClient["channel"];
    let client = await prisma.client.create({ "data": itemClient });

    let clientFlowStep = { "idClient": client.id, "status": null, "failsCount": 0, "flow": "main", "previousFlow": null, "answers": {}, "answersApi": {} }
    await prisma.client_flow_step.create({ "data": clientFlowStep })

    console.log("  > ✅ 'Client' created / " + client.firstName);
  }
}

async function createChats() {
  for (itemChat of dataChat) {
    let chat = await prisma.chat.create({ "data": itemChat });
    console.log("  > ✅ 'Chat' created / " + chat.idAgent + " & " + chat.idClient);
  }
}

async function createTicketsModel(type) {
  let tickets;
  let ticket;

  if (type == "Category") {
    tickets = dataTicketCategory;
  } else if (type == "Priority") {
    tickets = dataTicketPriority
  } else if (type == "Status") {
    tickets = dataTicketStatus;
  }

  for (itemTicket of tickets) {
    itemTicket["idCompany"] = companyBase.id;
    if (type == "Category") {
      ticket = await prisma.ticket_category.create({ "data": itemTicket });
    } else if (type == "Priority") {
      ticket = await prisma.ticket_priority.create({ "data": itemTicket });
    } else if (type == "Status") {
      ticket = await prisma.ticket_status.create({ "data": itemTicket });
    }

    console.log("  > ✅ 'Ticket " + type + "' created / " + ticket.name);
  }
}

async function createOutboundCampaign() {
  dataOutboundCampaign.startDate = new Date(dataOutboundCampaign.startDate);
  dataOutboundCampaign.endDate = new Date(dataOutboundCampaign.endDate);
  const outboundCampaign = await prisma.outbound_campaign.create({ "data": dataOutboundCampaign });

  console.log("  > ✅ 'Outbound Campaign' created / " + outboundCampaign.name);
}


async function printData() {
  let agent = await prisma.agent.findFirst({ "where": { "type": "Admin" } });
  console.log("  const userAgent = \"" + agent.id + "\";");

  let bot = await prisma.agent.findFirst({ "where": { "type": "Bot" } });
  console.log("  const userBot = \"" + bot.id + "\";");

  let clients = await prisma.client.findMany();
  console.log("  const users = [");
  for (client of clients) {
    console.log("    { \"id\": \"" + client.id + "\", \"userIdChannel\": \"" + client.userIdChannel + "\" },");
  }
  console.log("  ];");

  let chats = await prisma.chat.findMany();
  console.log("  const chats = [");
  for (chat of chats) {
    console.log("    { \"id\": \"" + chat.id + "\", \"idAgent\": \"" + chat.idAgent + "\", \"idClient\": \"" + chat.idClient + "\" },");
  }
  console.log("  ];");

  let ticketsCategory = await prisma.ticket_category.findMany();
  console.log("  const ticketsCategory = [");
  for (ticketCategory of ticketsCategory) {
    console.log("    { \"id\": \"" + ticketCategory.id + "\", \"name\": \"" + ticketCategory.name + "\" },");
  }
  console.log("  ];");

  let ticketsPriority = await prisma.ticket_priority.findMany();
  console.log("  const ticketsPriority = [");
  for (ticketPriority of ticketsPriority) {
    console.log("    { \"id\": \"" + ticketPriority.id + "\", \"name\": \"" + ticketPriority.name + "\" },");
  }
  console.log("  ];");

  let ticketsStatus = await prisma.ticket_status.findMany();
  console.log("  const ticketsStatus = [");
  for (ticketStatus of ticketsStatus) {
    console.log("    { \"id\": \"" + ticketStatus.id + "\", \"name\": \"" + ticketStatus.name + "\" },");
  }
  console.log("  ];");

  let plans = await prisma.plan.findMany();
  console.log("  const plans = [");
  plans.forEach(plan => {
    console.log(`    { "id": "${plan.id}", "name": "${plan.name}" },`);
  });
  console.log("  ];");
}


main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
