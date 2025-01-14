import { Order } from "../models/Order";
import App from "../app";

const { eventEmitter } = App.getInstance()

export function changeOrderStatus(order: Order) {
  setTimeout(() => {
    try {
      order.update({ statusId: Math.random() < 0.5 ? 2 : 3 });
      eventEmitter.emit("update-table", order.clientId)
      console.log('emitiu evento node')
    } catch (error) {
      console.error(`Erro ao atualizar status da order ${order.id}:`, error);
    }
  }, 1000 * 5);
}