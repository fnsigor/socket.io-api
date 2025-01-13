import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class OrderStatus extends Model {}
OrderStatus.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "OrderStatus",
  }
);
