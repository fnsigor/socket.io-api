import { Router, Request, Response } from "express";
import { Client } from "./models/Client";
import { Pizza } from "./models/Pizza";
import { OrderStatus } from "./models/OrderStatus";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./middleware";
import dotenv from 'dotenv';
import { createOrder, getAllOrders } from "./controllers/order";



dotenv.config();

const router = Router();






router.post("/login", async (req: Request, res: Response): Promise<void> => {
 console.log("bateu")
  const { email, password } = req.body;

  // Verifica se email e senha foram fornecidos
  if (!email || !password) {
    res.status(400).json({ error: "Email e senha são obrigatórios." });
    return;
  }

  try {
    // Consulta o banco pelo email
    const user = await Client.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    // Verifica a senha
    const passwordMatch = password.trim() === user.dataValues.password;
    if (!passwordMatch) {
      res.status(401).json({ error: "Senha incorreta." });
      return;
    } 

    const token = jwt.sign({ id: user.dataValues.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });


    // Remove a senha antes de retornar os dados
    const data = {
      id: user.dataValues.id,
      name: user.dataValues.name,
      email: user.dataValues.email,
      token,
    }

    res.status(200).json({ data });
    return;
  } catch (error) {
    console.log("login error", error);
    res.status(500).json({ error: "Erro interno no servidor." });
    return
  }
})



// ========================= CLIENTE
router.post("/client", async (req: Request, res: Response): Promise<any> => {
  try {
    const clientData = req.body as { email?: string, name?: string, password?: string }

    if (!clientData.email || !clientData.name || !clientData.password) {
      return res.status(400).json({ error: "Não é possivel criar usuário - dados incompletos" })
    }


    const clientByEmail = await Client.findAll({
      where: {
        email: clientData.email?.trim()
      }
    })

    if (clientByEmail.length > 0) {
      return res.status(400).json({ error: "Não é possivel criar usuário - email já cadastrado" })
    }

    const newClient = await Client.create({ email: clientData.email, name: clientData.name, password: clientData.password });
    return res.status(201).json({ data: newClient });
  } catch (error) {
    return res.status(500).json({ error: "erro ao criar usuário - tente novamente" });
  }
});

router.get("/client", async (req: Request, res: Response): Promise<any> => {
  try {
    const clients = await Client.findAll();
    return res.status(200).json({ data: clients });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch clients" });
  }
});




// ========================= PIZZA
router.post("/pizza", async (req: Request, res: Response): Promise<any> => {
  try {
    const data = req.body as { name?: string, price?: number }

    if (!data.price || !data.name) {
      return res.status(400).json({ error: "Não é possivel criar pizza - dados incompletos" })
    }


    const pizzaByName = await Pizza.findAll({
      where: {
        name: data.name?.trim()
      }
    })

    if (pizzaByName.length > 0) {
      return res.status(400).json({ error: "Não é possivel pizza - sabor já cadastrado" })
    }

    const newPizza = await Pizza.create({ name: data.name, price: data.price });
    return res.status(201).json({ data: newPizza });
  } catch (error) {
    return res.status(500).json({ error: "erro ao criar pizza - tente novamente" });
  }
});


router.get("/pizza", authenticateToken, async (req: Request, res: Response): Promise<any> => {
  try {
    const pizzas = await Pizza.findAll();
    return res.status(200).json({ data: pizzas });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch pizzas" });
  }
});
export default router;




// ========================= OrderStatus


router.post("/order-status", async (req: Request, res: Response): Promise<any> => {
  try {
    const data = req.body as { name?: string }

    if (!data.name) {
      return res.status(400).json({ error: "Não é possivel criar status - dados incompletos" })
    }


    const orderByName = await OrderStatus.findAll({
      where: {
        name: data.name?.trim()
      }
    })

    if (orderByName.length > 0) {
      return res.status(400).json({ error: "Não é possivel status - status já cadastrado" })
    }

    const newOrder = await OrderStatus.create({ name: data.name });
    return res.status(201).json({ data: newOrder });
  } catch (error) {
    return res.status(500).json({ error: "erro ao criar status - tente novamente" });
  }
});

router.get("/order-status", authenticateToken, async (req: Request, res: Response): Promise<any> => {
  try {
    const statusses = await OrderStatus.findAll();
    return res.status(200).json({ data: statusses });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch order statusses" });
  }
});



// ========================= Order
router.post("/order", authenticateToken, createOrder);
router.get("/order", authenticateToken, getAllOrders);
