import SQLQueryHelper from "../helpers/SQLQueryHelper";
export default class UsersMapper {
  queryHelper: SQLQueryHelper;
  constructor() {
    this.queryHelper = new SQLQueryHelper();
  }
  insert(email: string, password: string): Promise<boolean> {
    return this.queryHelper
      .setQuery("INSERT INTO users (email,password) VALUES (?,?)")
      .setQueryArgs([email, password])
      .execute();
  }
  fetch(email: string): Promise<any> {
    return this.queryHelper
      .setQuery("SELECT * FROM users WHERE email=?")
      .setQueryArgs([email])
      .execute();
  }
}
