import IMediaRecorder from "./IMediaRecorder";
import MediaSockServer from "../../MediaSockServer";
import { Socket } from "socket.io";
import ELCIELTSInternalError from "../../exception/ELCIELTSInternalError";
import configs from "../../config/configs";
import fs from "fs";

class FSMediaRecorder implements IMediaRecorder {
  private socketMap: Map<string, Socket>;
  private writeStreamMap: Map<string, fs.WriteStream>;
  private static instance: FSMediaRecorder = new FSMediaRecorder();
  private constructor() {
    this.socketMap = MediaSockServer.getSocketMap();
    this.writeStreamMap = new Map();
  }

  static getInstance(): FSMediaRecorder {
    return this.instance;
  }

  startRecording(userId: string, outputFile: string): void {
    const socket: Socket | undefined = this.socketMap.get(userId);
    if (socket) {
      const writeStream: fs.WriteStream = fs.createWriteStream(`${configs.mediaOutBasepath}/${outputFile}`, { flags: "a" });
      socket.on("audioChunk", (chunk) => {
        console.log("Writing audio data to file");
        console.log(chunk);
        writeStream.write(chunk);
      });
      this.writeStreamMap.set(userId, writeStream);
      return;
    }

    throw new ELCIELTSInternalError(`No socket avaialble or user is not connected to socket server for userId: ${userId}`);
  }
  stopRecording(userId: string): void {
    const writeStream: fs.WriteStream | undefined = this.writeStreamMap.get(userId);
    if (writeStream) {
      console.log("Write stream ending");
      writeStream.end();
      this.writeStreamMap.delete(userId);
      return;
    }
    throw new ELCIELTSInternalError(`No ffmpeg recording process initiated`);
  }
}

export default FSMediaRecorder;
