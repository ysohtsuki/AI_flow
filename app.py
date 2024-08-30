from flask import Flask, render_template, request, jsonify
import json
import os
from topological_sort import topological_sort
from DynamicTaskRunner import DynamicTaskRunner

app = Flask(__name__)

@app.route("/", methods=["GET"])
def main_page():
    return render_template('index.html')

@app.route("/run", methods=["POST"])
def run():
    data = request.json
    flow = data["drawflow"]["Home"]["data"]
    # print(flow["2"]["inputs_type"])

    edges = set()     # エッジが重複しないように
    
    #edgeを抽出
    for node_id, node in flow.items():
        # Inputが存在しない場合、Noneに接続
        if not node['inputs']:
            edges.add((None, node_id))
        else:
            for input_key, input_value in node['inputs'].items():
                for connection in input_value['connections']:
                    edges.add((connection['node'], node_id))

        # Outputが存在しない場合、Noneに接続
        if not node['outputs']:
            edges.add((node_id, None))
        else:
            for output_key, output_value in node['outputs'].items():
                for connection in output_value['connections']:
                    edges.add((node_id, connection['node']))

    # Setをリストに変換
    edges = list(edges)

    # edgesをソート
    print("edge",edges)
    sorted = topological_sort(edges)
    print("result", sorted)

    # ソート結果に従って処理する順番を決める
    task_list = []
    for i in sorted:
        # previous_output_node = [] # 前のアウトプットのノード
        # previous_output_index = [] # #前のアウトプットのノードのインデックス
        previous_outputs = [] # 前のアウトプットとの接続情報
        # next_input_node = []
        # next_input_index = []
        next_inputs = [] # 後のインプットとの接続情報
        node_id = i # 今のノードのID
        node = flow[i] # 今のノードの情報
        # print(node)
        print(i)

        # エッジから接続を探す
        for edge in edges:
            # 後のインプットとの接続
            if edge[0] == i:
                number = []
                # next_input_node.append(edge[1])
                # 後のインプットとの接続を取得   
                for input_key,next_input_value in flow[i]['outputs'].items():
                    if next_input_value["connections"]: # 接続がある場合(接続がないときは無視)
                        for next_input_value1 in next_input_value["connections"]:
                            if next_input_value1["node"] == edge[1]:
                                n = int(next_input_value1["output"].split('_')[1]) - 1
                                number.append(n)
                                # next_input_index.append(number)
                                next_inputs.append({
                                    "output": int(input_key.split('_')[1])-1,
                                    "next_input_node": edge[1],
                                    "next_input_index": n
                                    })                            
            
            # 前のアウトプットとの接続
            if edge[1] == i:
                # previous_output_node.append(edge[0])
                # 前のアウトプットとの接続を取得   
                for output_key, previous_output_value in flow[i]['inputs'].items():
                    if previous_output_value["connections"]: # 接続がある場合(接続がないときは無視)
                        for previous_output_value1 in previous_output_value["connections"]:
                            if previous_output_value1["node"] == edge[0]:
                                n = int(previous_output_value1["input"].split('_')[1]) - 1
                                # previous_output_index.append(n)
                                previous_outputs.append({
                                    "input_index": int(output_key.split('_')[1])-1,
                                    "previous_output_node": edge[0],
                                    "previous_output_index": n
                                    })
        task = {
                "id": node_id,     # ノードのidを指定
                "previous_outputs": previous_outputs, # 前のノードとの接続
                "inputs_type": node["inputs_type"],  # このノードのinputのデータ型
                "next_inputs": next_inputs, # 次のノードとの接続
                "outputs_type": node["outputs_type"],  # このノードのoutputのデータ型
                "category": node["category"],  # ノードのカテゴリーを指定
                "class": node["class"],     # ノードのクラス名を指定
                "params": node["data"],     # ノードのパラメータを指定
            }
        print("previous_output",previous_outputs)
        print("next_input",next_inputs)
        task_list.append(task)

    print("task",task_list)
    task_runner = DynamicTaskRunner()

    result = task_runner.run_tasks(task_list)
    # result = {"status": "success"}
    print("result",result)

    if result["status"] == "success":
        return jsonify(result)
    else:
        return jsonify(result)

@app.route('/save_json', methods=['POST'])
def save_json():
    data = request.get_json()
    json_file_path = os.path.join('static', 'export.json')

    with open(json_file_path, 'w') as json_file:
        json.dump(data, json_file, indent=2)

    return jsonify({"message": "File saved successfully"}), 200

if __name__ == "__main__":  # メインプログラム
    app.run(debug=True, host='0.0.0.0', port=5000)
