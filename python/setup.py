from setuptools import setup, find_packages

# readme = open('README', 'r')
# README_TEXT = readme.read()
# readme.close()

setup(
    name="stdogviz",
    version="0.0.1",
    packages=find_packages(exclude=["build", ]),
    scripts=["stdogviz/bin/stdogviz"],
    # long_description=README_TEXT,
    install_requires=[
        "Flask", "python-igraph", "flask-socketio",
        "python-socketio[client]", "numpy", "Pillow"
    ],
    include_package_data=True,
    license="MIT",
    description="",
    author="Bruno Messias",
    author_email="messias.physics@gmail.com",
    download_url="https://github.com/.../.../archive/0.4.0.tar.gz",
    keywords=[ "science",],

    classifiers=[
        "Development Status :: 4 - Beta",
        "License :: OSI Approved :: MIT License",
        "Intended Audience :: Science/Research",
        "Programming Language :: Python",
        # TODO: CHANGE THAT
        "Topic :: Text Processing :: Markup :: LaTeX",
    ],
    url="https://github.com/devmessias/stdogviz"
)
