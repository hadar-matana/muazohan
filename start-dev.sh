#!/bin/bash

echo "🚀 Starting all microservices in development mode..."

# Function to start a server
start_server() {
    local server_name=$1
    local server_path=$2
    local port=$3
    
    echo "Starting $server_name on port $port..."
    cd "$server_path" && pnpm dev &
    local pid=$!
    echo "$server_name started with PID: $pid"
    echo "$pid" > ".$server_name.pid"
}

# Start all servers
start_server "Main Server" "apps/server" "3001"
start_server "S3 Server" "apps/s3-server" "3002"
start_server "PostgreSQL Server" "apps/postgres-server" "3003"

echo ""
echo "✅ All servers started!"
echo "📊 Server Status:"
echo "   Main Server: http://localhost:3001"
echo "   S3 Server: http://localhost:3002"
echo "   PostgreSQL Server: http://localhost:3003"
echo ""
echo "🛑 To stop all servers, run: ./stop-dev.sh"
echo "📖 See MICROSERVICES_README.md for documentation"
