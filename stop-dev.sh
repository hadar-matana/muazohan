#!/bin/bash

echo "🛑 Stopping all microservices..."

# Function to stop a server
stop_server() {
    local server_name=$1
    local pid_file=".$server_name.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        echo "Stopping $server_name (PID: $pid)..."
        kill "$pid" 2>/dev/null || echo "Process already stopped"
        rm -f "$pid_file"
    else
        echo "$server_name not running"
    fi
}

# Stop all servers
stop_server "Main Server"
stop_server "S3 Server"
stop_server "PostgreSQL Server"

echo "✅ All servers stopped!"
