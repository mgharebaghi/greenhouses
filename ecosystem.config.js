module.exports = {
    apps: [
        {
            name: "green-house-demo",
            script: "npm",
            args: "start",
            instances: 1, // Only run 1 instance to save memory
            autorestart: true,
            watch: false,
            max_memory_restart: "1G", // Restart if it exceeds 1GB RAM
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
