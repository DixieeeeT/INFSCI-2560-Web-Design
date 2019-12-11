FoodieAPI
=================
### Introduction: 
We develop a recipe sharing platform, applying the MERN stack. Visitors visit this site and browse existing posts, sign up as a member of our website, sign in and sign out. Site members can create, modify, and delete their recipes.  Besides, registered users can browse all users, check their recipes and "liked" others' posts. Also, we set administrators who have the authorization to manage all users and their posts. 

Author
------------
Min Chen  MIC137@pitt.edu  
Qixian Han QIH34@pitt.edu  
Yue Huang YUH93@pitt.edu  

Due Day
------------
December 10th, 2019

Test Account
------------
1. User:   
Email: test001@pitt.edu   
Password: test001  
2. Admin:  
Email: yuh93@pitt.edu  
Password: 007007  

Routes
------------
#### Auth:
POST /api/signup : sign up     
POST /api/signin : sign in     
GET /api/signout: sign out    
#### User:  
GET /api/users ：get all posts  
GET /api/user/:userId : get single user by userId  
POST /api/user/:userId: modify single user by userId  
DELETE /api/user/:userId: delete single user by userId  
#### Post:
GET /api/posts : get all users  
POST /api/post/new/:userId : create new post by the user  
GET /api/post/:postId: get a post by postId   
PUT /api/post/:postId: update a post by postId  
DELETE /api/post/:postId: update a post by postId   
GET /api/posts/by/:userId : get multiple posts by userId   

Objective
------------
### Details: 
1. Unregistered users interface     
All unregistered users can browse the home page to view the recipes and single recipe details. The home page lists all recipes and filters them by posted time, from newest to oldest. Each recipe is put in a card made by Bootstrap, which shows the thumbnail, the title, the first 100 characters of the recipe body, and the upload time/user. Each page will show six recipes, designed with the mobile version. They can also browse the user list page. But they cannot check users’ profile pages. Unregistered users can sign up by email.   
2. Member interface  
After signing in, our members can browse all pages, including other user’s profile pages. Besides, they can create, update, and delete their recipes. Each recipe consists of an image, a title, and the body. Members can also give “liked” to other users’ recipes. Each member has their own profile page where they can edit his or her membership information, such as change avatar, name, email, and password.  
3. Administrator interface
The administrator has the highest right to manage all users' profiles and their posts, whereas general users cannot edit and delete any other user’s profiles and posts.  
### Problems:
1. It is difficult to figure out how to deal with dependency between multiple models in MongoDB (how to achieve 1:1, 1:n or m:n relationship of models). The way to implement it in a document database differs from the relational database.
2. We tried different ways to deal with uploading photos. In the end, we defined “photo” field with “Buffer” data type
3. We meet problems with differentiating common users and administrators. To solve this, we added the “role” field to the “user” model. Besides, we defined a middleware “hasAuthorization” and called it before any update or delete actions to determine whether the current user (or administrator) updates or deletes himself(or all users). Administrator has high authority.
4. We create the "like-thumbs up" button. We added “likes” fields to “post” model and made it refer to the “user” model. And once a post is liked by a user, the user’s id will be added to the “likes” array. 
### Things to Learn:
1. MERN full-stack
2. React Front-end Framework
3. MVC model
4. MongoDB Connection
5. HTML5 API - localStorage
6. Deploy by Oceanside
### Advanced Features:
1. Home page: Pagination
2. “Like” button
3. Home page: time filter
4. “Loading” buffer

Team member’s contributions
------------
### Min Chen: mic137
#### Position: 
Front-end developer and back-end coordinator.
#### Details: 
React: Post(delete/update/create/liked), navigation bar, home page. Design schemas. Express.js: Model and Restful Api Design
### Yue Huang: yuh93
#### Position: 
Front-end developer and product manager
#### Details: 
React - Admin (delete/edit post; edit profile; Admin page) and User folder(Sign-in; Sign-out; edit/delete profile; edit/delete post; User page)
### Qixian Han: qih34
#### Position: 
Back-end main developer
#### Details: 
Model and Restful Api Design; Restful Apis Implementation (auth, post and user)

Technical Architecture 
------------
### Libraries 
1. Front-end      
“Lodash”; “react”; “react-dom”; “react-router-dom”; “react-scripts”  
2. Back-end    
"body-parser";"cookie-parser";"cors";"dotenv";"express";  "express-jwt";"express-validator";"formidable";"jsonwebtoken";"lodash";"mongoose";"morgan";  "nodemon";"uuid"  
### Frameworks
1. Javascript: React; ExpressJS;   
2. Database: Mongoose;   
3. Design: Bootstrap;   
### Other technologies out of class
1. React: front-end Javascript framework to achieve our ideas on websites
2. We work with separated front-end and back-end and then glue  
3. Digital Ocean: We deploy localhost to cloud server, which connects front-end and back-end by NGINX engine  
4. Github: We post all code into Github repositories  
### How did you put them together
We write front-end and back-end codes separately and then glue them by using REACT_APP_API_URL in front-end code. After that, we use Digital Ocean to deploy front-end and back-end to cloud server by NGINX engine.
### MVC conceptual model to provide a guide 
(i.e. what are the models/views/controllers and what do they do).  
#### Model: 
1. User  
Fields：name, email, hashed_password, salt, created, updated, photo, role  
2. Post  
Fields: title, body, photo, postedBy, created, updated, likes  
The “postedBy” and “likes” fields are referenced to “user” model by “ObjectId”.  
#### View:
Web pages are rendered by React.js.    
#### Controller (structure) :    
```
|__controllers  
	|__auth.js  
		|__signup: Function for user signup   
		|__signin: Function for user signin    
		|__signout: Function for user signout
		|__requireSignin: Function for authentication ( Some actions can only be performed after signing in. )  
	|__post.js	  
		|__postById: Return a post by postId  
		|__isPoster: Determine whether the post is posted by current user  
		|__getPosts: Get all posts with pagination at homepage  
		|__createPost: Create a new post  
		|__postsByUser: Return all posts created by the user  
		|__updatePost: Update a post  
		|__photo: Return photo  
		|__singlePost: Return single post  
		|__like: Like a post  
		|__unlike: Unlike a post  
	|__user.js  
		|__userById: Return single user  
		|__hasAuthorization: Determine whether the current user have the authorization to update or delete post   
		|__allUsers: Return all users  
		|__getUser: Return single user  
		|__updateUser: Update single user  
		|__userPhoto: Return avatar of users  
		|__deleteUser: Delete single user   
```
Challenges
------------
### Challenge details
1. How to glue the front-end and back-end codes    
2. How to come across new documentation of an unfamiliar npm package  
3. Develop the “view” part in MVC model through React.js  
4. Deploy front-end and back-end to Digital Ocean    
### Frustrated libraries or technologies 
1. React framework       
2. Mongoose: a really integrated documentation have lots of functions and functionalities to go through, easily get lost.
3. Formidable: a Node.js module for parsing form data, especially file uploads. I felt frustrated because this is a new libraries for me, so I have to check everything and read some examples used with express.js.
### Features you couldn’t get working?
1. Admin: Delete User  
2. Follow other users  
3. Comments  
4. Search by post title  

