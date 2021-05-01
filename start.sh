#!/bin/bash


sudo docker-compose down
sudo rm -rf __container_caches kigs

sudo docker-compose up --force-recreate --build