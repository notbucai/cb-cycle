import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import { Platform } from './Platform';

export interface PlatformConfigAttributes {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  secret?: string;
  clientId?: string;
  loginUrl?: string;
  downloadRepoUrl?: string;
  contentsUrl?: string;
  reposUrl?: string;
  type?: string;
  branchesUrl?: string;
  userinfoUrl?: string;
  webhookUrl?: string;
  platform?: Platform;
}

export type PlatformConfigPk = 'id';
export type PlatformConfigId = PlatformConfig[PlatformConfigPk];
export type PlatformConfigOptionalAttributes = 'id' | 'userinfoUrl' | 'createdAt' | 'updatedAt' | 'platform' | 'secret' | 'webhookUrl' | 'clientId' | 'reposUrl' | 'loginUrl' | 'downloadRepoUrl' | 'type';
export type PlatformConfigCreationAttributes = Optional<PlatformConfigAttributes, PlatformConfigOptionalAttributes>;

export class PlatformConfig extends Model<PlatformConfigAttributes, PlatformConfigCreationAttributes> implements PlatformConfigAttributes {
  id!: string;
  createdAt?: Date;
  updatedAt?: Date;
  secret?: string;
  clientId?: string;
  loginUrl?: string;
  webhookUrl?: string;
  reposUrl?: string;
  downloadRepoUrl?: string;
  userinfoUrl?: string;
  type?: string;
  branchesUrl?: string;
  contentsUrl?: string;
  platform?: Platform;


  static initModel(sequelize: Sequelize.Sequelize): typeof PlatformConfig {
    return sequelize.define('PlatformConfig', {
      id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      secret: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      icon: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      clientId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'client_id'
      },
      loginUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'login_url'
      },
      reposUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'repos_url'
      },
      webhookUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'webhook_url'
      },
      branchesUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'branches_url'
      },
      downloadRepoUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'download_repo_url'
      },
      contentsUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'contents_url'
      },
      userinfoUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'userinfo_url'
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    }, {
      tableName: 'platform_config',
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
      ]
    }) as typeof PlatformConfig;
  }
}
