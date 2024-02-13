# Skateboard Tricks Tracker

This projects demonstrates using authentication and an external database for a highly interactive progressive web application. 
It is a full-stack Next.js project featuring multiple pages, an Api with middleware and multiple OAuth services to sign in with & persistent data in a NoSql database.
The database is a headless MongoDB instance and the Mongoose is used for Object Data Modelling (ODM) and additional validations.
For the front-end I used TailwindCSS and my own `react-transition-scroll` library for adding pleasant animations when elements are scrolled into the viewport.

This application allows skateboarders to be able to track what tricks they've learned and log them in their personal dashboard.
The dashboard features multiple pages, forms to add new tricks, Dynamic tables with CRUD functionalities, and it is installable on the users device (Progressive Web Application).
Tricks are organized per type. And the application features fast performance, a simple and easy to use user interface and smooth animations.

## How to use

Install the dependencies
```bash
npm install
```

Copy the `.env.local.example` file in this directory to `.env.local` (which will be ignored by Git):
```bash
cp .env.local.example .env.local
```

Then set each variable on `.env.local`:
- `MONGODB_URI` should be the MongoDB connection string. ([MongoDB Guide](https://docs.mongodb.com/guides/server/drivers/))
- Add your own OAuth credentials for Google, GitHub etc.

Run the development server
```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000) with your browser to see the result.
