thin stop
rm -rf tmp/pids/thin.pid
thin start -d "$@"
