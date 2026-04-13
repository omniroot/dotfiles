#!/bin/bash

case "$1" in
    --battery)
        sudo ryzenadj \
        --stapm-limit=15000 \
        --slow-limit=16000 \
        --fast-limit=20000 \
        --stapm-time=200 \
        --slow-time=200 \
        --vrm-current=22000 \
        --vrmmax-current=35000 \
        --tctl-temp=70
        
        sudo cpupower frequency-set -u 2.7GHz
        echo balance_power | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/energy_performance_preference
        echo "Battery silent profile enabled"
    ;;
    
    --performance)
        sudo ryzenadj \
        --stapm-limit=30000 \
        --slow-limit=35000 \
        --fast-limit=40000 \
        --vrm-current=50000 \
        --vrmmax-current=80000 \
        --tctl-temp=90
        
        sudo cpupower frequency-set -u 4.2GHz
        echo balance_performance | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/energy_performance_preference
        
        echo "Performance profile enabled"
    ;;
    
    *)
        echo "Usage: $0 --battery | --performance"
    ;;
esac
