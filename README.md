## About

This is a parent-facing portal used to register students for an online computer science camp.
The site is deployed to https://actoninstituteofcs.netlify.app/.

## Contributors

- **Andrew Chen** - Technical Lead
- **Nipun Kisari**
- **Jeffrey Li**
- **Ben Wang**
- **Julia Zhou**
- **Gloria Zhu**

## Tech Stack
This app is implemented as a separate frontend and backend app.

**Frontend**
The frontend is implemented using TypeScript with a React.js/Next.js stack.

**Backend**
The backend is written in Express.js/TypeScript, leveraging a noSQL Firebase database.

**Deployment**
The frontend server is deployed using Netlify, with the backend API endpoints being deployed along with frontend server using Netlify serverless functions.

## Set Up .env file

We currently use the .env file to store private keys that we don't want to publish to the repository.
Take a look at `.env.example` for the pieces of information you need to fill in, then create a file
called `.env`, with the information filled in (ask Andrew for this info).

## Start the frontend and backend servers locally

1. Install dependencies (only have to do in the beginning and if the dependencies ever change, i.e. we add a new package):

```
npm install
```

2. To start the development servers:

You'll need two terminal/command line windows, one to start the frontend server on and one to start the backend server on.

Frontend:

```
cd frontend
npm run dev
```

In a separate window, start the backend server.

Backend:

```
cd backend
npm run dev
```
