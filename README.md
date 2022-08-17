## Link

https://project3-colaborator-app.herokuapp.com/

<br>

### Instructiones

#### Instala dependencias
- npm i --force

#### Lanza el backend
- npm start (Lanzamiento normal)
- npm run dev (Lanzamiento con Nodemon)

#### Agregar archivo .env con:
- TOKEN_SECRET = super-secret-password
- MONGODB_URI=mongodb+srv://user:password.@redone.w7gjz.mongodb.net/?retryWrites=true&w=majority 

---

### API Documentation

We will start our project by first documenting all of the routes and data models for our API. Following best practices we will use _verbs_ to specify the type of operation being done and _nouns_ when naming endpoints.

<br>

# Client / Frontend

### Routes

| Path                                 | Component                      | Permisions       | Behavior                |
| -------------------------------------| -------------------------------| ---------------- | ----------------------- |
| '/'                                  | `HomePage`                     | `<AnonRoute>`    | Home Page               |
| '/signup'                            | `SignupPage`                   | `<AnonRoute>`    | Sign Up Page            |
| '/login'                             | `LoginPage`                    | `<AnonRoute>`    | Login Page              |
| '/projects'                          | `ProjectsPage`                 | `<AnonRoute>`    | Projects Page           |
| '/chat'                              | `ChatPage`                     | `<PrivateRoute>` | General Chat Page       |
| '/project/:projectId/chat'           | `ChatPageWBar`                 | `<PrivateRoute>` | Project Chat Page       |
| '/project/:projectId'                | `ProjectDetailsPage`           | `<PrivateRoute>` | Project Info Page       |
| '/project/:projectId/tasks'          | `ProjectCards`                 | `<PrivateRoute>` | Project Task Page       |
| '/project/:projectId/monthCalendar'  | `CalendarPage`                 | `<PrivateRoute>` | Project Calendar Page   |
| '/*'                                 | `ErrorPage`                    | `<Route>`        | Error Page              |


<br>

# Server / Backend

### Routes

##### Project routes

| HTTP verb | URL                                              | Action                        |
| --------- | ------------------------------------------------ | ----------------------------- |
| GET       | `/colaborator-API/projects`                      | Gets all the projects         |
| POST      | `/colaborator-API/projects`                      | Adds a new project            |
| PUT       | `/colaborator-API/projects/:projectId`           | Updates a specific project    |
| DELETE    | `/colaborator-API/projects/:projectId`           | Deletes a specified project   |

##### Task routes

| HTTP verb | URL                                                    | Action                     |
| --------- | ------------------------------------------------------ | -------------------------- |
| GET       | `/colaborator-API/projects/card/get-cards`             | Gets all the Tasks         |
| POST      | `/colaborator-API/projects/:projectId/card/new-card`   | Create a new Task          |
| PUT       | `/colaborator-API/projects/card/updateCard/:id/:stat`  | Edits the specified task   |
| DELETE    | `/colaborator-API/projects/card/delete/:id`            | Deletes the specified task |

##### Chat routes

| HTTP verb | URL                                                    | Action                                |
| --------- | ------------------------------------------------------ | --------------------------            |
| POST      | `/colaborator-API/chat/start/direct-chat/:userId`      | Creates a chat for a specific User    |
| POST      | `/colaborator-API/chat/start/project-chat/:projectId`  | Creates a chat for a specific Project |
| POST      | `/colaborator-API/chat/start/:userId`                  | Creates a chat                        |
| GET       | `/colaborator-API/chat/messages/:chatId`               | Gets the chats                        |

##### Auth routes

| HTTP verb | URL                                                    | Action                     |
| --------- | ------------------------------------------------------ | -------------------------- |
| POST      | `/colaborator-API/auth/signup`                         | SignUp User                |
| POST      | `/colaborator-API/auth/login`                          | Login User                 |
| GET       | `/colaborator-API/auth/verify`                         | User verification          |

<br>

<hr>

#### Models

##### Activity Model

```js
  {
    title: {
      type: String,
      required: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  }
```

##### Task Model

```js
  {
    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    state: {
        type: String,
        enum: ['TODO', 'PROGRESS', 'DONE']
    },

    color: {
        type: String,
        enum:['white', 'blue', 'red', 'yellow', 'gray', 'orange', 'green']
    },

    limitDate: {
        type: String
    },

    project: { type: Schema.Types.ObjectId, ref: "Project" }  
  }
```

##### Chat Model

```js
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  }
```

##### Message Model

```js
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    text: String,
    chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
  }
```

##### Project Model

```js
  {
    title: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },

    description: String,

    tech: String,

    endAt: Date,

    admin:{ type: Schema.Types.ObjectId, ref: "User" },

    team: [{ type: Schema.Types.ObjectId, ref: "User" }],

    cards: [{ type: Schema.Types.ObjectId, ref: "Card" }]
  }
```

#### User Model

  ```js
  {

      email: { 
          type: String, 
          unique: true, 
          required: true 
      },

      password: { 
          type: String, 
          required: true 
      },
      
      name: { 
          type: String, 
          required: true 
      },

      role: {
          type: String,
          required: true
      }
  }
```

