module.exports = {
  apps: [
    {
      name: "TeamlogFront",
      port: "3000",
      //   exec_mode: "cluster",
      //   instances: "max",
      script: "./.output/server/index.mjs",
      env: {
        NODE_ENV: "prod",
      },
    },
  ],
};
