import { Order } from "../models/Order";

export async function changeOrderStatus(order: Order) {
  try {
    console.log('executando mudança de status da order id', order.id)
    await order.update({ statusId: Math.random() < 0.5 ? 2 : 3 });
  } catch (error) {
    console.error(`Erro ao atualizar status da order ${order.id}:`, error);
  }
}