## AIノーコードツールのFlaskアーキテクチャ提案

### 概要

この提案は、AIノーコードツールの最小限の実装（MVP）をFlaskで構築するためのアーキテクチャです。UIは既に完成しているため、ここでは主にサーバー側の構成に焦点を当てます。

### アーキテクチャ

以下の主要コンポーネントで構成されます。

1. **Flaskアプリケーション**
2. **ノードの実装**
3. **データフローの処理**
4. **トポロジカルソート**
5. **入力データの検証**

### ディレクトリ構成

```
ai_nocode_tool/
├── app.py
├── config.py
├── requirements.txt
├── run.py
├── static/
│   ├── css/
│   ├── js/
│   └── images/
├── templates/
│   ├── index.html
│   └── ...
├── nodes/
│   ├── __init__.py
│   ├── data/
│   │   ├── load_image.py
│   │   ├── load_folder.py
│   │   └── ...
│   ├── preprocessing/
│   │   ├── histogram_equalization.py
│   │   └── ...
│   ├── models/
│   │   ├── resnet18.py
│   │   └── ...
│   └── ...
└── utils/
    ├── __init__.py
    ├── data_validator.py
    ├── flow_processor.py
    └── topological_sort.py

```

### 詳細説明

1. [**app.py**](http://app.py/)
    - Flaskアプリケーションのメインファイル。ルーティングと基本設定を行います。
    
    ```python
    from flask import Flask, request, jsonify
    from utils.flow_processor import process_flow
    
    app = Flask(__name__)
    
    @app.route('/execute', methods=['POST'])
    def execute():
        flow_data = request.json
        try:
            result = process_flow(flow_data)
            return jsonify(result), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    if __name__ == '__main__':
        app.run(debug=True)
    
    ```
    
2. [**config.py**](http://config.py/)
    - アプリケーションの設定を管理します。
    
    ```python
    import os
    
    class Config:
        SECRET_KEY = os.urandom(24)
        DEBUG = True
    
    ```
    
3. **nodes/**
    - 各種ノードの処理をPythonファイルで定義します。ノードはカテゴリごとにディレクトリを分けて管理します。
4. **utils/**
    - 補助的なユーティリティ関数やクラスを定義します。データのバリデーションやトポロジカルソートのロジックを含みます。
    - **data_validator.py**
    
    ```python
    def validate_data(input_data, expected_type):
        if not isinstance(input_data, expected_type):
            raise ValueError(f"Expected data type {expected_type}, but got {type(input_data)}")
        return True
    
    ```
    
    - **topological_sort.py**
    
    ```python
    def topological_sort(nodes, edges):
        from collections import deque
    
        indegree = {node: 0 for node in nodes}
        for edge in edges:
            indegree[edge[1]] += 1
    
        queue = deque([node for node in nodes if indegree[node] == 0])
        sorted_list = []
    
        while queue:
            node = queue.popleft()
            sorted_list.append(node)
            for edge in edges:
                if edge[0] == node:
                    indegree[edge[1]] -= 1
                    if indegree[edge[1]] == 0:
                        queue.append(edge[1])
    
        if len(sorted_list) != len(nodes):
            raise Exception("Graph has at least one cycle")
    
        return sorted_list
    
    ```
    
    - **flow_processor.py**
    
    ```python
    import importlib
    from utils.topological_sort import topological_sort
    from utils.data_validator import validate_data
    
    def process_flow(flow_data):
        nodes = flow_data['drawflow']['Home']['data']
        node_instances = {}
        edges = []
    
        for node_id, node in nodes.items():
            module_path = f"nodes.{node['class']}.{node['name']}"
            module = importlib.import_module(module_path)
            node_instances[node_id] = module.Node()
    
            for output in node['outputs']:
                for connection in node['outputs'][output]['connections']:
                    edges.append((node_id, connection['node']))
    
        sorted_node_ids = topological_sort(nodes.keys(), edges)
    
        results = {}
        for node_id in sorted_node_ids:
            node = nodes[node_id]
            node_instance = node_instances[node_id]
            input_data = {input_name: results[connection['node']] for input_name, input_info in node['inputs'].items() for connection in input_info['connections']}
    
            # Validate input data
            for input_name, input_value in input_data.items():
                validate_data(input_value, node_instance.input_types[input_name])
    
            results[node_id] = node_instance.run(input_data)
    
        return results
    
    ```
    

### 各ノードの実装例

- **nodes/data/load_image.py**
    
    ```python
    class Node:
        input_types = {}
    
        def run(self, inputs):
            # 画像を1枚読み込む処理を実装
            return loaded_image
    
    ```
    
- **nodes/models/resnet18.py**
    
    ```python
    class Node:
        input_types = {'input_1': list}  # 入力データの型を指定
    
        def run(self, inputs):
            # ResNet18モデルの処理を実装
            return model_output
    
    ```
    

### おわりに

このアーキテクチャでは、各ノードの実装を個別のPythonファイルで管理することで、拡張性とメンテナンス性を確保しています。また、トポロジカルソートを用いてデータフローの順序を決定し、各ノードの実行を行います。各ノードの入力データの型を検証することで、エラーの早期発見を目指しています。