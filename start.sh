#!/usr/bin/env bash
export FLASK_DEBUG=1
python3 -m venv venv
. venv/bin/activate
python3 app/app.py
