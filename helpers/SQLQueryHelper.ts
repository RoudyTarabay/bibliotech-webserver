import pool from "../database";
import { ApolloError } from "apollo-server";
export default class SQLQueryHelper {
  query: string;
  queryArgs: unknown[];
  displayableError: string;
  errorStatus: number;
  setQuery(query: string): SQLQueryHelper {
    this.query = query;
    return this;
  }
  setDisplayableError(displayableError: string): SQLQueryHelper {
    this.displayableError = displayableError;
    return this;
  }
  setQueryArgs(args: unknown[]): SQLQueryHelper {
    this.queryArgs = args;
    return this;
  }
  setErrorStatus(errorStatus: number): SQLQueryHelper {
    this.errorStatus = errorStatus;
    return this;
  }
  async execute(): Promise<any> {
    try {
      const response = await pool.query(this.query, this.queryArgs);
      return response;
    } catch (err) {
      throw new ApolloError(this.displayableError, this.errorStatus + "", {
        verbose: err,
        isManuallyThrown: true,
      });
    }
  }
}
