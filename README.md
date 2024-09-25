# Game Releases Calendar

Simple calendar for checking game releases. Utilizes [rawg.io](https://rawg.io/) API.

## Table of contents

- [Game Releases Calendar](#game-releases-calendar)
  - [Table of contents](#table-of-contents)
- [Github \& Live](#github--live)
  - [Getting Started](#getting-started)
  - [Learn More](#learn-more)
  - [Deploy](#deploy)
  - [Features](#features)
  - [Status](#status)
  - [Contact](#contact)

# Github & Live

Github repo can be found [here](https://github.com/gizinski-jacek/releases-calendar).

Live demo can be found on [Vercel](https://releases-calendar.vercel.app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/docs).

Don't forget to add **.env** file with these environment variables for the app:

```
RAWG_IO_API_KEY
```

## Features

- Calendar with all weeks of the month, including days from previous and next month
  - Styled appropriately for ease of understanding
  - Shows number of releases on each day
  - Lets user highligh specific day of the week
  - Includes Modal rendering all games in a list with gallery of games screenshots, release date, genre, platform and store availability
- Controls for choosing date and resetting to current date
- Toggle for rendering R18 rated content
- Toggle for light/dark mode

## Status

Project status: **_FINISHED_**

## Contact

Feel free to contact me at:

```
gizinski.jacek.tr@gmail.com
```
