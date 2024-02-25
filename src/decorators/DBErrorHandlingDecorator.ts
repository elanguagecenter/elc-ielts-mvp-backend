import ELCIELTSInternalError from "../exception/ELCIELTSInternalError";

function Handle(target: any, methodName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    try {
      originalMethod.call(this, ...args);
    } catch (err) {
      throw new ELCIELTSInternalError("DB Error Occured");
    }
  };
}

export default Handle;
