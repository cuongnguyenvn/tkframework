import dataloaderSequelize from 'dataloader/sequelize'
import { sequelize, DataTypes } from '../config'

const item_twitters = sequelize.define("item_twitters", {    
  type: {
    type: new DataTypes.VIRTUAL(DataTypes.STRING),
    get: () => 'ItemTwitter',      
  },    
  id          : { type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true },    
  twitter_id : DataTypes.STRING,
}, {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})

dataloaderSequelize(item_twitters)

export default item_twitters