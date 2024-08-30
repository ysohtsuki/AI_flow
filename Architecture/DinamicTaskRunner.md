以下に、ディレクトリ構造を含めたコードスニペットを示します。`importlib` を使用して、指定されたディレクトリ構造に基づいてモジュールを動的にインポートします。

```python
import importlib

class DynamicTaskRunner:
    def load_block(self, block_type, block_class, block_params):
        """指定されたブロックを動的にインポートし、インスタンスを返す関数。
        Args:
            block_type (str): ブロックの種類（例: "data", "model", "loss", "optimizer" など）
            block_class (str): クラス名
            block_params (dict): クラスのパラメータ
        Returns:
            object: インポートされたクラスのインスタンス
        """
        module_path = f"blocks.{block_type.lower()}.{block_class.lower()}.{block_class}"
        module = importlib.import_module(module_path)
        klass = getattr(module, block_class)
        return klass(**block_params)

    def run_tasks(self, task_list):
        """タスクリストの処理を順次実行するメソッド。
        Args:
            task_list (list): タスクのリスト。各タスクは辞書形式で、"type", "class", "params" のキーを持つ。
        Returns:
            None
        """
        input_data = None
        try:
            for task in task_list:
                block_type = task["type"]
                class_name = task["class"]
                params = task["params"]

                block = self.load_block(block_type, class_name, params)
                input_data = block.run(input_data)

            print("All tasks completed successfully.")
        except Exception as error:
            print(f"Error occurred during task execution: {error}")

# 使用例
if __name__ == "__main__":
    task_runner = DynamicTaskRunner()

    task_list = [
        {"type": "data", "class": "MyDataClass", "params": {"param1": "value1"}},
        {"type": "model", "class": "MyModelClass", "params": {"param2": "value2"}},
        # 追加のタスクをここに追加
    ]

    task_runner.run_tasks(task_list)
```

### ディレクトリ構造例

```
project_root/
│
├── main.py  # 上記のコードが含まれるファイル
└── blocks/
    ├── data/
    │   └── mydataclass/
    │       └── MyDataClass.py  # MyDataClass クラスを定義するモジュール
    ├── model/
    │   └── mymodelclass/
    │       └── MyModelClass.py  # MyModelClass クラスを定義するモジュール
    └── ...  # 他のブロックタイプやクラスが続く
```

### 説明

1. **`DynamicTaskRunner` クラス**:
   - `load_block` メソッド: 指定されたブロックタイプとクラスに基づいてモジュールを動的にインポートし、クラスをインスタンス化します。
   - `run_tasks` メソッド: タスクリストを順次処理し、各ブロックを実行します。

2. **使用例**:
   - `if __name__ == "__main__":` ブロック内で `DynamicTaskRunner` を初期化し、タスクリストを定義します。
   - `run_tasks` メソッドを呼び出してタスクを実行します。
   - 実際は`app.py`などの、実際の処理を行うファイルから呼び出します。
3. **ディレクトリ構造**:
   - `blocks/` ディレクトリ内に、各ブロックタイプ (`data`, `model` など) のサブディレクトリがあります。
   - 各サブディレクトリ内には、さらにクラス名に対応するサブディレクトリがあり、その中にクラス定義を含む Python ファイルがあります。

このスニペットは、指定されたディレクトリ構造に基づいてモジュールを動的にインポートし、順次タスクを実行する方法を示しています。