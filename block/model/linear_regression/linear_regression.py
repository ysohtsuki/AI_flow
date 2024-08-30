from block.block import Block
import pandas as pd
from sklearn.linear_model import LinearRegression
import traceback

class Linear_regression(Block):
    def __init__(self, params=None):
        super().__init__()
        self.input_type = [list]

    def run(self, input_data=None):
        try: 
            # print("linear input", self.input)
            train_data = self.input[0]
            X_train = pd.DataFrame(train_data[0])
            y_train = train_data[1]

            # 線形回帰モデルの作成
            model = LinearRegression()

            # モデルの訓練
            model.fit(X_train, y_train)

            # self.output = [[11,12,13],[4,5,6]]
            self.output = [model]
            # print("Linear_regression output", self.output)
            print("Linear_regression")
            return {"status": "success"}
        except Exception as error:
            print(f"Error occurred during task execution: {error}")
            print(traceback.format_exc())
            return {"status": "error","message": str(error)}