import json


def print_beautified_json(response):
    print(json.dumps(response, indent=2))