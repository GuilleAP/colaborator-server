const app = require("./app");
const Project = require("./models/Project.model");
const Card = require("./models/Card.model");

// const Project = require("../../models/Project.model");
// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 5005;

const myServer = app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});


const { Server} = require("socket.io")
const socketioJwt = require("socketio-jwt")
const Message = require("./models/Message.model")


//cors
const io = new Server(myServer, {
  cors: {
    origin: process.env.ORIGIN || "http://localhost:3000"
  }
})

//toke auth
io.use(socketioJwt.authorize({
  secret: process.env.TOKEN_SECRET,
  handshake: true
}))

//initialize what socketio server listens
io.on("connection", (socket) =>{
  const user = socket.decoded_token
  console.log("User connecting: " + user.name)

  //Projects controller
  socket.on("new_project", (newProject)=>{
    // const { title, description, admin, team, active, tech } = newProject;
    // console.log("Creating new project: ", title)
    // Project.create({ title, description, admin, team, active, tech, cards: [] })
    //   .then((newProject) => {
        io.emit("receive_new_project", newProject)
      // })
      // .catch((err) => console.log(err));
  })

  socket.on("edit_project", (updatedProject)=>{
    const {projectId, title, description, team} = updatedProject;

    // Project.findByIdAndUpdate(projectId, {title, description, team}, { new: true })
    //   .then((updatedProject) =>{
        io.emit("receive_edit_project", updatedProject)
      // })
      // .catch((error) => console.log(error));
  })


  socket.on("delete_project", (projectId)=>{

  
    // Project.findByIdAndRemove(projectId)
    //   .then(() =>
        io.emit("receive_delete_project")
      // )
      // .catch((error) => console.log(error));
  })




  //Tasks controller
  socket.on("new_task", (projectId, newTask)=>{

    // const {title, description, color, stat, limitDate} = newTask;

    // Card.create({
    //     title: title, 
    //     description: description, 
    //     stat: stat,
    //     project: projectId,
    //     color: color,
    //     limitDate: limitDate
    // })
    // .then((newCardResponse) => {
      io.emit("receive_new_task", newTask)
    // })
    // .catch(err =>  res.status(400).json(err));
  })



  socket.on("edit_task", (task)=>{
    // const {taskId, title, description, color} = task;
  
    // Card.findByIdAndUpdate(taskId, {    
    //   title: title,
    //   description: description,
    //   color: color
    // })
    // .then((taskUpdated) => {

    io.emit("receive_edit_task")

    // })
    // .catch(err => console.log(err))
})

  socket.on("edit_task_state", (taskId, state)=>{
    
  //   Card.findByIdAndUpdate(taskId, {    
  //     stat: state.toUpperCase()
  // })
  //   .then((cardUpdated) => {

      io.emit("receive_edit_task_state")

    // })
    // .catch(err => console.log(err))

  })


socket.on("delete_task", (taskId)=>{
  
  // Card.findByIdAndRemove(taskId)
  //     .then(() =>
      io.emit("receive_delete_task")

      // )
      // .catch((error) => console.log(error));
})


  //Chat controller
  socket.once("join_chat", (chatId) =>{
    socket.join(chatId) //creates a socket room with chatId and adds the user to it
    console.log(`user: ${user.name} entering room: ${chatId}`)
  })

  socket.on("send_message", async (messageObj)=>{
    const fullMessage = {...messageObj, sender: user}
    
    await Message.create(fullMessage)
    //Sends changes to all sockets users
    socket.to(fullMessage.chatId).emit("receive_message", fullMessage) //sends the message to all socket room users except the sender
    io.emit("receive_alert_message") //sends the message to all socket room users except the sender

    socket.emit("receive_message", fullMessage) //sends the message to the sender
  })


  


})
