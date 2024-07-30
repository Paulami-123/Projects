import JWT from "jsonwebtoken";
import { User } from "@prisma/client";
import { JWTUser } from "../interfaces";

const JWT_Secret = "fnch980umP(urouHR"

class JWTService{
    public static generateTokenForUser(user: User){
        const payload: JWTUser = {
            id: user?.id,
            email: user?.email
        };
        const token = JWT.sign(payload, JWT_Secret);
        return token;
    }

    public static decodeToken(token: string){
        try {
            return JWT.verify(token, JWT_Secret) as JWTUser;
        } catch (error) {
            null;
        }
    }
}

export default JWTService;