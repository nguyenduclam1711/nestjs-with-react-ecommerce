#!/bin/bash

cd ./backend || exit

echo "========================"
echo "pnpm install for backend"
echo "========================"
pnpm install

cd ../frontend || exit

echo "========================"
echo "pnpm install for frontend"
echo "========================"
pnpm install
