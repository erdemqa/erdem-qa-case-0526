from behave.__main__ import main

if __name__ == "__main__":
    main([
        "--paths=features",
        "--define", "steps_dir=steps",
    ])