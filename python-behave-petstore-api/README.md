# Petstore API Test Automation

## Installation

```bash
pip install -r requirements.txt
```

## Run Tests
Some scenarios are tagged with 'todo' tag. they are only added to show coverage without fine tuning the step definitions
```bash
behave --tags=pet
```

In case of running only contract related scenarios for faster results, 'contract' tag tests may be run

```bash
behave --tags=contract
```
