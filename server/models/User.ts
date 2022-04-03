import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface UserAttributes {
  id: string;
  nickname?: string;
  password?: string;
  avatar?: string;
  email: string;
  gateway: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserPk = 'id';
export type UserId = User[UserPk];
export type UserOptionalAttributes = 'id' | 'gateway' | 'nickname' | 'password' | 'avatar' | 'createdAt' | 'updatedAt';
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  id!: string;
  nickname?: string;
  password?: string;
  avatar?: string;
  gateway!: string;
  email!: string;
  createdAt?: Date;
  updatedAt?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return sequelize.define('User', {
      id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      nickname: {
        type: DataTypes.STRING(128),
        allowNull: true,
        comment: '昵称'
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '密码'
      },
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '头像'
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        comment: '邮箱',
        unique: 'email_uniqe'
      }
    }, {
      tableName: 'user',
      timestamps: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [
            { name: 'id' },
          ]
        },
        {
          name: 'email_uniqe',
          unique: true,
          using: 'BTREE',
          fields: [
            { name: 'email' },
          ]
        },
      ]
    }) as typeof User;
  }
}
