import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
const SOCKET_URL = "http://localhost:8080";
// const SOCKET_URL =
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:8080";
let socket: Socket = null!;
export const initSocket = () => {
  socket = io(SOCKET_URL, {
    //full options in here: https://socket.io/docs/v4/client-options/
  }); //io() if socket server is in same domain ,
  //this line will make a connection to socket server
  //will execute 2 times , one on server and one in browser so we init 2 socket per user
  //we should init one socket in whole application and only work with that one socket
  //for only execute on client --> useEffect
};
export default socket;
