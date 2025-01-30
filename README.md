

<p align="center"><img src="https://socialify.git.ci/PRANJALRANA11/kendal-assignment/image?custom_description=Get+best+property+listings&amp;description=1&amp;font=Inter&amp;forks=1&amp;issues=1&amp;language=1&amp;name=1&amp;owner=1&amp;pattern=Charlie+Brown&amp;pulls=1&amp;stargazers=1&amp;theme=Dark" alt="project-image"></p>


<h2>🚀 Demo</h2>

[h](h)



  
  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   Display property listings as markers on the map.
*   Clicking a marker should open a popup with the property name description and an image.
*   The map should allow users to pan and zoom.
*   seamless interaction between the map and sidebar.
*   add new properties or edit the addresses of existing properties
*   Sorting filter search
*   Draw (this feature works locally but on deployed version sidebar is not updating for map draw because of ssr build issues))

<h2>🛠️ Installation Steps:</h2>

<p>1. Clone the repo</p>

```
https://github.com/PRANJALRANA11/kendal-assignment.git
```

<p>2. install dependancies</p>

```
npm install
```

<p>3. run dev server and access on localhost:3000</p>

```
npm run dev
```

<p>4. before running server remember to paste .env.local folder in root dir and also ensure you have node and npm installed</p>

  
  
<h2>💻 Built with</h2>

Technologies used in the project:

*   Nextjs
*   Shadcn ui / tailwindcss
*   appwrite
*   clerk
*   formik
*   zod
*   typescript
*   leaflet
*   webgl rendering

<h2> 🏗️ Project Architecture </h2>
![Screenshot 2025-01-30 135309](https://github.com/user-attachments/assets/5e0342a9-4da7-4c96-87af-c11bd92b91f7)


<h2>📂 Folder Structure </h2>
![Screenshot 2025-01-30 135829](https://github.com/user-attachments/assets/df9d398f-5441-4f7a-be89-57099ef93354)


<h2> 🤔 Problems Faced </h2>

- Integrating leaflet map with sidebar was a bit challenge as tiles was not loading correctly (fixed by dynamic routing)

- draw feature was not getting implemented correctly as getting markers inside the polygon was something that takes time (created a function for this)

- random CSS issues with WebGL rendering of globe and map on mobile and desktop view







