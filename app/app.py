import logging

from flask import Flask, render_template, send_from_directory, request, abort, make_response, Response
import requests


import datetime
import json
import uuid

from flask import g
from flask_cors import CORS
from flask_cors import cross_origin
import time
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

def get_port():
    return os.environ.get("PORT", 8080) # default 8080


Post_Proxy_URL  = "/api/proxy/post"
Patch_Proxy_URL = "/api/proxy/patch"
Get_Proxy_URL   = "/api/proxy/get"


def create_app():
    logger = logging.getLogger()

    app = Flask('app')
    CORS(app)
    
    app.register_error_handler(404, page_not_found)

    @app.teardown_appcontext
    def close_connection(exception):
        logger.debug("close_connection::")
   

    ################################ app #############################

    # Routes:
    @app.route('/')
    def home():
        logger.debug("start :: home:stand_alone")
        if request.is_secure:
            protocol = "https"
        else:
            protocol = "http"

        base_url = f"{protocol}://{request.host}"
        logger.info("base_url: "+base_url)
        response = make_response(render_template(
            'KYC enabler.html',
            PROXY_POST_URL=f"{protocol}://localhost:{get_port()}{Post_Proxy_URL}",
            PROXY_PATCH_URL=f"{protocol}://localhost:{get_port()}{Patch_Proxy_URL}",
            PROXY_GET_URL=f"{protocol}://localhost:{get_port()}{Get_Proxy_URL}"
        ))
        return response

    @app.route(Post_Proxy_URL, methods=['POST'])
    def proxy_post_request():
        """Handles incoming POST requests from the client and forwards them."""
        
        # 1. Get required data from headers
        target_url = request.headers.get('X-Target-URL')
        api_key = request.headers.get('X-API-KEY')
        
        logger.info("Endpoint:")
        logger.info(target_url)
        if not target_url or not api_key:
            # Replaced jsonify with manual Response creation
            error_body = json.dumps({'error': 'Missing X-Target-URL or X-API-KEY header.'})
            logger.info("Error: Missing X-Target-URL or X-API-KEY header.")
            response = Response(
                response=error_body,
                status=400,
                mimetype='application/json'
            )
            # Apply CORS headers manually
            #for header, value in CORS_HEADERS.items():
            #    response.headers[header] = value
            return response

        # 2. Extract request body (already raw string/bytes from the client)
        request_body = request.data
        
        # 3. Prepare headers for the external request
        forward_headers = {
            'Content-Type': 'application/json',
            'X-API-KEY': api_key,
        }
        logger.info("attempting to send: ")
        logger.info(request_body)
        try:
            # 4. Execute the external PATCH request
            # We use verify=True in this production-ready context.
            external_response = requests.post(
                target_url, 
                headers=forward_headers, 
                data=request_body,
                verify=True 
            )
            logger.info("send")
            # 5. Prepare response for the client
            response = Response(
                external_response.content,
                status=external_response.status_code,
                content_type=external_response.headers.get('Content-Type', 'application/json')
            )
            logger.info("received")
            logger.info("response")
            logger.info(external_response.content)
                
            return response
            
        except requests.exceptions.RequestException as e:
            # Handle connection errors (e.g., target server down, DNS failure)
            print(f"External request error: {e}")
            # Replaced jsonify with manual Response creation
            error_body = json.dumps({'error': f'Proxy failed to connect to external API: {str(e)}'})
            response = Response(
                response=error_body,
                status=503,
                mimetype='application/json'
            )
            return response



    @app.route(Patch_Proxy_URL, methods=['PATCH'])
    def proxy_patch_request():
        """Handles incoming PATCH requests from the client and forwards them."""
        
        # 1. Get required data from headers
        target_url = request.headers.get('X-Target-URL')
        api_key = request.headers.get('X-API-KEY')
        logger.info("Endpoint:")
        logger.info(target_url)
        if not target_url or not api_key:
            # Replaced jsonify with manual Response creation
            error_body = json.dumps({'error': 'Missing X-Target-URL or X-API-KEY header.'})
            response = Response(
                response=error_body,
                status=400,
                mimetype='application/json'
            )
            # Apply CORS headers manually
            #for header, value in CORS_HEADERS.items():
            #    response.headers[header] = value
            return response

        # 2. Extract request body (already raw string/bytes from the client)
        request_body = request.data
        
        # 3. Prepare headers for the external request
        forward_headers = {
            'Content-Type': 'application/json',
            'X-API-KEY': api_key,
        }
        logger.info("attempting to send: ")
        logger.info(request_body)
        try:
            # 4. Execute the external PATCH request
            # We use verify=True in this production-ready context.
            external_response = requests.patch(
                target_url, 
                headers=forward_headers, 
                data=request_body,
                verify=True 
            )
            
            # 5. Prepare response for the client
            response = Response(
                external_response.content,
                status=external_response.status_code,
                content_type=external_response.headers.get('Content-Type', 'application/json')
            )
            
            # 6. Add CORS headers to the response sent BACK to the client (browser)
            #for header, value in CORS_HEADERS.items():
            #    response.headers[header] = value
                
            return response
            
        except requests.exceptions.RequestException as e:
            # Handle connection errors (e.g., target server down, DNS failure)
            print(f"External request error: {e}")
            # Replaced jsonify with manual Response creation
            error_body = json.dumps({'error': f'Proxy failed to connect to external API: {str(e)}'})
            response = Response(
                response=error_body,
                status=503,
                mimetype='application/json'
            )
            # Apply CORS headers manually
            #for header, value in CORS_HEADERS.items():
            #    response.headers[header] = value
            return response


    #--- GET Proxy Route  ---
    @app.route(Get_Proxy_URL, methods=['GET'])
    def proxy_get_request():
        """Handles incoming GET requests from the client and forwards them."""
        
        target_url = request.headers.get('X-Target-URL')
        api_key = request.headers.get('X-API-KEY')
        
        logger.info("Endpoint:")
        logger.info(target_url)
        if not target_url or not api_key:
            error_body = json.dumps({'error': 'Missing X-Target-URL or X-API-KEY header.'})
            response = Response(
                response=error_body,
                status=400,
                mimetype='application/json'
            )
            return response

        forward_headers = {
            'X-API-KEY': api_key,
        }
        
        # Forward all query parameters (e.g., ?query=value) from the client request
        query_params = request.args.to_dict()

        try:
            # 4. Execute the external GET request
            external_response = requests.get(
                target_url, 
                headers=forward_headers, 
                params=query_params, # Pass query parameters to the external URL
                verify=True 
            )
            
            # 5. Prepare response for the client
            response = Response(
                external_response.content,
                status=external_response.status_code,
                mimetype=external_response.headers.get('Content-Type', 'application/json')
            )
            
            # 6. Merge external response headers with our CORS headers.
            for key, value in external_response.headers.items():
                if key.lower() not in ['access-control-allow-origin', 'access-control-allow-methods', 'access-control-allow-headers', 'access-control-max-age', 'content-encoding', 'transfer-encoding']:
                    response.headers[key] = value

            return response
            
        except requests.exceptions.RequestException as e:
            print(f"External request error: {e}")
            error_body = json.dumps({'error': f'Proxy failed to connect to external API: {str(e)}'})
            
            response = Response(
                response=error_body,
                status=503,
                mimetype='application/json'
            )
            return response

    @app.route('/favicon.ico')
    def favicon():
        return send_from_directory(os.path.join(app.root_path, 'static'),
                                   'img/kyc.png')

    return app

                
