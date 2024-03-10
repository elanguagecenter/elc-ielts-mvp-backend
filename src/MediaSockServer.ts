import { Server, Socket } from "socket.io";
import configs from "./config/configs";

/*
 TODO - Implement the exception handling
*/
class MediaSockServer {
  private socketMap: Map<string, Socket>;
  private sockIO: Server;
  private static instance: MediaSockServer = new MediaSockServer();
  constructor() {
    this.socketMap = new Map();
    this.sockIO = this.initialize();
  }
  private initialize(): Server {
    const sockIO: Server = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    sockIO.on("connection", (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;
      console.log(`New client connected: ${userId}`);

      this.socketMap.set(userId, socket);
      socket.on("disconnect", () => {
        this.socketMap.delete(userId);
      });
      socket.emit("ack");
    });
    return sockIO;
  }

  static getInstance(): MediaSockServer {
    return this.instance;
  }

  getSocketMap(): Map<string, Socket> {
    return this.socketMap;
  }

  start(): void {
    this.sockIO.listen(Number(configs.mediaSockPort));
    console.log(`Media Sock Server started on PORT: ${configs.mediaSockPort}`);
  }

  close(): void {
    this.sockIO.close();
    console.log(`Media Sock Server Closed`);
  }
}

export default MediaSockServer;
