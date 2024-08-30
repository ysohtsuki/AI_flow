from block.block import Block
import pandas as pd
import traceback

class Interpolation(Block):
    def __init__(self, params=None):
        super().__init__()
        self.input_type = [pd.DataFrame]
        self.params = params

    def run(self, input_data=None):
        try:
            data = self.input[0].copy()
            # print("before interpolation", data)
        
            # 欠損値の補間
            data['num_rooms'] = data['num_rooms'].fillna(data['num_rooms'].median())
            data['area'] = data['area'].fillna(data['area'].median())
            data['age'] = data['age'].fillna(data['age'].median())
            data['location'] = data['location'].fillna('unknown')
            data['price'] = data['price'].fillna(data['price'].median())
            
            # カテゴリカルデータのエンコード
            data = pd.get_dummies(data, columns=['location'], drop_first=True)
            
            # 出力として処理済みデータを設定
            self.output = [data]

            print("Interpolation")
            return {"status": "success"}
        except Exception as error:
            print(f"Error occurred during task execution: {error}")
            print(traceback.format_exc())
            return {"status": "error","message": str(error)}