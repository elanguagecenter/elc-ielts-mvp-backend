import { GlobalSignOutCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoChallangePayload, UserSigninPayload, UserSigninResponse } from "../../../utils/types/common/types";

interface ISigninService {
  userSignIn(payLoad: UserSigninPayload): Promise<UserSigninResponse>;
  completeCognitoChallange(payLoad: CognitoChallangePayload): Promise<UserSigninResponse>;
  userSignout(accessToken: string): Promise<GlobalSignOutCommandOutput>;
}

export default ISigninService;
