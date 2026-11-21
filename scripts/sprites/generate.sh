#!/bin/sh
# Пиксел арт зургуудыг дахин үүсгэх: sh scripts/sprites/generate.sh
cd "$(dirname "$0")" && python3 props.py ../../assets/sprites && python3 horse.py ../../assets/sprites