Future Work 
------------
### More Features
1. Follow button; Comments  
2. Online Activities: Recipe Competition  
3. Recipe Profile: ingredients; recipe steps; tags  
4. User Profile: Add own interests  
5. Online Shops  
### More Technologies
1. OAuth  
2. Search Recipe by tags and keywords  
3. Private Chat Box  
Conclusion 
------------
### Reflect upon the web technologies and standards you learned in this course
The whole design of the course is logical and understandable for new beginners. For the front-end development technologies study, we feel good about the HTML, HTML5 APIs, CSS, CSS frameworks, and JavaScript. After-class activities and assignments helped us practice these technologies. When the topic went to JavaScript Frameworks, the workload and assignment became more difficulties. We need to read lots of documentation, tutorials, and watch videos besides reading materials in weekly resources to move on with the plan on the syllabus. Some concepts and technologies made us confused, and it often took us a long time to totally comprehend it. So did the part of express.js. The database was not a difficult part for us, who have learned about databases before. We believed the after-class activities were beneficial for efficient learning.
### Did you learn what you wanted?
As beginners, we felt good about this course. It provided enough knowledge about web design and standards, though we need to learn much outside the class.  The course homepage built on Glitch is an excellent idea.   
### What technologies or standards do you think would be useful in future iterations of this course?
We thought that Bootstrap, Node.js, and Mongoose would be the most useful. Also it is a good choice to use a suitable framework to achieve project goals.
### Documentation List any resources that you used in creating this project.
1. Connection  
https://github.com/facebook/create-react-app/issues/5863  
https://www.youtube.com/watch?v=7CqJlxBYj-M  
https://www.youtube.com/watch?v=R54neaLznFA  
https://www.udemy.com/course/node-react/  
https://www.udemy.com/course/react-nodejs-express-mongodb-the-mern-fullstack-guide/  
https://www.youtube.com/watch?v=B_igBe1RikI  
https://www.youtube.com/watch?v=RE2PLyFqCzE  
https://www.youtube.com/watch?v=S9maJY5JcZc  
2. MongoDB   
https://mongoosejs.com/docs/middleware.html#pre  
3. Express     
https://expressjs.com/en/guide/routing.html  
https://www.youtube.com/watch?v=pKd0Rpw7O48  
4. Node JS   
https://nodejs.org/en/docs/  
https://www.udemy.com/course/teachnodejs/  
https://www.udemy.com/course/web-javascript/  
5. React   
https://reactjs.org/tutorial/tutorial.html  
https://www.tutorialspoint.com/es6/es6_dialog_boxes.html  
https://www.youtube.com/watch?v=HgfA4W_VjmI  
https://www.youtube.com/watch?v=n8iA18R76jk     
https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData 
https://www.youtube.com/watch?v=U9T6YkEDkMo  
https://www.youtube.com/watch?v=35lXWvCuM8  
https://www.youtube.com/watch?v=PBTYxXADG_k&t=12s  
https://www.youtube.com/watch?v=B_igBe1RikI&t=1009s  
https://www.udemy.com/course/javascript-es6-react-redux/  
https://www.udemy.com/course/mern-stack-front-to-back/  
https://www.udemy.com/course/node-react/  
https://www.udemy.com/course/react-lean-by-doing/  
https://www.udemy.com/course/react-qs/  
6. LocalStorage HTML5 API  
https://community.auth0.com/t/how-to-trigger-a-react-method-after-jwt-localstorage/8192 
7. Digital Ocean and other deployment methos
https://www.youtube.com/watch?v=Jsmeh7q9Qv4&t=327s  
https://www.youtube.com/watch?v=e1LaekAnVIM&t=878s  
https://www.youtube.com/watch?v=fIeIzHMC4BQ&t=268s  
https://www.youtube.com/watch?v=7CqJlxBYj-M  
https://www.youtube.com/watch?v=Jsmeh7q9Qv4&t=327s  
8. Packages 
https://www.npmjs.com/package/lodash  
https://www.npmjs.com/package/express-validator  
https://www.npmjs.com/package/uuid  
https://www.npmjs.com/package/express-jwt  
https://www.npmjs.com/package/jsonwebtoken  
https://www.npmjs.com/package/formidable  

