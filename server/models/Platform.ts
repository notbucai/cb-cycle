import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { PlatformConfig } from './PlatformConfig';

export interface PlatformAttributes {
  id: string;
  userId: string;
  token: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  scope?: string;
  tokenType?: string;
  platformConfig?: PlatformConfig;
  platformConfigId: string;
  rUser?: string;
}

export type PlatformPk = 'id';
export type PlatformId = Platform[PlatformPk];
export type PlatformOptionalAttributes = 'id' | 'refreshToken' | 'platformConfig' | 'createdAt' | 'updatedAt' | 'scope' | 'tokenType';
export type PlatformCreationAttributes = Optional<PlatformAttributes, PlatformOptionalAttributes>;

export class Platform extends Model<PlatformAttributes, PlatformCreationAttributes> implements PlatformAttributes {
  id!: string;
  userId!: string;
  token!: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  scope?: string;
  tokenType?: string;
  platformConfig?: PlatformConfig;
  platformConfigId!: string;
  rUser?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof Platform {
    return sequelize.define('Platform', {
      id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        field: 'user_id'
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      refreshToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'refresh_token'
      },
      scope: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      tokenType: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'token_type'
      },
      rUser: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'r_user'
      },
      platformConfigId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        field: 'platform_config_id'
      }
    }, {
      tableName: 'platform',
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
          name: 'type_and_user_id_01',
          using: 'BTREE',
          fields: [
            { name: 'user_id' },
          ]
        },
        {
          name: 'platform_id_on_config_id',
          using: 'BTREE',
          fields: [
            { name: 'platform_config_id' },
          ]
        },
      ]
    }) as typeof Platform;
  }
}
