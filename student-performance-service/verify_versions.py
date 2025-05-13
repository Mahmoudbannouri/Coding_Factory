import sklearn
import numpy
import sys

required_versions = {
    'scikit-learn': '1.6.1',
    'numpy': '1.26.4'
}

current_versions = {
    'scikit-learn': sklearn.__version__,
    'numpy': numpy.__version__
}

mismatch = False
for pkg, ver in required_versions.items():
    if current_versions[pkg] != ver:
        print(f"VERSION MISMATCH: {pkg} requires {ver} but found {current_versions[pkg]}", file=sys.stderr)
        mismatch = True

if mismatch:
    sys.exit(1)

print("All package versions match requirements")