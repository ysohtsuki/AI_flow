import pandas as pd
from block.block import Block  
import traceback

class ReadCSV(Block):
    def __init__(self, params):
        super().__init__()
        self.path = params["file_path"]
        print("read_path", params["file_path"])

    def run(self, input_data=None):
        try:
            df = pd.read_csv(self.path)
            print("CSV file read successfully.")

            # print("CSV output:",df)

            self.output = [df]
            return {"status": "success"}
        except Exception as error:
            print(f"Error occurred during task execution: {error}")
            print(traceback.format_exc())
            return {"status": "error","message": str(error)}
