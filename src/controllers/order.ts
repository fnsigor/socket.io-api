import { Order } from "../models/Order";
import { Client } from "../models/Client";
import { Pizza } from "../models/Pizza";
import { OrderStatus } from "../models/OrderStatus";
import { Request, Response } from "express";
import { EnumOrderStatus } from "../types/EnumOrderStatus";
import { changeOrderStatus } from "../utils/changeOrderStatus";


export const getAllOrders = async (req: Request, res: Response): Promise<any> => {

  try {
    
    const orders = await Order.findAll({
      include: [
        { model: Client },
        { model: Pizza },
        { model: OrderStatus }
      ],
      where: {
        clientId: req.userId
      }
    });
    return res.status(200).json({ data: orders });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch order statusses" });
  }
}

export const createOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = req.body as { pizzaId: number, quantity: number }

    if (!data.pizzaId || !data.quantity) {
      return res.status(400).json({ error: "Não é possivel criar pedido - dados incompletos" })
    }


    const pizza = await Pizza.findByPk(data.pizzaId)

    if (!pizza) {
      return res.status(400).json({ error: "Não é possivel criar pedido - verifique a pizza informada" })
    }

    const totalValue = pizza?.dataValues.price * data.quantity

    const newOrder = await Order.create({
      pizzaId: pizza?.dataValues.id,
      totalValue,
      quantity: data.quantity,
      statusId: EnumOrderStatus.PREPARANDO,
      clientId: req.userId
    })

    // Agenda a mudança de status após 1 minuto
    changeOrderStatus(newOrder)

    return res.status(201).json({ data: newOrder });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "erro ao criar pedido - tente novamente" });
  }
}
