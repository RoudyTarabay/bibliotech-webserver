import { DataSource } from "apollo-datasource";
import UsersMapper from "../mappers/UsersMapper";
import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const encrypt = (hash) => {
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    process.env.ENC_KEY,
    process.env.IV
  );
  let encrypted = cipher.update(hash, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};
const decrypt = (encrypted) => {
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    process.env.ENC_KEY,
    process.env.IV
  );
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  return decrypted + decipher.final("utf8");
};
export default class UserRegistration extends DataSource {
  context: any;
  usersMapper: any;
  constructor() {
    super();
    this.usersMapper = new UsersMapper();
  }

  initialize(config) {
    this.context = config.context;
  }
  insert(email: string, password: string, cpassword: string) {
    if (password !== cpassword)
      return {
        success: false,
        message: "password mismatch",
      };
    //one-way hashing. Bcrypt is the recommended script.
    //not secure to hash in mysql due to mysql logging.
    bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), (err, salt) => {
      console.log("insert", salt, process.env.SALT_ROUNDS);

      bcrypt.hash(password, salt, (err, hash) => {
        console.log("hash", password, hash);

        const response = this.usersMapper.insert(email, encrypt(hash));
      });
    });
  }
}
