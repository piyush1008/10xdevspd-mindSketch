import { WebSocket, WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaclient } from '@repo/db/prismaClient';

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }
    console.log(JSON.stringify(decoded))
    return decoded.userId;
  } catch(e) {
    return null;
  }
  return null;
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  if (userId == null) {
    ws.close()
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on('message', async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
    }

    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
      ws.send(JSON.stringify({
        message: "user joined the room"
      }))
    }

    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter(x => x === parsedData.room);
    }

    console.log("message received")
    console.log(parsedData);

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      try {
        // Verify user exists in database
        // const userExists = await prismaclient.user.findUnique({
        //   where: { id: userId }
        // });

        // if (!userExists) {
        //   ws.send(JSON.stringify({
        //     type: "error",
        //     message: "User not found"
        //   }));
        //   return;
        // }

        // // Verify room exists
        // const roomExists = await prismaclient.room.findUnique({
        //   where: { id: Number(roomId) }
        // });

        // if (!roomExists) {
        //   ws.send(JSON.stringify({
        //     type: "error",
        //     message: "Room not found"
        //   }));
        //   return;
        // }

        //this is not good approach , the ideal approach is to use queue
        await prismaclient.chat.create({
          data: {
            roomId: Number(roomId),
            message,
            userId
          }
        });

        users.forEach(user => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
              type: "chat",
              message: message,
              roomId
            }))
          }
        })
      } catch (error: any) {
        console.error("Error creating chat:", error);
        ws.send(JSON.stringify({
          type: "error",
          message: "Failed to send message"
        }));
      }
    }

  });

});

