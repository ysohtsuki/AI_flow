import importlib
import traceback
from flask import Flask, render_template, request, jsonify

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
        module_path = f"block.{block_type}.{block_class}.{block_class}"
        # print("module_path",module_path)
        module = importlib.import_module(module_path)
        klass = getattr(module, block_class)
        print("import:",block_class)
        return klass(block_params)
        # return klass(**block_params)

    def run_tasks(self, task_list):
        """タスクリストの処理を順次実行するメソッド。
        Args:
            task_list (list): タスクのリスト。各タスクは辞書形式で、"type", "class", "params" のキーを持つ。
        Returns:
            None
        """
        input_data = None
        data = []
        block_list={}
        try:
            for task in task_list:
                task_id = task["id"]     # タスクのid
                previous_outputs = task["previous_outputs"] # 前のノードとの接続
                inputs_type = task["inputs_type"] # 入力のデータ型
                next_inputs = task["next_inputs"] # 次のノードとの接続
                outputs_type = task["outputs_type"] # 出力のデータ型
                block_type = task["category"]     # タスクのカテゴリー
                class_name = task["class"]     # タスクのクラス名
                params = task["params"]     # タスクのパラメータ
                # print("outputs_number",outputs_number,outputs)

                # インスタンスの作成
                block = self.load_block(block_type, class_name, params)
                block.inputs_type = inputs_type # 入力の正しいデータ型
                block.outputs_type = outputs_type # 出力の正しいデータ型
                block.temporary_initial_value(len(inputs_type)) # 仮で初期値を設定(すべてNone)
                # block.next_inputs = next_inputs

                input_types = []  # これからinputするデータ型
                input_indexes = []
                # 前のblockのnext_inputs_numberを取得
                if previous_outputs != [None]:
                    # 入力のインデックスが小さい順にソート
                    sorted_paired_outputs = sorted(previous_outputs, key=lambda x: x["input_index"])
                    # 入力を設定
                    for entry in sorted_paired_outputs:
                        input_index = entry["input_index"] # 入力のインデックス
                        output_id = entry["previous_output_node"] # 前のノード
                        output_index = entry["previous_output_index"] # 前のノードの出力のインデックス
                        if output_id in block_list:
                            block.input[input_index] = block_list[output_id].output[output_index]
                            input_types.append(block_list[output_id].outputs_type[output_index]["type"])
                            input_indexes.append(input_index)
                
                # 入力の型チェック
                block.validate_input(input_types,input_indexes)

                result = block.run()
                if result["status"] == "error":
                    return result

                block_list[task_id]=block
                if block.get_data():
                    data.append(block.get_data())
                # print("block_output",block.output)

            print("All tasks completed successfully.")
            return {"status": "success", "data": data}
        except Exception as error:
            print(f"Error occurred during task execution: {error}")
            print(traceback.format_exc())
            return {"status": "error","message": str(error)}
