import {MongoDataSourceExtended} from "./datasources/common";

const usersModel = require("eh_auth_and_auth/models/user");

export default () => ({
    users: new MongoDataSourceExtended(usersModel),
});
