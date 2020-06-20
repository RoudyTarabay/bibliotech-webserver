import SQLQueryHelper from "../helpers/SQLQueryHelper";
export default class UsersMapper {
  queryHelper: any;
  constructor() {
    this.queryHelper = new SQLQueryHelper();
  }
  insert(email: string, password: string) {
    this.queryHelper
      .setQuery("INSERT INTO users (email,password) VALUES (?,?)")
      .setQueryArgs([email, password])
      .execute();
  }
  fetch(email: string) {
    return this.queryHelper
      .setQuery("SELECT * FROM users WHERE email=?")
      .setQueryArgs(email)
      .execute();
  }
}
