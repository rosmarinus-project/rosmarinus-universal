{
  "name": "{{ projectCategory }}/{{ projectName }}",
  "$schema": "../../../node_modules/nx/schemas/project-schema.json",
  "type": "library",
  "sourceRoot": "packages/{{ projectCategory }}/{{ projectName }}",
  "targets": {
    "dev": {
      "executor": "nx:run-commands",
      "options": {
        "commands": ["npm run dev"],
        "cwd": "packages/{{ projectCategory }}/{{ projectName }}"
      }
    },
    "build": {
      "executor": "nx:run-commands",
      "options": {
        "command": "npm run build",
        "cwd": "packages/{{ projectCategory }}/{{ projectName }}"
      },
      "outputs": ["{projectRoot}/dist"]
    },
    "test:unit": {
      "executor": "nx:run-commands",
      "options": {
        "commands": ["npm run test:unit"],
        "cwd": "packages/{{ projectCategory }}/{{ projectName }}"
      }
    },
    "beta": {
      "executor": "@rosmarinus/nx-plugin:beta"
    },
    "release": {
      "executor": "@rosmarinus/nx-plugin:release"
    }
  }
}