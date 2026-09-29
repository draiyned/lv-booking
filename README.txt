LV PICKLEBALL VILLAGE BOOKING SITE
Setup takes about 15 minutes. Use a computer for steps 3 and 4.

1. Supabase (your database)
   Make a free project at supabase.com.
   Open SQL Editor, paste all of supabase.sql, press Run.
   Open Project Settings, then API. Copy two values:
   the Project URL and the service_role key.
   Keep the service_role key secret. Never put it in the page code.

2. Pick an admin passcode
   Choose a long one. Staff type it on the admin page.

3. GitHub
   Make a new repository. Upload every file and folder from this project.
   Keep the api folder and its files as they are.

4. Vercel
   Go to vercel.com, choose Add New Project, import your repository.
   Before you deploy, add three Environment Variables:
     SUPABASE_URL          your Project URL
     SUPABASE_SERVICE_KEY  your service_role key
     ADMIN_PASSCODE        your passcode
   Press Deploy.

5. Use it
   Customers: https://your-project.vercel.app
   Staff:     https://your-project.vercel.app/admin
   Add your own domain under Vercel Settings, then Domains.

Change prices or courts
   Edit api/_lib.js (COURTS and RATES) and the same values at the top
   of the script in index.html. Commit the change and Vercel redeploys.

Good to know
   Free Supabase projects pause after about a week with no activity.
   Open the Supabase dashboard and press Restore if that happens.
   Bookings made on the Claude-hosted test page do not carry over.
