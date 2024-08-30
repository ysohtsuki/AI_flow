import pandas as pd
from block.block import Block  

class ReadDatabase(Block):
    def __init__(self):
        super().__init__()
        self.path = "file_name.csv"  #要変更

    def run(self, input_data=None):
        df = pd.read_csv(self.path)
        print("DB file read successfully.")
        self.output = df
        return df
