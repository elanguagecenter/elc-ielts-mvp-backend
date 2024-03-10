import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import IMediaRecorder from "./IMediaRecorder";
import MediaSockServer from "../../MediaSockServer";
import { Socket } from "socket.io";
import ELCIELTSInternalError from "../../exception/ELCIELTSInternalError";
import configs from "../../config/configs";

class FFMpegMediaRecorder implements IMediaRecorder {
  private socketMap: Map<string, Socket>;
  private ffmpegProcessMap: Map<string, ChildProcessWithoutNullStreams>;
  private static instance: FFMpegMediaRecorder = new FFMpegMediaRecorder();
  private constructor() {
    this.socketMap = MediaSockServer.getInstance().getSocketMap();
    this.ffmpegProcessMap = new Map();
  }

  static getInstance(): FFMpegMediaRecorder {
    return this.instance;
  }

  startRecording(userId: string, outputFile: string): void {
    console.log("map");
    console.log(this.socketMap);
    const socket: Socket | undefined = this.socketMap.get(userId);
    if (socket) {
      const ffmpegProcess: ChildProcessWithoutNullStreams = spawn(configs.ffmpegPath, [
        "-f",
        "s16le",
        "-ar",
        "44100",
        "-ac",
        "2",
        "-i",
        "pipe:0",
        `${configs.mediaOutBasepath}/${outputFile}`,
      ]);

      ffmpegProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });

      ffmpegProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });

      socket.on("audioChunk", (chunk: Uint8Array) => {
        console.log("audioChunk came");
        console.log(chunk);
        ffmpegProcess.stdin.write(chunk);
      });
      this.ffmpegProcessMap.set(userId, ffmpegProcess);
      return;
    }

    throw new ELCIELTSInternalError(`No socket avaialble or user is not connected to socket server for userId: ${userId}`);
  }
  stopRecording(userId: string): void {
    const ffmpegProcess: ChildProcessWithoutNullStreams | undefined = this.ffmpegProcessMap.get(userId);
    if (ffmpegProcess) {
      ffmpegProcess.stdin.end();
      // ffmpegProcess.kill();
      this.ffmpegProcessMap.delete(userId);
      return;
    }
    throw new ELCIELTSInternalError(`No ffmpeg recording process initiated`);
  }
}

export default FFMpegMediaRecorder;
