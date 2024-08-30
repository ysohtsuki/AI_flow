from block.block import Block
from sklearn.metrics import mean_squared_error
from sklearn.base import BaseEstimator
import traceback

class MSE(Block):
    def __init__(self, params=None):
        super().__init__()
        self.input_type = [BaseEstimator, list]

    def run(self, input_data=None):
        try:
            # print("MSE_input",self.input)

            # modelとdataをpredictメソッドを持っているかで判別
            model = self.input[0]
            test_data = self.input[1]
            
            # テストデータを分割
            X_test = test_data[0]
            y_test = test_data[1]

            # 予測
            y_pred = model.predict(X_test)

            # モデルの評価
            mse = mean_squared_error(y_test, y_pred)

            # print(len())
            
            print("Mean Squared Error:", mse)

            self.data = [mse]

            return {"status": "success"}
        except Exception as error:
            print(f"Error occurred during task execution: {error}")
            print(traceback.format_exc())
            return {"status": "error","message": str(error)}