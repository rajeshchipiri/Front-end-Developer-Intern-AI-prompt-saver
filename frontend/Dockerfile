FROM node:20-slim

WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli@15

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Expose the dev server port
EXPOSE 4200

# Start Angular app on 0.0.0.0 to be accessible from host
CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]
