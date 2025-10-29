"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwtTokenGenaretor_1 = require("../../helpers/jwtTokenGenaretor");
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized.");
            }
            const verifiedUser = jwtTokenGenaretor_1.jwtHelpers.verifyToken(token, config_1.default.jwt.jwt_secret);
            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized.");
            }
            req.user = verifiedUser;
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.default = auth;
