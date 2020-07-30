import { DataSource } from "apollo-datasource";
import UsersMapper from "../mappers/UsersMapper";
import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import { ApolloError } from "apollo-server";

dotenv.config();
const encrypt = (hash) => {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    process.env.ENC_KEY,
    process.env.IV
  );
  let encrypted = cipher.update(hash, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};
const decrypt = (encrypted) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    process.env.ENC_KEY,
    process.env.IV
  );
  const decrypted = decipher.update(encrypted, "base64", "utf8");
  return decrypted + decipher.final("utf8");
};
export default class UserRegistration extends DataSource {
  usersMapper: UsersMapper;
  constructor() {
    super();
    this.usersMapper = new UsersMapper();
  }
  async userExists(
    email: string
  ): Promise<
    | boolean
    | {
        success: boolean;
        message: string;
      }
  > {
    const response = await this.usersMapper.fetch(email);
    return response.length != 0;
  }
  async insert(
    email: string,
    password: string,
    cpassword: string
  ): Promise<{ success: boolean; message: string }> {
    if (password !== cpassword)
      throw new ApolloError("Passwords mismatch", 1000 + "", {
        isManuallyThrown: true,
      });
    const userExists = await this.userExists(email);
    if (userExists)
      throw new ApolloError("Email already in use", 1001 + "", {
        isManuallyThrown: true,
      });
    //one-way hashing. Bcrypt is the recommended script.
    //not secure to hash in mysql due to mysql logging.
    bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        const response = this.usersMapper.insert(email, encrypt(hash));
        if (response)
          return {
            success: true,
            message: "Signup successful, check your inbox",
          };
        else
          throw new ApolloError("Failed to sign up", 1002 + "", {
            isManuallyThrown: true,
          });
      });
    });
    return {
      success: true,
      message: "Signup successful, check your inbox",
    };
  }
  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; id?: number; message?: string }> {
    const response = await this.usersMapper.fetch(email);
    if (!response.length)
      throw new ApolloError("This email is not registered", 1003 + "", {
        isManuallyThrown: true,
      });
    const isPassword = await bcrypt.compare(
      password,
      decrypt(response[0].password)
    );
    if (isPassword)
      return {
        success: true,
        id: response[0].id,
      };
    else
      throw new ApolloError("Wrong password", 1004 + "", {
        isManuallyThrown: true,
      });
  }
}
