FROM mcr.microsoft.com/devcontainers/javascript-node:20-bookworm

# Set the working directory
WORKDIR /workspaces/js-algorithms

# Ensure the vscode user owns the workspace
RUN chown -R node /workspaces/js-algorithms

USER node