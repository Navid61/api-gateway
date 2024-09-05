import express, { Request, Response } from "express";
// import { getUserData, saveUser } from './grpc_client.js';
import {getGeoUserData} from './grpc_geo_client.js';


const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});


/** Beging of connection between api-gatewaty and user-account */

// Route to get user data
// app.get("/user/:id", async (req: Request, res: Response) => {
//   const userId = req.params.id;
//   try {
//     const response = await getUserData(userId);
//     res.json(response);
//   } catch (error) {
//     if(error instanceof Error)
//     res.status(500).json({ error: error.message });
//   }
// });

// // Route to save user data
// app.post("/user", async (req: Request, res: Response) => {
//   const { name, age } = req.body;
//   try {
//     const response = await saveUser(name, age);
//     res.json(response);
//   } catch (error) {
//     if(error instanceof Error)
//     res.status(500).json({ error: error.message });
//   }
// });

/** End of connection between api-gatewaty and user-account */

// geomap

// Route to get user data
// app.get('/geo/:id', async (req: Request, res: Response) => {
//   const userId = req.params.id;
//   try {
//     const response = await getGeoUserData(userId);
//     res.json(response);
//   } catch (error) {
//     if (error instanceof Error)
//     res.status(500).json({ error: error.message });
//   }
// });

interface userIdtype {
  userId:string;
}
app.post('/geo', async (req: Request, res: Response) => {


  const {userId}:userIdtype = req.body;
  console.log('userId ', userId);
  try {
    const response = await getGeoUserData(userId);
    res.json(response);
  } catch (error) {
    if (error instanceof Error)
    res.status(500).json({ error: error.message });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



export default app