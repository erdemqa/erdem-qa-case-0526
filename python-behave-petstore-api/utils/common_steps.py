from behave import *
from jsonschema import validate, ValidationError
import requests
import jmespath
from utils.config import BASE_URL
from utils.helpers import *
import os


@step('I set URL and headers for Petstore API "{endpoint}" endpoint')
def step_impl(context,endpoint):
    context.url = BASE_URL + '/' + endpoint
    context.headers = {'accept':'application/json','Content-Type': 'application/json'}
    context.params = {}
    context.json_body = {}


@step('I set "{json_object}" to "{value}" as "{data_type}" in request body')
def step_impl(context,json_object,value,data_type):
    components = json_object.split('.')
    current = context.json_body
    if value == 'EMPTY':
        value = ""
    if value == 'SKIP':
        return
    if data_type == 'string':
        value = str(value)
    elif data_type == 'boolean':
        value = (str(value).lower() == 'true')
    elif data_type == 'string':
        value = str(value)
    else:
        if "." in value:
            value = float(value)
        else:
            value = int(value)
    if value == "NULL":
        value = None

    for comp in components:
        if '[' in comp:
            key,index = comp.split('[')
            index = int(index.replace(']',''))
            current[key] = [] if key not in current else current[key]
            if len(current[key]) <= index:
                if comp is components[-1]:
                    current[key].append(value)
                else:
                    current[key].append({})
            elif comp is components[-1]:
                current[key] = [value]
            current = current[key][index]
        else:
            current[comp] = {} if comp not in current else current[comp]
            if comp is components[-1]:
                current[comp] = value
            current = current[comp]


@step('I check json body')
def step_impl(context):
    print_beautified_json(context.json_body)


@step('I perform POST request')
def step_impl(context):
    context.response = requests.post(context.url,json=context.json_body,headers=context.headers,params=context.params)
    context.response_body = context.response.json()
    print_beautified_json(context.response_body)


@step('I perform PUT request')
def step_impl(context):
    context.response = requests.put(context.url,json=context.json_body,headers=context.headers,params=context.params)
    context.response_body = context.response.json()
    print_beautified_json(context.response_body)


@step('I perform DELETE request')
def step_impl(context):
    context.response = requests.delete(context.url,json=context.json_body,headers=context.headers,params=context.params)
    try:
        context.response_body = context.response.json()
        print_beautified_json(context.response_body)
    except requests.exceptions.JSONDecodeError:
        # Fallback value when there is no response body or if it is not valid JSON
        context.response_body = None
        print("No response body returned from the server.")


@step('I perform GET request')
def step_impl(context):
    context.response = requests.get(context.url,json=context.json_body,headers=context.headers,params=context.params)
    try:
        context.response_body = context.response.json()
        print_beautified_json(context.response_body)
    except requests.exceptions.JSONDecodeError:
        # Fallback value when there is no response body or if it is not valid JSON
        context.response_body = None
        print("No response body returned from the server.")


@step('I should see response code is "{response_code}"')
def step_impl(context,response_code):
    assert context.response.status_code == int(response_code), f"Expected {response_code}, but received {context.response.status_code }"


@step('I should see response body matches with the schema file "{schema_filename}"')
def step_impl(context, schema_filename):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    schema_path = os.path.join(base_dir, 'data','schema', schema_filename)
    try:
        with open(schema_path, 'r', encoding='utf-8') as schema_file:
            schema_data = json.load(schema_file)
    except FileNotFoundError:
        assert False, f"Schema file not found at path: {schema_path}"
    try:
        validate(instance=context.response_body, schema=schema_data)
    except ValidationError as e:
        assert False, f"Contract validation failed for {schema_filename}: {e.message} at path {list(e.path)}"


@step('I should see response contains "{expected_value}" value in "{json_path}" jmespath')
def step_impl(context, expected_value, json_path):
    if expected_value == 'SKIP':
        return
    # Ensure a response JSON body exists in the context
    assert hasattr(context, 'response_body'), "No response JSON found in context. Ensure the request step ran successfully."

    # Dynamically extract the value using the JMESPath expression
    actual_value = jmespath.search(json_path, context.response_body)

    # Convert the extracted value or objects into a string format for safe matching
    if isinstance(actual_value, (dict, list)):
        actual_str = json.dumps(actual_value)
    else:
        actual_str = str(actual_value)

    # Perform the assertion check
    assert expected_value in actual_str, \
        f"Verification failed for path '{json_path}'. Expected to find '{expected_value}', but the path contained: '{actual_str}'"


@step('I get prefilled json body from file "{filename}"')
def step_impl(context, filename):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    path = os.path.join(base_dir, 'data', 'prefilled_body', filename)
    try:
        with open(path, 'r', encoding='utf-8') as schema_file:
            context.json_body = json.load(schema_file)
    except FileNotFoundError:
        assert False, f"File not found at path: {path}"


@step('I want to check "{testReason}"')
def step_impl(context, testReason):
    return


@step('I get id value from "{json_path}" path in response body')
def step_impl(context, json_path):
    context.id_value = jmespath.search(json_path, context.response_body)
    print("Retrieved pet id = ",context.id_value)


@step('I add "{value}" value to url')
def step_impl(context,value):
    if value =='CREATED_PET_ID':
        value = context.id_value
    if value =='EMPTY':
        value = ''
    context.url = context.url +'/' + str(value)
    print("new request url = ",context.url)