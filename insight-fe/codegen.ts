import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3000/graphql",
  //   documents: "src/**/*.graphql",
  generates: {
    "src/__generated__/schema-types.ts": {
      plugins: ["typescript"],
    },
  },
};
export default config;
