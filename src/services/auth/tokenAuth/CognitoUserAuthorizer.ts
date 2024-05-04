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
      const jwks = JSON.parse(configs.awsCognitoJwk);
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
