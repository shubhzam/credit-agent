from setuptools import find_packages, setup

setup(name="agentic-trading-system",
       version="0.0.1",
       author="shubham",
       author_email="shubham.mojidra@idolizesolutions.com",
       packages=find_packages(),
       install_requires=['pinecone','langchain','langgraph']
       )