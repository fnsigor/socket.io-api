import express from "express"
import { createServer, Server } from "http";
import { Server as IO } from "socket.io";
import { EventEmitter } from "stream";

class App {
  private static instance: App;
  public expressInstance: express.Application
  public server: Server
  private socketIo: IO
  private userSockets: any
  public eventEmitter: EventEmitter

  private constructor() {
    this.expressInstance = express()
    this.server = createServer(this.expressInstance)
    this.eventEmitter = new EventEmitter()
    this.eventEmitter.setMaxListeners(20)
    this.userSockets = {}
    this.socketIo = new IO(this.server, {
      cors: {
        origin: "*"
      }
    })
    this.setupSocketHandlers()
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App()
    }
    return App.instance
  }

  private setupSocketHandlers() {
    // Remove existing listeners to prevent duplicates
    this.socketIo.removeAllListeners('connection')
    this.eventEmitter.removeAllListeners('update-table')

    this.socketIo.on('connection', (socket) => {
      console.log('Usuário conectado:', socket.id)

      // Handle socket disconnect
      socket.on('disconnect', () => {
        console.log("\n usuário desconectado \n")
        for (const userId in this.userSockets) {
          if (this.userSockets[userId] === socket.id) {
            delete this.userSockets[userId]
            break
          }
        }
      })

      // Handle user registration
      socket.on('register', (userId) => {
        console.log("\n\n\n usuario salvo em memória \n\n\n", userId)
        this.userSockets[userId] = socket.id
        socket.join(userId.toString())
      })
    })

    // Setup event emitter for table updates
    this.eventEmitter.on("update-table", (userId: number) => {
      console.log("\n pediu pra att table do user " + userId + "\n")
      this.socketIo.to(userId.toString()).emit("update-table", {
        message: "pedido atualizado"
      })
    })
  }
}

export default App
