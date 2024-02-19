const isDevelopment = (): boolean => process.env.NODE_ENV !== "production";

import { Server } from "colyseus";
import http from "http";
import express from "express";
import path from "path";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import constants from "../common/constants";
import { ArenaRoom } from "./rooms/arena";

const app = express();
const port = Number(process.env.PORT || 8080);
const endpoint = "localhost";

const paths = {
    public: path.resolve(__dirname, "..", "public"),
    assets: path.resolve(__dirname, "..", "assets"),
    html: path.resolve(__dirname, "..", "public", 'index.html'),
};

const gameServer = new Server({ server: http.createServer(app) });

app.use(cookieParser());
app.use(express.json());

// on production, use ./public as static root
app.use("/", express.static(paths.public));

// on production, use ../assets as static root
app.use("/assets", express.static(paths.assets));

// on production, serve index html file on root
app.get('/', (_, res) => {
    res.sendFile(paths.html);
});

app.post('/login', (req, res) => {
    console.log('Incoming login request', req.body);
    const token = jwt.sign({ name: 'john' }, 'SECRET_SALT', { expiresIn: (60 * 60) * 6 });
    res.cookie('access-token', token, { secure: false, httpOnly: true });
    res.send({ success: true });
});

gameServer.define(constants.ROOM_NAME, ArenaRoom);
gameServer.listen(port);

console.log(`Listening on http://${endpoint}:${port}`);