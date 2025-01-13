import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Client } from "./Client";
import { Pizza } from "./Pizza";
import { OrderStatus } from "./OrderStatus";

interface OrderAttributes {
  id?: number;
  totalValue: number;
  quantity: number;
  statusId: number;
  clientId: number;
  pizzaId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order extends Model<OrderAttributes> implements OrderAttributes {
  public id?: number;
  public totalValue!: number;
  public quantity!: number;
  public statusId!: number;
  public clientId!: number;
  public pizzaId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    totalValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OrderStatus, // Modelo relacionado
        key: "id", // Coluna no modelo relacionado
      },
      onDelete: "CASCADE", // Opção para deletar registros filhos automaticamente
      onUpdate: "CASCADE", // Atualiza chaves estrangeiras automaticamente
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    pizzaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Pizza,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Order",
  }
);

// Associações
Order.belongsTo(Client, { foreignKey: "clientId" });
Order.belongsTo(Pizza, { foreignKey: "pizzaId" });
Order.belongsTo(OrderStatus, { foreignKey: "statusId" });
Client.hasMany(Order, { foreignKey: "clientId" });
Pizza.hasMany(Order, { foreignKey: "pizzaId" });
OrderStatus.hasMany(Order, { foreignKey: "statusId" });
