# Phone Book App

Link to the application: https://phone-book-lore.fly.dev/

Open the app in the browser with the command:
`fly open` or `flyctl open`

## Deploy to production:
**Step 1:**
Create a production build of the application: 
from the *root of the frontend project* run the command `npm run build` (for an app created with *create-react-app*).
This creates a directory called *build* which containes the directory static. 


**Step 2:**
Copy the *build* directory from the frontend to the root of the backend repository.

**Step 3:**
Commit the production build of the frontend to the backend repository, and push the code to Fly.io again.
The deployment is done with the command:
`fly deploy` or `flyctl deploy`

## Set the env value from the command line with the command

`fly secrets set MONGODB_URI='mongodb+srv://address here...`
OR `flyctl secrets set MONGODB_URI='mongodb+srv://address here...`

