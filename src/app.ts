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

      // Handle socket disconnect
      socket.on('disconnect', () => {
        for (const userId in this.userSockets) {
          if (this.userSockets[userId] === socket.id) {
            delete this.userSockets[userId]
            break
          }
        }
      })

      // Handle user registration
      socket.on('register', (userId: string) => {
        console.log(`user ${userId} salvo em memória`)
        this.userSockets[userId] = socket.id
        socket.join(userId)
      })
    })

    // Setup event emitter for table updates
    this.eventEmitter.on("update-table", (userId: string) => {
      this.socketIo.to(userId).emit("update-table", {
        message: "pedido atualizado"
      })
      console.log(`pedido do user ${userId} atualizado`)
    })
  }
}

export default App
