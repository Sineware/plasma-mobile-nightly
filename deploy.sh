#!/usr/bin/env bash
USER=swadmin
#HOST=192.168.11.86
HOST=140.238.158.18
PORT=2222
DIR=/home/$USER/plasma-mobile-nightly

rsync -e "ssh -p ${PORT}" -avz --delete --exclude ".git" --exclude "node_modules" --exclude "workdir" . ${USER}@${HOST}:${DIR}

exit 0