pid=`pgrep -f 'node /usr/local/hyt/vigserver/start.js'`

if [ -n "$pid" ]; then
    echo " stopping ..." && \
    sudo kill -9 $pid && \
    echo " stopped."
fi

