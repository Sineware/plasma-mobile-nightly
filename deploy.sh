#!/usr/bin/env bash
USER=swadmin
HOST=192.168.11.88
PORT=2222
DIR=/home/$USER/plasma-mobile-nightly

rsync -e "ssh -p ${PORT}" -avz --delete --exclude "node_modules" --exclude "workdir" . ${USER}@${HOST}:${DIR}

exit 0