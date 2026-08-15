
from pathlib import Path


basePath = Path(r"C:\Users\patde\Me\coding\dial-bean\frontend\src")


source_files = list(basePath.glob("**/*.ts*"))


total_lines = 0
total_code_lines = 0

for file in source_files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.readlines()
    total_lines += len(content)
    code_lines = [line for line in content if line.strip() and not line.strip().startswith("//")]
    total_code_lines += len(code_lines)


print(f"Total lines: {total_lines}")
print(f"Total code lines: {total_code_lines}")