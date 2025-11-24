/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'nestjs-crud-starter',
      // removal: input?.stage === 'production' ? 'retain' : 'remove',
      removal: 'remove',
      // protect: ['production'].includes(input?.stage),
      home: 'aws',
      providers: {
        aws: {
          region: 'us-east-1',
        }
      }
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc('MyVpc');
    const cluster = new sst.aws.Cluster('MyCluster', { vpc });
    const bucket = new sst.aws.Bucket('MyBucket');

    new sst.aws.Service('MyService', {
      cluster,
      link: [bucket],
      loadBalancer: {
        ports: [{ listen: '80/http', forward: '3000/http' }],
      },
      dev: {
        command: 'npm run start:dev',
      },
    });
  },
});
