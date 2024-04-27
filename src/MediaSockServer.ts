import { Server, Socket } from "socket.io";
import http from "http";

/*
 TODO - Implement the exception handling
*/
class MediaSockServer {
  private static socketMap: Map<string, Socket> = new Map();
  private sockIO: Server;
  constructor(server: http.Server) {
    // this.socketMap = new Map();
    this.sockIO = this.initialize(server);
  }
  private initialize(server: http.Server): Server {
    const sockIO: Server = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    sockIO.on("connection", (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;
      console.log(`New client connected: ${userId}`);

      MediaSockServer.socketMap.set(userId, socket);
      socket.on("disconnect", () => {
        MediaSockServer.socketMap.delete(userId);
      });
      socket.emit("ack");
    });
    return sockIO;
  }

  static getSocketMap(): Map<string, Socket> {
    return MediaSockServer.socketMap;
  }

  close(): void {
    this.sockIO.close();
    console.log(`Media Sock Server Closed`);
  }
}

export default MediaSockServer;
