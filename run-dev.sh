#!/bin/bash

set -e
./run-dev-backend.sh &
./run-dev-frontend.sh
