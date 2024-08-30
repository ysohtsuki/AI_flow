from block.block import Block
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.metrics import accuracy_score
from sklearn.base import BaseEstimator


class Accuracy(Block):
    def __init__(self, params=None):
        super().__init__()
        self.input_type = [BaseEstimator,list]

    def run(self, input_data=None):
        # print("Accuracy_input",self.input)
        # modelとdataをpredictメソッドを持っているかで判別
        if hasattr(self.input[0], 'predict'):
            model = self.input[0]
            test_data = self.input[1]
        else:
            test_data = self.input[0]
            model = self.input[1]
        
        # テストデータを分割
        X_test = test_data[0]
        y_test = test_data[1]

        # 予測
        y_pred = model.predict(X_test)

        # モデルの評価
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        # accuracy = accuracy_score(y_test, y_pred)
        
        print("Mean Squared Error:", mse)
        print("R^2 Score:", r2)
        # print("Accuracy:", accuracy)

        self.output = 0.7