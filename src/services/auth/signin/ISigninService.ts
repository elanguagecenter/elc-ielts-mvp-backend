import { CognitoChallangePayload, UserSigninPayload, UserSigninResponse } from "../../../utils/types/common/types";

interface ISigninService {
  studentSignIn(payLoad: UserSigninPayload): Promise<UserSigninResponse>;
  completeCognitoChallange(payLoad: CognitoChallangePayload): Promise<UserSigninResponse>;
}

export default ISigninService;
