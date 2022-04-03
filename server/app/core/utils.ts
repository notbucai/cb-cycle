export const ipAddress = {
  getUsableIp (gateway: string, useIps: string[]) {
    const gs = gateway.split('.').map(item => parseInt(item));
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (gs[3] === 0) {
        gs[3] = 1;
      }
      const end = gs[3]++;
      if (end > 255) {
        gs[2]++;
        gs[3] = 1;
      }
      if (gs[2] === 255) throw new Error('无可用ip');
      const ip = gs.join('.');
      if (!useIps.includes(ip)) {
        return ip;
      }
    }
  },
  getSubnet (useIps: string[]) {
    const gateway = '172.40.0.0';
    const gs = gateway.split('.').map(item => parseInt(item));
    // eslint-disable-next-line no-constant-condition
    while (true) {
      gs[2]++;
      if (gs[2] > 255) {
        gs[1]++;
        gs[2] = 1;
      }
      if (gs[1] === 255) throw new Error('无可用网段');
      const ip = gs.join('.');
      if (!useIps.includes(ip)) {
        return ip;
      }
    }
  }

};