def page_not_found(error):
    return render_template('error.html'), 404


if __name__ == '__main__':
    
    
    #TRACE.
    #DEBUG.
    #INFO.
    #WARN.
    #ERROR.
    #FATAL.
    ####log initializer
    now = datetime.datetime.now()
    timestamp = now.strftime("%Y-%m-%d_%H-%M-%S")
    logFilename = f"log/logfile_{timestamp}.txt"
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    ####log file
    fh = logging.FileHandler(logFilename)
    fh.setLevel(logging.INFO)
    fh.setFormatter(formatter)
    logger.addHandler(fh)
    ####log output
    sh = logging.StreamHandler()
    sh.setLevel(logging.INFO)
    sh.setFormatter(formatter)
    logger.addHandler(sh)

    web_app = create_app()
    logging.info(f"Running on http://localhost:{get_port()}")
    
    #for ssl, see https://blog.miguelgrinberg.com/post/running-your-flask-application-over-https
    #web_app.run(ssl_context=('cert.pem', 'key.pem'), debug=True, port=get_port(), host='0.0.0.0')
    #socketio.run(web_app, ssl_context=('cert.pem', 'key.pem'), debug=True, port=get_port(), host='0.0.0.0')

    ## use this for a https with a temp key:
    #web_app.run(ssl_context='adhoc', debug=True, port=get_port(), host='0.0.0.0')

    ##use this in GITPOD: (gidpod takes care of https)
    web_app.run(debug=True, port=get_port(), host='0.0.0.0')


