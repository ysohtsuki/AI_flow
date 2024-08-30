from block.block import Block
import pandas as pd
import traceback

class Feature_Extraction(Block):
    def __init__(self, params=None):
        super().__init__()
        self.input_type = [pd.DataFrame]
        self.params = params["colam"]
        print("Feature_Extraction params:",self.params)

    def run(self, input_data=None):
        try:
            # print("feature input",self.input)
            data = self.input[0].copy()
            features = data.drop(columns=self.params)
            target = data[self.params]
            self.output = [[features,target]]
            # self.output = [[1,2,3],[4,5,6]]
            # print("output:",self.output)
            print("Feature_Extraction")
            return {"status": "success"}
        except Exception as error:
            print(f"Error occurred during task execution: {error}")
            print(traceback.format_exc())
            return {"status": "error","message": str(error)}