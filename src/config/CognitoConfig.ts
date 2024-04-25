import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import configs from "./configs";

const cognitoClient: CognitoIdentityProviderClient = new CognitoIdentityProviderClient({
  region: configs.aws_region,
});

export default cognitoClient;
