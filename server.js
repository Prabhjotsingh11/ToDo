const {Task,signupCredentials} = require('./public/DB');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const {jwtMiddleware,generatetoken}=require('./public/jwt');

app.use(cors());
// Middleware
// const logsreq= (req,res,next)=>{
//     console.log(`[${new Date().toLocaleString()}]`);
//     next();
// }

// app.use(logsreq); //use middleware for all routes
// app.use(urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("./public"));

app.get('/getAll',jwtMiddleware ,async (req, res) => {
    const userId=req.user;
    console.log(userId);
    try{
        const tasks= await signupCredentials.findOne({ userId: userId }).populate('notes');
        console.log(tasks);
        res.json(tasks);
    }catch(err){
        console.log(err)
    }
})

app.post('/takenote',jwtMiddleware,async(req, res) => {
    
    try{

        const { notes }  = req.body;
        const userId=req.user.userId;

        // const tasks=await Task.create({notes, status: false });
        const just_added_TASK= new Task({notes,status: false});
        await just_added_TASK.save();

        await signupCredentials.findOneAndUpdate(
            {userId:userId},
            { $push:{notes:just_added_TASK._id}}
        );
        res.end('DONE');
    }catch(err){
        console.log(err);
    }
    // console.log(tasks);
    // tasks.push({ notes, status:false, id: tasks.length + 1 })
})

app.post('/signup',async(req,res)=>{
    try{
        const {userId, password}=req.body;
        const existingUser = await signupCredentials.findOne({ userId });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        const newuser=new signupCredentials({userId, password});
        await newuser.save();
        const token=generatetoken({userId});
        // console.log(token);
        res.end(token);
    }catch(err){
        console.log(err);
    }
})

app.post('/login' ,async (req, res) => {
    try {
      const { userId, password } = req.body;
      const user = await signupCredentials.findOne({ userId });
  
      if (!user) {
        return res.status(401).send('Invalid username ');
      }
  
      if (user.password !== password) {
        return res.status(401).send('Invalid password');
      }
  
      const token=generatetoken(userId);
      res.json({token});
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  });

app.delete('/deletenote/:id',jwtMiddleware, async(req, res) => {
    const id = req.params.id;
    // console.log(id)
    // const index = tasks.findIndex(task => {
    //     return task.id === id;
    // })
try{
const task=await Task.findByIdAndDelete({_id:id});
res.json({task})
}catch(err){
    console.log(err)
}
    // tasks.splice(index, 1);
    // res.json({ success: true });
})

app.patch('/updatenote/:id', jwtMiddleware,async (req, res) => {
    const id = req.params.id;
    const updatedNote = req.body.notes;
    try{
        const task=await Task.findByIdAndUpdate(id,{notes:updatedNote});
        res.json({task});

    }catch(err){
        console.log(err)
    }

})

app.patch('/updatestatus/:id',jwtMiddleware, async(req, res) => {
    const id = (req.params.id);

    try{
        const cs = await Task.findById({_id:id});
        const st=!(cs.status);
        const task=await Task.findByIdAndUpdate(id,{status: st });
        res.json(task);

    }catch(err){
        console.log(err)
    }


})



app.listen(8000, () => {
    console.log('Magic Note Server Started ');
})