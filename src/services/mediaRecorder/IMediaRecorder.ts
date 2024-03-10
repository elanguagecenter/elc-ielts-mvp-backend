import { ChildProcess } from "child_process";

interface IMediaRecorder {
  startRecording(userId: string, outputFile: string): void;
  stopRecording(userId: string): void;
}

export default IMediaRecorder;
