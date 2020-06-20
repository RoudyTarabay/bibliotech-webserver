import pool from "../database";
export default class SQLQueryHelper {
  query: string;
  queryArgs: [];
  setQuery(query: string) {
    this.query = query;
    return this;
  }
  setQueryArgs(args: []) {
    this.queryArgs = args;
    return this;
  }
  async execute() {
    try {
      const response = await pool.query(this.query, this.queryArgs);
      console.log("executing", response);
      return response;
    } catch (err) {
      console.log("error", err, err.message);
    }
  }
}
