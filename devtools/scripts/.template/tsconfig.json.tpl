{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */
    "target": "es6",                                     /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    "lib": [                                             /* Specify a set of bundled library declaration files that describe the target runtime environment. */
     "es6",
     "dom"
    ],
    "allowJs": true,
    "typeRoots": [
      "node_modules/@types"
    ],
    "declaration": true,
    "declarationDir": ".",
    "sourceMap": true,
    "pretty": true,
    "module": "esnext",                                /* Specify what module code is generated. */
    "outDir": "./dist",                                  /* Specify an output folder for all emitted files. */
    "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables `allowSyntheticDefaultImports` for type compatibility. */
    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */
    "strict": true,                                      /* Enable all strict type-checking options. */
    "skipLibCheck": true,                                 /* Skip type checking all .d.ts files. */
    "types": ["node"],
    "moduleResolution": "Node"
  },
  "include":[
    "src/**/*"
  ],
  "exclude": ["dist"],
}
