import JWT from "jsonwebtoken";
import { User } from "@prisma/client";

const JWT_Secret = "fnch980umP(urouHR"

class JWTService{
    public static generateTokenForUser(user: User){
        const payload = {
            id: user?.id,
            email: user?.email
        };
        const token = JWT.sign(payload, JWT_Secret);
        return token;
    }
}

export default JWTService;