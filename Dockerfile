FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start dev server with host binding for container access
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]
