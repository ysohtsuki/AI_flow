from block.block import Block
import pandas as pd
from sklearn.model_selection import train_test_split
import traceback

class Split_data(Block):
    def __init__(self, params=None):
        super().__init__()
        self.input_type = [list]
        # print("Split_data_params",params)
        sum = float(params["train_rate"]) + float(params["test_rate"])
        self.test_rate = float(params["test_rate"]) / sum
        print("rate",self.test_rate,sum)

    def run(self, input_data=None):
        try:
            # print("slpit input",self.input)
            
            # print("input[0]",self.input[0])
            data = self.input[0]
            features = pd.DataFrame(data[0])
            target = data[1]
            X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=self.test_rate, random_state=42)
            # self.output = [[X_train, y_train], [X_test, y_test]]
            # print("split data",[[X_train, y_train], [X_test, y_test]])
            # print("split data", len(X_test), [X_test, y_test])

            self.output = [[X_train, y_train], [X_test, y_test]]
            # self.output = [[[1,2,3],[4,5,6]],[[7,8,9],[10,11,12]]]
            # self.output = [[1,2],[4,5]]
            # print("split data output",self.output)
            print("Split_data")
            return {"status": "success"}
        except Exception as error:
            print(f"Error occurred during task execution: {error}")
            print(traceback.format_exc())
            return {"status": "error","message": str(error)}