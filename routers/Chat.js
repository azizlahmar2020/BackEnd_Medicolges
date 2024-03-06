const express = require('express');
const router = express.Router();
const ConversationModel = require('../models/Conversation');
const MessageModel = require('../models/Message');

module.exports = function (io) {
    router.get('/getExistingRoom/:emitterId/:receiverId', async (req, res) => {
        const emitterId = req.params.emitterId;
        const receiverId = req.params.receiverId;

        try {
            const existingRoom = await ConversationModel.findOne({
                members: { $all: [emitterId, receiverId] }
            });

            if (existingRoom) {
                return res.json({ roomId: existingRoom._id });
            } else {
                return res.json({ roomId: null });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on("join_room", async ({ emitterId, receiverId }) => {
            const roomId = await getOrCreateRoom(emitterId, receiverId);

            socket.join(roomId);
            console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
        });

        socket.on("send_message", async (data) => {
            console.log("Received message data:", data);

            try {
                await saveMessage(data.room, data.author, data.message, data.image);
                io.to(data.room).emit("receive_message", data);
                console.log(`Message sent to room ${data.room} by ${data.author}`);
            } catch (error) {
                console.error("Error saving or sending message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log(`User Disconnected: ${socket.id}`);
        });
    });

    const saveMessage = async (roomId, author, message, image) => {
        try {
            await MessageModel.create({
                room: roomId,
                author: author,
                message: message,
                image: image,
                time: new Date().toLocaleTimeString(),
            });
        } catch (error) {
            console.error("Error saving message:", error);
        }
    };

    const getOrCreateRoom = async (emitterId, receiverId) => {
        const existingRoom = await ConversationModel.findOne({
            members: { $all: [emitterId, receiverId] }
        });
    
        if (existingRoom) {
            return existingRoom._id;
        } else {
            const newRoom = await ConversationModel.create({
                members: [emitterId, receiverId]
            });
            return newRoom._id;
        }
    };
    
    router.get('/getOrCreateRoom/:emitterId/:receiverId', async (req, res) => {
        const emitterId = req.params.emitterId;
        const receiverId = req.params.receiverId;
    
        try {
            const roomId = await getOrCreateRoom(emitterId, receiverId);
            res.json({ roomId });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.get('/getMessages/:room', async (req, res) => {
        const room = req.params.room;
        try {
            const messages = await MessageModel.find({ room });
            res.json(messages);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    return router;
};