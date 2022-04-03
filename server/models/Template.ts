import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface TemplateAttributes {
  id: string;
  name: string;
  icon?: string;
  type?: string;
  path?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isBuild?: number;
  isRun?: number;
  isStructure?: number;
}

export type TemplatePk = 'id';
export type TemplateId = Template[TemplatePk];
export type TemplateOptionalAttributes = 'id' | 'icon' | 'type' | 'path' | 'createdAt' | 'updatedAt' | 'isBuild' | 'isRun' | 'isStructure';
export type TemplateCreationAttributes = Optional<TemplateAttributes, TemplateOptionalAttributes>;

export class Template extends Model<TemplateAttributes, TemplateCreationAttributes> implements TemplateAttributes {
  id!: string;
  name!: string;
  icon?: string;
  type?: string;
  path?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isBuild?: number;
  isRun?: number;
  isStructure?: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof Template {
    return sequelize.define('Template', {
      id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      icon: {
        type: DataTypes.STRING(128),
        allowNull: true
      },
      type: {
        type: DataTypes.STRING(36),
        allowNull: true,
        comment: 'web \/ service'
      },
      path: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '模版文件位置'
      },
      isBuild: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: 0,
        comment: '是否需要编译0\/1',
        field: 'is_build'
      },
      isRun: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: 0,
        comment: '是否需要运行 0\/1',
        field: 'is_run'
      },
      isStructure: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '是否需要构建',
        field: 'is_structure'
      }
    }, {
      tableName: 'template',
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
    }) as typeof Template;
  }
}
