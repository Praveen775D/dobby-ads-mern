# Dobby Ads MERN — Drive-like Image Manager

## Local Run
### Backend
```bash
cd server
cp .env.example .env
# fill MongoDB, JWT, Cloudinary, CORS_ORIGIN=http://localhost:5173
npm i
npm run dev
```
### Frontend
```bash
cd client
cp .env.example .env
npm i
npm run dev
```

## Deployment
- Backend: Render (set env vars, Start: `node src/server.js`)
- Frontend: Vercel/Netlify (set `VITE_API_BASE`)
