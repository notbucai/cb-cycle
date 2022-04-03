import { Service } from 'egg';
import { docker } from '../core/docker';
import { ipAddress } from '../core/utils';

/**
 * User Service
 */
export default class User extends Service {

  async login (email: string) {
    const res = await this.app.model.User.findOrCreate({
      where: {
        email
      },
      defaults: {
        nickname: email.replace(/@(.*?)$/, ''),
        email,
      }
    });
    if (res[1]) {
      const networkList = await docker.listNetworks();
      const ips = networkList.reduce<string[]>((pv, item) => {
        if (Array.isArray(item.IPAM?.Config) && item.IPAM?.Config?.length) {
          item.IPAM?.Config.forEach(_item => {
            const ip = _item.Subnet.split('/')[0];
            pv.push(ip);
          });
        }
        return pv;
      }, []);
      // console.log('ips', ips);
      const ip = ipAddress.getSubnet(ips);
      // 创建网关
      const _res = await docker.createNetwork({
        Name: res[0].id + '-network',
        IPAM: {
          Driver: 'default',
          Config: [
            {
              Subnet: `${ip}/24`,
            }
          ]
        }
      });
      console.log('_res', _res);
    }
    return res[0].get('id') as string;
  }

}
