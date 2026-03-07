# 🕵️ Campus Hunt: Tech Fest Edition

Welcome to **Campus Hunt**, an interactive, web-based treasure hunt designed for competitive tech fest events! 

This application seamlessly combines the physical thrill of a scavenger hunt with a modern, digital tracking system. Participants scan strategically placed QR codes around the campus, log in with their assigned team credentials, solve riddles tailored to their location, and track their progress live.

## 🌟 Key Features

### For Participants (Players)
- **Instant Access via QR**: No app installation required! Players scan a QR code at a station to load the challenge directly in their browser.
- **Cinematic & Atmospheric UI**: A highly immersive, dark-themed UI featuring glowing cards, ethereal backgrounds, and modern glassmorphism.
- **Team-Based Progress**: Progress is tied to team credentials. Players can leave and resume exactly where they left off.
- **Dynamic Challenges**: Answer tech/logic riddles correctly to earn "Secret Letters" needed for the final puzzle.
- **Fun Penalty Tasks**: If a team answers incorrectly, they are assigned a fun physical/recording task (e.g., "Sing a song") to prove they completed it before moving on.

### For Organizers (Admin Panel)
- **Secure Access URL**: The admin dashboard is hidden at a custom, obfuscated route to prevent players from snooping.
- **QR Code Generator**: Enter your base hosting URL, and the admin panel auto-generates downloadable PNG QR codes for every physical station.
- **Live Activity Tracking**: Monitor which teams are logging into which stations in real-time.
- **Live Answer Logs**: See exactly who answered what, and whether they got it right or wrong.
- **Credential Management**: Create, view, and delete secure login credentials for participating teams.
- **Submission Gallery**: View penalty video recordings directly from the dashboard.

---

## 🛠️ Tech Stack

This project is built using modern, fast, and scalable web technologies suited for sudden traffic spikes common in tech fest events.

- **Frontend Framework**: React (via Vite for lightning-fast HMR and building)
- **Styling**: Tailwind CSS combined with custom CSS for complex animations and ethereal glowing effects.
- **Routing**: React Router DOM (with protected and base64 obfuscated routes to prevent brute-forcing stations).
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage). Provides instantaneous real-time sync for the admin dashboard.
- **QR Generation**: Extracted locally and generated instantly using `qrcode` on the canvas.

## 🚀 Deployment (Vercel)

This application is perfectly optimized to be hosted on **Vercel**. 

1. **Push to GitHub**: Push this repository to an empty GitHub repository.
2. **Import to Vercel**: Log into Vercel and click "Add New... > Project". Select your GitHub repository.
3. **Set Environment Variables**: In the Vercel deployment settings, ensure you add the following Environment Variables (found in your `.env` file):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Deploy**: Click Deploy! Vercel will auto-detect Vite and build the project flawlessly.
5. **Update Admin Panel**: Once deployed, visit your new Vercel URL, navigate to your admin panel, enter the Vercel URL into the QR generator, and print your fresh QR codes for the event!

---

*Built with ❤️ for campus events.*
