## About

This project is the result of having to deal with Traktor while doing my live sessions on Twitch. It's just a chat with an opacity (which may be configurable in the future) that allows me to put it in front of the software so I can be aware of the chat quite easily.

**Technologies**
- [ViteJS](https://vitejs.dev) (with Typescript + Vue3)
- [Electron Builder](https://www.electron.build/)
- [TailwindCSS](https://tailwindcss.com/docs)

### Install dependencies ⏬

```bash
npm install
```
To make it run with your chat, simply add your username to the `.env` file found at `/src/renderer`


### Start developing ⚒️

```bash
npm run dev
```

## Additional Commands

```bash
npm run dev # starts application with hot reload
npm run build # builds application

# OR

npm run build:win # uses windows as build target
npm run build:mac # uses mac as build target
npm run build:mac-universal # uses mac as unversal build target (recommended)
npm run build:linux # uses linux as build target
```

## Credits to
[Deluze](https://github.com/Deluze/electron-vue-template) for making this wonderful template, although I had to make some changes to run it with TypeScript

## Project Structure

```bash
- root
  - config/
    - vite.js # ViteJS configuration
    - electron-builder.json # Electron Builder configuration
  - scripts/ # all the scripts used to build or serve your application, change as you like.
  - src/
    - main/ # Main thread (Electron application source)
    - renderer/ # Renderer thread (VueJS application source)
```

Optional configuration options can be found in the [Electron Builder CLI docs](https://www.electron.build/cli.html).

## Using static files

If you have any files that you want to copy over to the app directory after installation, you will need to add those files in your `src/main/static` directory.

#### Referencing static files from your main process

```ts
/* Assumes src/main/static/myFile.txt exists */

import {app} from 'electron';
import {join} from 'path';
import {readFileSync} from 'fs';

const path = join(app.getAppPath(), 'static', 'myFile.txt');
const buffer = readFileSync(path);
```
