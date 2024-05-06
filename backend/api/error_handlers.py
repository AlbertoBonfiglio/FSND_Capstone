from flask import jsonify

# @app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "error": str(error),
        "message": "Not found"
    }), 404


def internal_error(error: Exception):
    return jsonify({
        "success": False,
        "error": error.args[0],
        "message": "Internal Server Error"
    }), 500


def integrity_error(error: Exception):
    return jsonify({
        "success": False,
        "error": error.args[0],
        "message": "Data Consistency Error"
    }), 409


def unprocessable_error(error: Exception):
    return jsonify({
        "success": False,
        "error": error.args[0],
        "message": "Missing data"
    }), 422
