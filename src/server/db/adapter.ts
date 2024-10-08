import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { sessionTable, userTable } from "./schema";
import { db } from ".";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export default adapter;
