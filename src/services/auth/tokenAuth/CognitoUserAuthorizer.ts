import { Request, Response, NextFunction } from "express";
import UserAuthorizer from "./UserAuthorizer";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import configs from "../../../config/configs";
import jwkToBuffer from "jwk-to-pem";
import ELCIELTSUnauthorizedError from "../../../exception/ELCIELTSUnauthorizedError";
import { CognitoUserGroups, UserTypes } from "../../../utils/types/common/common";

class CognitoUserAuthorizer implements UserAuthorizer {
  private static instance = new CognitoUserAuthorizer();
  private cognitoGroupUserTypeMap: Map<string, string>;
  private constructor() {
    this.cognitoGroupUserTypeMap = new Map([
      [CognitoUserGroups.STUDENT_GROUP, UserTypes.STUDENT],
      [CognitoUserGroups.TEACHER_GROUP, UserTypes.TEACHER],
      [CognitoUserGroups.ORG_ADMIN_GROUP, UserTypes.ORG_ADMIN],
      [CognitoUserGroups.SUPER_ADMIN_GROUP, UserTypes.SUPER_ADMIN],
    ]);
  }

  static GetInstance(): CognitoUserAuthorizer {
    return this.instance;
  }
  authorize(req: Request, res: Response, next: NextFunction): void {
    const token = this.extractToken(req);
    if (token && token.length > 0) {
      const jwks = JSON.parse(
        `{"keys":[{"alg":"RS256","e":"AQAB","kid":"e4owXlwahTr4HyzkwvrAnCTUNvOqSXYyWAWIUou6j1M=","kty":"RSA","n":"vdn2eGXwutiG5XtayjzfJ0dM9Fb1yJUwk738IOAyoa8I5egnsqy0_B2l0AXm1ciG5reM2rJsJgsq4iyD5zxoUR44KqBaJI2l0V9JEKGx4zDCTRpi_ZzaseCJYsUk4EoC7rFQ6zcyOCP_07CC4X29LKSHPj2rTv8TvvP-X40n1xeDih1RELyV4SW2DJw6st1VFgn7VfYlc4Obe2RQjiXTI9S7MEei2XC5fMs4rIdRNurW1GCVi-B2bX_ZphFY10_PxDg9T2PhuOYhB4anJMa6AhStBQ984SkaTv3lSLKYxtwy1YJt-2oY250241QCK7KlHSsIzwz984aYSIpqUGvjQw","use":"sig"},{"alg":"RS256","e":"AQAB","kid":"la90WIHvGPpkzcAR3PzTa5MMHiobYSeW10jy1zJnt5s=","kty":"RSA","n":"oj4_I5zYg9Pag8avQayvzUsh_MBoB3lU6j2DreuuRgEWA9tl5Iqazy1iUEopOQ-64iOmZFJO9F-xdmJ421lySfzZbCDLTGW1S1Dt_RCHAxb3Rfgi5rlfZqtIOdXKwZysBismzns_djBCZKQFN7tbRcEID9y-lmXawNUXU3-e4ny1p7no6LadcTFDJ986ZxnvSbgYnblKHdQgFb3Rw8mAtKmue9PLMyzSFw5-K9-HKXb5l_GQ0DtY2oUb5cbjlFsc1uJ6sYHZUeACY8RtQS5FHSQB09CNhA2LnK9upYdIWGiNNPudcCex3TuLG8gifo5o_JJzH1TifFcGD2Hp5A8EQw","use":"sig"}]}`
      );
      const result = jwks.keys.map((jwk: jwkToPem.JWK) => this.verifyJwt(token, jwk)).filter((res: any) => res.success);
      if (result.length == 0) {
        next(new ELCIELTSUnauthorizedError("User is unauthorized or user session is expired"));
      } else {
        req.userData = {
          userId: result[0].data["custom:userId"],
          email: result[0].data.email,
          cognitoName: result[0].data["cognito:username"],
          userType: result[0].data["cognito:groups"].map((group: string) => this.cognitoGroupUserTypeMap.get(group) || "")[0],
        };
        next();
      }
    } else {
      next(new ELCIELTSUnauthorizedError("User is unauthorized to perform the action"));
    }
  }

  private extractToken(req: Request) {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      const [bearer, token] = authHeader.toString().split(" ");
      if (bearer === "Bearer" && token) {
        return token;
      }
    }
    return null;
  }

  private verifyJwt(token: string, jwk: jwkToBuffer.JWK) {
    try {
      const pem = jwkToPem(jwk);
      return {
        success: true,
        data: jwt.verify(token, pem, { algorithms: ["RS256"] }),
      };
    } catch (err) {
      return {
        success: false,
        data: null,
      };
    }
  }
}

export default CognitoUserAuthorizer;
