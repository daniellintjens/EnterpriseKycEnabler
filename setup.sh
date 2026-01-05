#!/usr/bin/env bash
mkdir -p log
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
