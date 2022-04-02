## Features

- Automatically renames a file for you **based on what it ends with**
- Optionally inserts some text into that file

## Why would I ever use this?

This extension is intended to boost productivity when you have to type longish file extensions.

My primary use case was using this to reduce time and misspelling in creating .svelte files for [SVELTE](https://svelte.dev/)

## Extension Configuration

Add entry into your VSCode settings.json file and configure like the example below

```
  "autoRenameFile": {
    "config": [
      {
        "from": ".sv",
        "to": ".svelte"
      },
      {
        "from": ".svts",
        "to": ".svelte",
         "insertText": "<script lang='ts'>\n\n</script>"
      }
    ]
  }
```
