import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const ModelName = "Patient"

const Model = sequelize.define(ModelName, {
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  gender: { type: DataTypes.STRING, allowNull: false },
  history: { type: DataTypes.TEXT },
  symptoms: { type: DataTypes.TEXT },
  additionalInfo: { type: DataTypes.TEXT },
  initialPrompt: { type: DataTypes.TEXT },
});

export default Model;
